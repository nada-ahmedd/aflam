import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FaUserCircle } from 'react-icons/fa';
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchMovieReviews,
  fetchMovieRecommendations,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieExternalIds,
  fetchMovieReleaseDates,
  fetchSimilarMovies,
} from '../services/api';
import {
  setMovieDetails,
  setMovieCredits,
  setMovieVideos,
  setMovieReviews,
  setMovieRecommendations,
  setMovieImages,
  setMovieKeywords,
  setMovieExternalIds,
  setMovieReleaseDates,
  setSimilarMovies,
} from '../slices/moviesSlice';
import Navbar from './Navbar';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moviesState = useSelector((state) => state.movies);
  const { details, credits, videos, reviews, recommendations, images, keywords, externalIds, similar } = moviesState;
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [detailsData, creditsData, videosData, reviewsData, recommendationsData, imagesData, keywordsData, externalIdsData, releaseDatesData, similarData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchMovieVideos(id),
          fetchMovieReviews(id),
          fetchMovieRecommendations(id),
          fetchMovieImages(id),
          fetchMovieKeywords(id),
          fetchMovieExternalIds(id),
          fetchMovieReleaseDates(id),
          fetchSimilarMovies(id),
        ]);
        dispatch(setMovieDetails(detailsData));
        dispatch(setMovieCredits(creditsData));
        dispatch(setMovieVideos(videosData));
        dispatch(setMovieReviews(reviewsData));
        dispatch(setMovieRecommendations(recommendationsData));
        dispatch(setMovieImages(imagesData));
        dispatch(setMovieKeywords(keywordsData));
        dispatch(setMovieExternalIds(externalIdsData));
        dispatch(setMovieReleaseDates(releaseDatesData));
        dispatch(setSimilarMovies(similarData));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    loadDetails();
  }, [id, dispatch]);

  if (!details) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '40px 20px', position: 'relative' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: '#00bcd4', fontSize: '3rem', marginBottom: '30px', textShadow: '0 0 10px #00bcd4', transition: 'all 0.3s' }}>Movie Details</h1>
      
      {showTrailer && videos?.results?.[0]?.key && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '900px', width: '90%' }}>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videos.results[0].key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)' }}
            />
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute',
                top: '-60px',
                right: '10px',
                backgroundColor: '#ff4444',
                color: '#fff',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(255, 68, 68, 0.6)',
                transition: 'all 0.3s',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#cc0000'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#ff4444'; e.target.style.transform = 'scale(1)'; }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', maxWidth: '300px', width: '100%', margin: '0 auto' }}>
              <img
                src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/300x450'}
                alt={details.title}
                style={{ width: '100%', height: '450px', objectFit: 'cover', transition: 'opacity 0.3s' }}
                onMouseOver={(e) => (e.target.style.opacity = '0.9')}
                onMouseOut={(e) => (e.target.style.opacity = '1')}
              />
              <div className="card-body" style={{ backgroundColor: '#1a1a1a', padding: '20px', color: '#bbb' }}>
                <h3 className="text-center" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Movie Info</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Tagline:</strong> <span style={{ color: '#bbb' }}>{details.tagline || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Overview:</strong> <span style={{ color: '#bbb' }}>{details.overview || 'No overview available'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Release Date:</strong> <span style={{ color: '#bbb' }}>{details.release_date || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Runtime:</strong> <span style={{ color: '#bbb' }}>{details.runtime ? `${details.runtime} min` : 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Genres:</strong> <span style={{ color: '#bbb' }}>{details.genres?.map(g => g.name).join(', ') || 'N/A'}</span></p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Vote Average:</strong> <span style={{ color: '#bbb' }}>{details.vote_average} ({details.vote_count} votes)</span></p>
                </div>
                {videos?.results?.[0]?.key && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn btn-info w-100 mt-3"
                    style={{ padding: '10px', fontSize: '1rem', boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                  >
                    Play Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-8">
                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Top Billed Cast</h3>
                <div className="d-flex overflow-auto mb-4" style={{ gap: '15px', paddingBottom: '10px' }}>
                  {credits?.cast?.slice(0, 5).map(member => (
                    <div key={member.id} className="text-center" style={{ minWidth: '120px', transition: 'transform 0.3s' }}>
                      <Link to={`/person/${member.id}`}>
                        {member.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            alt={member.name}
                            style={{ width: '100px', height: '150px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)' }}
                            className="img-fluid"
                            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
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
                              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                              transition: 'transform 0.3s',
                            }}
                            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                          >
                            <FaUserCircle size={75} color="#ccc" />
                          </div>
                        )}
                        <p className="mt-2" style={{ fontSize: '0.9rem', color: '#fff' }}>{member.name}</p>
                        <p style={{ color: '#bbb', fontSize: '0.8rem' }}>{member.character}</p>
                      </Link>
                    </div>
                  ))}
                  {credits?.cast?.length > 5 && (
                    <div className="text-center" style={{ minWidth: '120px' }}>
                      <Link to={`/cast-crew/movie/${id}`}>
                        <button className="btn btn-info mt-3" style={{ padding: '6px 15px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                          onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                          onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                          View More
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Social</h3>
                <div className="mb-4">
                  <p><strong>Reviews ({reviews?.results?.length || 0})</strong></p>
                  {reviews?.results?.length > 0 && (
                    <>
                      {reviews.results.slice(0, 2).map(review => (
                        <div key={review.id} className="mb-3 p-3" style={{ backgroundColor: '#222', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', transition: 'transform 0.3s' }}
                          onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                          <p><strong style={{ color: '#00bcd4' }}>{review.author}</strong></p>
                          <p style={{ fontSize: '0.9rem' }}>{review.content.slice(0, 150)}...</p>
                        </div>
                      ))}
                      {reviews.results.length > 2 && (
                        <button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          className="btn btn-info mt-2"
                          style={{ padding: '6px 15px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                          onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                          onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                        >
                          {showAllReviews ? 'View Less' : `View More (${reviews.results.length - 2})`}
                        </button>
                      )}
                      {showAllReviews && reviews.results.slice(2).map(review => (
                        <div key={review.id} className="mb-3 p-3" style={{ backgroundColor: '#222', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', transition: 'transform 0.3s' }}
                          onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                          <p><strong style={{ color: '#00bcd4' }}>{review.author}</strong></p>
                          <p style={{ fontSize: '0.9rem' }}>{review.content.slice(0, 150)}...</p>
                        </div>
                      ))}
                    </>
                  )}
                  {!reviews?.results?.length && (
                    <p style={{ textAlign: 'center', color: '#ccc', fontSize: '0.9rem' }}>We don't have any reviews for {details.title}.</p>
                  )}
                </div>

                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Media</h3>
                <div className="mb-4">
                  <div className="d-flex mb-3" style={{ gap: '10px' }}>
                    <button
                      className={`btn me-2 ${activeTab === 'videos' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('videos')}
                      style={{ borderRadius: '10px', padding: '6px 15px', fontSize: '1rem', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s' }}
                      onMouseOver={(e) => { if (activeTab !== 'videos') e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                      onMouseOut={(e) => { if (activeTab !== 'videos') e.target.style.backgroundColor = '#fff'; e.target.style.transform = 'scale(1)'; }}
                    >
                      Videos ({videos?.results?.length || 0})
                    </button>
                    <button
                      className={`btn me-2 ${activeTab === 'backdrops' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('backdrops')}
                      style={{ borderRadius: '10px', padding: '6px 15px', fontSize: '1rem', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s' }}
                      onMouseOver={(e) => { if (activeTab !== 'backdrops') e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                      onMouseOut={(e) => { if (activeTab !== 'backdrops') e.target.style.backgroundColor = '#fff'; e.target.style.transform = 'scale(1)'; }}
                    >
                      Backdrops ({images?.backdrops?.length || 0})
                    </button>
                    <button
                      className={`btn ${activeTab === 'posters' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('posters')}
                      style={{ borderRadius: '10px', padding: '6px 15px', fontSize: '1rem', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s' }}
                      onMouseOver={(e) => { if (activeTab !== 'posters') e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                      onMouseOut={(e) => { if (activeTab !== 'posters') e.target.style.backgroundColor = '#fff'; e.target.style.transform = 'scale(1)'; }}
                    >
                      Posters ({images?.posters?.length || 0})
                    </button>
                  </div>

                  {activeTab === 'videos' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {videos?.results?.slice(0, 2).map(video => (
                        <div key={video.id} className="me-2 text-center" style={{ transition: 'transform 0.3s' }}
                          onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                          <iframe
                            width="300"
                            height="300"
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            frameBorder="0"
                            allowFullScreen
                            style={{ borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)' }}
                          />
                          <p style={{ fontSize: '0.8rem', marginTop: '8px', color: '#bbb' }}>{video.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'backdrops' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {images?.backdrops?.length > 0 ? (
                        <>
                          {images.backdrops.slice(0, 4).map(image => (
                            <img
                              key={image.file_path}
                              src={image.file_path ? `https://image.tmdb.org/t/p/w300${image.file_path}` : 'https://via.placeholder.com/150x85'}
                              alt="Backdrop"
                              style={{ width: '300px', height: '300px', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)', objectFit: 'cover', transition: 'transform 0.3s' }}
                              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                            />
                          ))}
                          {images.backdrops.length > 4 && (
                            <Link to={`/movie/${id}/backdrops`} className="btn btn-info ms-2" style={{ padding: '6px 15px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                              View More
                            </Link>
                          )}
                        </>
                      ) : (
                        <p style={{ textAlign: 'center', color: '#ccc', fontSize: '0.9rem' }}>No backdrops available</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'posters' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {images?.posters?.length > 0 ? (
                        <>
                          {images.posters.slice(0, 4).map(image => (
                            <img
                              key={image.file_path}
                              src={image.file_path ? `https://image.tmdb.org/t/p/w200${image.file_path}` : 'https://via.placeholder.com/100x150'}
                              alt="Poster"
                              style={{ width: '300px', height: '300px', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)', objectFit: 'cover', transition: 'transform 0.3s' }}
                              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                            />
                          ))}
                          {images.posters.length > 4 && (
                            <Link to={`/movie/${id}/posters`} className="btn btn-info ms-2" style={{ padding: '6px 15px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                              onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                              View More
                            </Link>
                          )}
                        </>
                      ) : (
                        <p style={{ textAlign: 'center', color: '#ccc', fontSize: '0.9rem' }}>No posters available</p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Recommendations</h3>
                <div className="d-flex overflow-x-auto" style={{ gap: '15px', paddingBottom: '15px' }}>
                  {recommendations?.results?.map(rec => (
                    <div key={rec.id} style={{ transition: 'transform 0.3s', flex: '0 0 auto' }}>
                      <div className="card bg-secondary" style={{ borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', overflow: 'hidden', maxWidth: '200px', width: '100%' }}>
                        <img
                          src={rec.poster_path ? `https://image.tmdb.org/t/p/w300${rec.poster_path}` : 'https://via.placeholder.com/200x300'}
                          alt={rec.title}
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                        <div className="card-body" style={{ backgroundColor: '#333', padding: '10px' }}>
                          <h5 style={{ fontSize: '1rem', margin: '0', color: '#fff' }}>{rec.title}</h5>
                          <Link to={`/details/movie/${rec.id}`} className="btn btn-info mt-2" style={{ padding: '6px 12px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Similar Movies</h3>
                <div className="d-flex overflow-x-auto" style={{ gap: '15px', paddingBottom: '15px' }}>
                  {similar?.results?.map(movie => (
                    <div key={movie.id} style={{ transition: 'transform 0.3s', flex: '0 0 auto' }}>
                      <div className="card bg-secondary" style={{ borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', overflow: 'hidden', maxWidth: '200px', width: '100%' }}>
                        <img
                          src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
                          alt={movie.title}
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                        <div className="card-body" style={{ backgroundColor: '#333', padding: '10px' }}>
                          <h5 style={{ fontSize: '1rem', margin: '0', color: '#fff' }}>{movie.title}</h5>
                          <Link to={`/details/movie/${movie.id}`} className="btn btn-info mt-2" style={{ padding: '6px 12px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-4">
                <h3 className="text-info mb-4" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Details</h3>
                <div className="card p-3" style={{ backgroundColor: '#1a1a1a', borderRadius: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', maxWidth: '300px', width: '100%', margin: '0 auto' }}
                >
                  <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#fff' }}><strong>Status:</strong> <span style={{ color: '#ddd' }}>{details.status || 'Released'}</span></p>
                  <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#fff' }}><strong>Original Language:</strong> <span style={{ color: '#ddd' }}>{details.original_language?.toUpperCase() || 'N/A'}</span></p>
                  <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#fff' }}><strong>Budget:</strong> <span style={{ color: '#ddd' }}>${details.budget ? details.budget.toLocaleString() : 'N/A'}</span></p>
                  <p style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#fff' }}><strong>Revenue:</strong> <span style={{ color: '#ddd' }}>${details.revenue ? details.revenue.toLocaleString() : 'N/A'}</span></p>
                  <h3 className="text-info mt-3 mb-2" style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Keywords</h3>
                  <div className="d-flex flex-wrap" style={{ gap: '8px' }}>
                    {keywords?.keywords?.slice(0, 5).map(keyword => (
                      <span key={keyword.id} style={{ backgroundColor: '#00bcd4', padding: '6px 12px', borderRadius: '15px', color: '#fff', fontSize: '0.8rem', transition: 'transform 0.3s' }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                        {keyword.name}
                      </span>
                    ))}
                    {keywords?.keywords?.length > 5 && (
                      <Link to={`/keywords/movie/${id}`}>
                        
                      </Link>
                    )}
                  </div>
                  <h3 className="text-info mt-3 mb-2" style={{ marginBottom: '10px', fontSize: '1.2rem' }}>Social Media</h3>
                  <div className="d-flex" style={{ gap: '15px' }}>
                    {externalIds?.facebook_id && (
                      <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'transform 0.3s' }}
                        onMouseOver={(e) => { e.target.style.color = '#3b5998'; e.target.style.transform = 'scale(1.2)'; }}
                        onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                        <FontAwesomeIcon icon={faFacebook} size="lg" />
                      </a>
                    )}
                    {externalIds?.twitter_id && (
                      <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'transform 0.3s' }}
                        onMouseOver={(e) => { e.target.style.color = '#1da1f2'; e.target.style.transform = 'scale(1.2)'; }}
                        onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                      </a>
                    )}
                    {externalIds?.instagram_id && (
                      <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'transform 0.3s' }}
                        onMouseOver={(e) => { e.target.style.color = '#e1306c'; e.target.style.transform = 'scale(1.2)'; }}
                        onMouseOut={(e) => { e.target.style.color = '#fff'; e.target.style.transform = 'scale(1)'; }}>
                        <FontAwesomeIcon icon={faInstagram} size="lg" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-info mt-4" onClick={() => navigate(-1)} style={{ padding: '10px 20px', fontSize: '1rem', boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
        Back
      </button>
    </div>
  );
};

export default MovieDetails;