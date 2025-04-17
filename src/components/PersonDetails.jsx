import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  fetchPersonDetails,
  fetchPersonCombinedCredits, 
  fetchPersonExternalIds,
} from '../services/api';
import {
  setPersonDetails,
  setPersonCombinedCredits, 
  setPersonExternalIds,
} from '../slices/personSlice';
import Navbar from './Navbar';

const PersonDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const personState = useSelector((state) => state.person);
  const { details, combinedCredits, externalIds } = personState; 
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullActing, setShowFullActing] = useState(false);
  const [showFullCrew, setShowFullCrew] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [detailsData, creditsData, externalIdsData] = await Promise.all([
          fetchPersonDetails(id),
          fetchPersonCombinedCredits(id),
          fetchPersonExternalIds(id),
        ]);
        dispatch(setPersonDetails(detailsData));
        dispatch(setPersonCombinedCredits(creditsData)); 
        dispatch(setPersonExternalIds(externalIdsData));
      } catch (error) {
        console.error('Error fetching person details:', error);
      }
    };
    loadDetails();
  }, [id, dispatch]);

  if (!details) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const bioLimit = 150;
  const actingLimit = 3;
  const crewLimit = 3;
  const biographyText = details.biography || 'No biography available';
  const actingList = combinedCredits?.cast?.map(item => `${item.title || item.name} (${item.character})`) || [];
  const crewList = combinedCredits?.crew?.map(item => `${item.title || item.name} (${item.job})`) || [];

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: '#00bcd4', fontSize: '3rem', marginBottom: '30px', textShadow: '0 0 10px #00bcd4', transition: 'all 0.3s' }}>Person Details</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', maxWidth: '300px', width: '100%', margin: '0 auto' }}>
              <img
                src={details.profile_path ? `https://image.tmdb.org/t/p/w500${details.profile_path}` : 'https://via.placeholder.com/300x450'}
                alt={details.name}
                style={{ width: '100%', height: '450px', objectFit: 'cover', transition: 'opacity 0.3s' }}
                onMouseOver={(e) => (e.target.style.opacity = '0.9')}
                onMouseOut={(e) => (e.target.style.opacity = '1')}
              />
              <div className="card-body" style={{ backgroundColor: '#1a1a1a', padding: '20px', color: '#bbb' }}>
                <h3 className="text-center text-info" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Personal Info</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Name:</strong> <span style={{ color: '#bbb' }}>{details.name || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Birthday:</strong> <span style={{ color: '#bbb' }}>{details.birthday || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Place of Birth:</strong> <span style={{ color: '#bbb' }}>{details.place_of_birth || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <strong>Biography:</strong>{' '}
                    <span style={{ color: '#bbb' }}>
                      {showFullBio || biographyText.length <= bioLimit ? biographyText : `${biographyText.slice(0, bioLimit)}...`}
                    </span>
                    {biographyText.length > bioLimit && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="btn btn-info mt-2"
                        style={{ padding: '5px 10px', fontSize: '0.8rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                      >
                        {showFullBio ? 'View Less' : 'View More'}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <h3 className="text-info mb-4" style={{ fontSize: '1.5rem' }}>Known For</h3>
            <div className="d-flex overflow-auto mb-4" style={{ gap: '15px', paddingBottom: '10px' }}>
              {combinedCredits?.cast?.slice(0, 10).map(item => (
                <div key={item.id} className="text-center" style={{ minWidth: '120px', transition: 'transform 0.3s' }}>
                  <Link to={item.media_type === 'movie' ? `/details/movie/${item.id}` : `/details/tv/${item.id}`}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/120x180'}
                      alt={item.title || item.name}
                      style={{ width: '120px', height: '180px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)' }}
                      onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                    <p className="mt-2" style={{ fontSize: '0.9rem', color: '#fff' }}>{item.title || item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#ccc' }}>{item.character}</p>
                  </Link>
                </div>
              ))}
            </div>

            <h3 className="text-info mb-4" style={{ fontSize: '1.5rem' }}>Credits</h3>
            <div className="mb-4 p-3" style={{ backgroundColor: '#1a1a1a', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', transition: 'transform 0.3s' }}
              onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
              <p style={{ fontSize: '0.9rem', margin: '0 0 10px' }}>
                <strong>Acting:</strong>{' '}
                <span style={{ color: '#bbb' }}>
                  {showFullActing || actingList.length <= actingLimit 
                    ? actingList.join(', ') 
                    : `${actingList.slice(0, actingLimit).join(', ')}${actingList.length > actingLimit ? '...' : ''}`}
                </span>
                {actingList.length > actingLimit && (
                  <button
                    onClick={() => setShowFullActing(!showFullActing)}
                    className="btn btn-info mt-2"
                    style={{ padding: '5px 10px', fontSize: '0.8rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                  >
                    {showFullActing ? 'View Less' : `View More (${actingList.length - actingLimit})`}
                  </button>
                )}
              </p>
              <p style={{ fontSize: '0.9rem', margin: '0' }}>
                <strong>Crew:</strong>{' '}
                <span style={{ color: '#bbb' }}>
                  {showFullCrew || crewList.length <= crewLimit 
                    ? crewList.join(', ') 
                    : `${crewList.slice(0, crewLimit).join(', ')}${crewList.length > crewLimit ? '...' : ''}`}
                </span>
                {crewList.length > crewLimit && (
                  <button
                    onClick={() => setShowFullCrew(!showFullCrew)}
                    className="btn btn-info mt-2"
                    style={{ padding: '5px 10px', fontSize: '0.8rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                  >
                    {showFullCrew ? 'View Less' : `View More (${crewList.length - crewLimit})`}
                  </button>
                )}
              </p>
            </div>

            <h3 className="text-info mb-4" style={{ fontSize: '1.5rem' }}>Social Media</h3>
            <div className="d-flex" style={{ gap: '20px' }}>
              {externalIds?.facebook_id && (
                <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}
                  onMouseOver={(e) => { e.target.style.color = '#3b5998'; e.target.style.transform = 'scale(1.2)'; }}
                  onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                  <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
              )}
              {externalIds?.twitter_id && (
                <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}
                  onMouseOver={(e) => { e.target.style.color = '#1da1f2'; e.target.style.transform = 'scale(1.2)'; }}
                  onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                  <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
              )}
              {externalIds?.instagram_id && (
                <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}
                  onMouseOver={(e) => { e.target.style.color = '#e1306c'; e.target.style.transform = 'scale(1.2)'; }}
                  onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                  <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-info mt-4" onClick={() => navigate(-1)}
        style={{ padding: '10px 20px', fontSize: '1rem', boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
        Back
      </button>
    </div>
  );
};

export default PersonDetails;