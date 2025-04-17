import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import { FaUserCircle } from 'react-icons/fa'; 

import {
  fetchMovieCredits,
  fetchMovieDetails,
} from '../services/api'; 
import {
  fetchSeriesCredits,
  fetchSeriesDetails,
} from '../services/api'; 

import {
  setMovieCredits,
  setMovieDetails,
} from '../slices/moviesSlice';
import {
  setSeriesCredits,
  setSeriesDetails,
} from '../slices/seriesSlice';

const CastCrew = () => {
  const { type, id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaState = useSelector((state) => (type === 'movie' ? state.movies : state.series));
  const { details, credits } = mediaState;

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (type === 'movie') {
          const [detailsData, creditsData] = await Promise.all([
            fetchMovieDetails(id),
            fetchMovieCredits(id),
          ]);
          dispatch(setMovieDetails(detailsData));
          dispatch(setMovieCredits(creditsData));
        } else if (type === 'tv') {
          const [detailsData, creditsData] = await Promise.all([
            fetchSeriesDetails(id),
            fetchSeriesCredits(id),
          ]);
          dispatch(setSeriesDetails(detailsData));
          dispatch(setSeriesCredits(creditsData));
        }
      } catch (error) {
        console.error('Error fetching cast and crew:', error);
      }
    };
    loadDetails();
  }, [id, type, dispatch]);

  if (!details || !credits) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: '#00bcd4', fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 10px #00bcd4', transition: 'all 0.3s' }}>
        {details.title || details.name} ({new Date(details.release_date || details.first_air_date).getFullYear()})
      </h1>
      <button className="btn btn-info mb-4" onClick={() => navigate(-1)}
        style={{ padding: '10px 20px', fontSize: '1rem', boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
        Back to {type === 'movie' ? 'Movie' : 'Series'}
      </button>
      
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h3 className="text-info mb-3" style={{ fontSize: '1.5rem' }}>Cast ({credits?.cast?.length || 0})</h3>
            <div className="row">
              {credits?.cast?.length > 0 ? (
                credits.cast.map(member => (
                  <div key={member.id} className="col-md-4 col-sm-6 mb-4">
                    <Link to={`/person/${member.id}`}>
                      <div className="text-center" style={{ transition: 'transform 0.3s' }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                        {member.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            alt={member.name}
                            style={{ width: '120px', height: '180px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)' }}
                            className="img-fluid"
                          />
                        ) : (
                          <div
                            style={{
                              width: '120px',
                              height: '180px',
                              borderRadius: '50%',
                              backgroundColor: '#333',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              margin: '0 auto',
                              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <FaUserCircle size={100} color="#ccc" />
                          </div>
                        )}
                        <p className="mt-2" style={{ fontSize: '1rem', color: '#fff' }}>{member.name}</p>
                        <p style={{ color: '#bbb', fontSize: '0.9rem' }}>{member.character}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: '#ccc', fontSize: '1rem', textAlign: 'center' }}>No cast available</p>
              )}
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <h3 className="text-info mb-3" style={{ fontSize: '1.5rem' }}>Crew ({credits?.crew?.length || 0})</h3>
            <div className="row">
              {credits?.crew?.length > 0 ? (
                credits.crew.map(member => (
                  <div key={`${member.id}-${member.job}`} className="col-md-4 col-sm-6 mb-4">
                    <Link to={`/person/${member.id}`}>
                      <div className="text-center" style={{ transition: 'transform 0.3s' }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                        {member.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            alt={member.name}
                            style={{ width: '120px', height: '180px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)' }}
                            className="img-fluid"
                          />
                        ) : (
                          <div
                            style={{
                              width: '120px',
                              height: '180px',
                              borderRadius: '50%',
                              backgroundColor: '#333',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              margin: '0 auto',
                              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <FaUserCircle size={100} color="#ccc" />
                          </div>
                        )}
                        <p className="mt-2" style={{ fontSize: '1rem', color: '#fff' }}>{member.name}</p>
                        <p style={{ color: '#bbb', fontSize: '0.9rem' }}>{member.job}</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: '#ccc', fontSize: '1rem', textAlign: 'center' }}>No crew available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCrew;