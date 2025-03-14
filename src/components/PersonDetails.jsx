import React, { useEffect } from 'react';
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

  if (!details) return <div style={{ color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan' }}>Person Details</h1>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <img
              src={details.profile_path ? `https://image.tmdb.org/t/p/w500${details.profile_path}` : 'https://via.placeholder.com/500x750'}
              alt={details.name}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <div className="mt-3">
              <h3 className="text-info">Personal Info</h3>
              <p><strong>Name:</strong> {details.name || 'N/A'}</p>
              <p><strong>Birthday:</strong> {details.birthday || 'N/A'}</p>
              <p><strong>Place of Birth:</strong> {details.place_of_birth || 'N/A'}</p>
              <p><strong>Biography:</strong> {details.biography || 'No biography available'}</p>
            </div>
          </div>
          <div className="col-md-8">
            <h3>Known For</h3>
            <div className="d-flex overflow-auto mb-4">
              {combinedCredits?.cast?.slice(0, 10).map(item => (
                <div key={item.id} className="text-center me-3">
                  <Link to={item.media_type === 'movie' ? `/details/movie/${item.id}` : `/details/tv/${item.id}`}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/100'}
                      alt={item.title || item.name}
                      style={{ width: '100px', height: '150px', borderRadius: '10px' }}
                    />
                    <p className="mt-2">{item.title || item.name}</p>
                    <p style={{ color: '#ccc' }}>{item.character}</p>
                  </Link>
                </div>
              ))}
            </div>

            <h3>Credits</h3>
            <div className="mb-4">
              <p><strong>Acting:</strong> {combinedCredits?.cast?.map(item => `${item.title || item.name} (${item.character})`).join(', ') || 'N/A'}</p>
              <p><strong>Crew:</strong> {combinedCredits?.crew?.map(item => `${item.title || item.name} (${item.job})`).join(', ') || 'N/A'}</p>
            </div>

            <h3 className="text-info mt-3">Social Media</h3>
            <div className="d-flex">
              {externalIds?.facebook_id && (
                <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" className="me-3"><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
              )}
              {externalIds?.twitter_id && (
                <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="me-3"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
              )}
              {externalIds?.instagram_id && (
                <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} size="2x" /></a>
              )}
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-info mt-3" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default PersonDetails;