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

  if (!details || !credits) return <div style={{ color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan' }}>
        {details.title || details.name} ({new Date(details.release_date || details.first_air_date).getFullYear()})
      </h1>
      <button className="btn btn-info mb-3" onClick={() => navigate(-1)}>Back to {type === 'movie' ? 'Movie' : 'Series'}</button>
      
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <h3>Cast {credits?.cast?.length || 0}</h3>
            <div className="row">
              {credits?.cast?.map(member => (
                <div key={member.id} className="col-md-4 mb-3">
                  <Link to={`/person/${member.id}`}>
                    <div className="text-center">
                      {member.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                          alt={member.name}
                          style={{ width: '100px', height: '150px', borderRadius: '50%' }}
                          className="img-fluid"
                        />
                      ) : (
                        <div
                          style={{
                            width: '100px',
                            height: '150px',
                            borderRadius: '50%',
                            backgroundColor: '#444',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                          }}
                        >
                          <FaUserCircle size={80} color="#ccc" />
                        </div>
                      )}
                      <p className="mt-2">{member.name}</p>
                      <p style={{ color: '#ccc' }}>{member.character}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <h3>Crew {credits?.crew?.length || 0}</h3>
            <div className="row">
              {credits?.crew?.map(member => (
                <div key={`${member.id}-${member.job}`} className="col-md-4 mb-3">
                  <Link to={`/person/${member.id}`}>
                    <div className="text-center">
                      {member.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                          alt={member.name}
                          style={{ width: '100px', height: '150px', borderRadius: '50%' }}
                          className="img-fluid"
                        />
                      ) : (
                        <div
                          style={{
                            width: '100px',
                            height: '150px',
                            borderRadius: '50%',
                            backgroundColor: '#444',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                          }}
                        >
                          <FaUserCircle size={80} color="#ccc" />
                        </div>
                      )}
                      <p className="mt-2">{member.name}</p>
                      <p style={{ color: '#ccc' }}>{member.job}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCrew;