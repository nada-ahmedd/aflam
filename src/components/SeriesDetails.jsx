import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FaUserCircle } from 'react-icons/fa';
import {
  fetchSeriesDetails, fetchSeriesCredits, fetchSeriesVideos, fetchSeriesReviews, fetchSeriesRecommendations,
  fetchSeriesImages, fetchSeriesKeywords, fetchSeriesExternalIds, fetchSeriesContentRatings, fetchSimilarSeries,
  fetchSeasonDetails, fetchEpisodeDetails,
} from '../services/api';
import {
  setSeriesDetails, setSeriesCredits, setSeriesVideos, setSeriesReviews, setSeriesRecommendations,
  setSeriesImages, setSeriesKeywords, setSeriesExternalIds, setSeriesContentRatings, setSimilarSeries,
  setSeasonDetails, setEpisodeDetails,
} from '../slices/seriesSlice';
import Navbar from './Navbar';

const SeriesDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seriesState = useSelector((state) => state.series);
  const { details, credits, videos, reviews, recommendations, images, keywords, externalIds, contentRatings, similar, seasons } = seriesState;
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('videos'); 

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [detailsData, creditsData, videosData, reviewsData, recommendationsData, imagesData, keywordsData, externalIdsData, contentRatingsData, similarData] = await Promise.all([
          fetchSeriesDetails(id),
          fetchSeriesCredits(id),
          fetchSeriesVideos(id),
          fetchSeriesReviews(id),
          fetchSeriesRecommendations(id),
          fetchSeriesImages(id),
          fetchSeriesKeywords(id),
          fetchSeriesExternalIds(id),
          fetchSeriesContentRatings(id),
          fetchSimilarSeries(id),
        ]);
        dispatch(setSeriesDetails(detailsData));
        dispatch(setSeriesCredits(creditsData));
        dispatch(setSeriesVideos(videosData.results || []));
        dispatch(setSeriesReviews(reviewsData.results || []));
        dispatch(setSeriesRecommendations(recommendationsData.results || []));
        dispatch(setSeriesImages(imagesData));
        dispatch(setSeriesKeywords(keywordsData.results || []));
        dispatch(setSeriesExternalIds(externalIdsData));
        dispatch(setSeriesContentRatings(contentRatingsData.results || []));
        dispatch(setSimilarSeries(similarData.results || []));
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    };
    loadDetails();
  }, [id, dispatch]);

  useEffect(() => {
    const loadSeasonDetails = async () => {
      if (details?.number_of_seasons >= selectedSeason) {
        try {
          const seasonData = await fetchSeasonDetails(id, selectedSeason);
          dispatch(setSeasonDetails(seasonData));
          if (seasonData.episodes?.length) {
            const episodeData = await fetchEpisodeDetails(id, selectedSeason, 1);
            dispatch(setEpisodeDetails(episodeData));
          }
        } catch (error) {
          console.error('Error fetching season details:', error);
        }
      }
    };
    loadSeasonDetails();
  }, [id, selectedSeason, dispatch, details?.number_of_seasons]);

  if (!details) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', position: 'relative' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan', fontSize: '2.5rem', marginBottom: '20px', textShadow: '0 0 5px #00ffff' }}>Series Details</h1>
      
      {showTrailer && videos?.[0]?.key && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
          }}
        >
          <div style={{ position: 'relative' }}>
            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${videos[0].key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute',
                top: '-50px',
                right: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(220, 53, 69, 0.5)',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
              <img
                src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/500x750'}
                alt={details.name}
                style={{ width: '100%', borderRadius: '0' }}
              />
              <div className="card-body" style={{ backgroundColor: '#fff', padding: '20px' }}>
                <h3 className="text-info text-center" style={{ marginBottom: '15px' }}>Series Info</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <p style={{ margin: '0' }}><strong>Tagline:</strong> {details.tagline || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Overview:</strong> {details.overview || 'No overview available'}</p>
                  <p style={{ margin: '0' }}><strong>First Air Date:</strong> {details.first_air_date || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Number of Seasons:</strong> {details.number_of_seasons || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Number of Episodes:</strong> {details.number_of_episodes || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Genres:</strong> {details.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Networks:</strong> {details.networks?.map(n => n.name).join(', ') || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Production Companies:</strong> {details.production_companies?.map(c => c.name).join(', ') || 'N/A'}</p>
                  <p style={{ margin: '0' }}><strong>Vote Average:</strong> {details.vote_average} ({details.vote_count} votes)</p>
                </div>
                {videos?.[0]?.key && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn btn-info w-100 mt-3"
                    style={{ transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0, 123, 255, 0.5)' }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
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
                <h3 className="text-info mb-3" style={{ marginBottom: '15px' }}>Top Billed Cast</h3>
                <div className="d-flex overflow-auto mb-4" style={{ gap: '15px', paddingBottom: '10px' }}>
                  {credits?.cast?.slice(0, 7).map(member => (
                    <div key={member.id} className="text-center" style={{ minWidth: '120px' }}>
                      <Link to={`/person/${member.id}`}>
                        {member.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            alt={member.name}
                            style={{ width: '100px', height: '150px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100px',
                              height: '150px',
                              borderRadius: '50%',
                              backgroundColor: '#fff',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              margin: '0 auto',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <FaUserCircle size={80} color="#ccc" />
                          </div>
                        )}
                        <p className="mt-2" style={{ fontSize: '0.9rem', color: '#fff' }}>{member.name}</p>
                        <p style={{ color: '#bbb', fontSize: '0.8rem' }}>{member.character}</p>
                      </Link>
                    </div>
                  ))}
                  {credits?.cast?.length > 7 && (
                    <div className="text-center" style={{ minWidth: '120px' }}>
                      <Link to={`/cast-crew/tv/${id}`}>
                        <button className="btn btn-info mt-4" style={{ padding: '5px 15px' }}>View More</button>
                      </Link>
                    </div>
                  )}
                </div>

                <h3 className="text-info mb-3" style={{ marginBottom: '15px' }}>Seasons</h3>
                <div className="mb-4">
                  <select value={selectedSeason} onChange={(e) => setSelectedSeason(Number(e.target.value))} className="form-select w-25 mb-3" style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '8px' }}>
                    {[...Array(details.number_of_seasons || 0)].map((_, i) => (
                      <option key={i + 1} value={i + 1} style={{ backgroundColor: '#333', color: '#fff' }}>Season {i + 1}</option>
                    ))}
                  </select>
                  {seasons[selectedSeason] && (
                    <div className="card p-3" style={{ backgroundColor: '#222', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                      <h4 className="text-info">Season {selectedSeason}</h4>
                      <p><strong>Air Date:</strong> {seasons[selectedSeason].air_date || 'N/A'}</p>
                      <p><strong>Episodes:</strong> {seasons[selectedSeason].episodes?.length || 'N/A'}</p>
                      <div className="row">
                        {seasons[selectedSeason].episodes?.slice(0, 4).map(episode => (
                          <div key={episode.id} className="col-md-3 mb-3">
                            <div className="card text-white bg-secondary" style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
                              <img
                                src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : 'https://via.placeholder.com/100'}
                                alt={episode.name}
                                style={{ borderRadius: '0', width: '100%', height: '150px', objectFit: 'cover' }}
                              />
                              <div className="card-body" style={{ backgroundColor: '#333', padding: '10px' }}>
                                <h5 style={{ fontSize: '1rem', margin: '0' }}>{episode.name}</h5>
                                <p style={{ fontSize: '0.9rem', margin: '0' }}>Episode {episode.episode_number}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-info mb-3" style={{ marginBottom: '15px' }}>Social</h3>
                <div className="mb-4">
                  <p><strong>Reviews ({reviews?.length || 0})</strong></p>
                  {reviews?.length ? (
                    reviews.map(review => (
                      <div key={review.id} className="mb-3 p-3" style={{ backgroundColor: '#222', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        <p><strong>{review.author}</strong></p>
                        <p style={{ fontSize: '0.9rem' }}>{review.content.slice(0, 200)}...</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: '#ccc' }}>We don't have any reviews for {details.name}.</p>
                  )}
                </div>

                <h3 className="text-info mb-3" style={{ marginBottom: '15px' }}>Media</h3>
                <div className="mb-4">
                  <div className="d-flex mb-3" style={{ gap: '10px' }}>
                    <button
                      className={`btn me-2 ${activeTab === 'videos' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('videos')}
                      style={{ borderRadius: '8px', padding: '5px 15px' }}
                    >
                      Videos ({videos?.length || 0})
                    </button>
                    <button
                      className={`btn me-2 ${activeTab === 'backdrops' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('backdrops')}
                      style={{ borderRadius: '8px', padding: '5px 15px' }}
                    >
                      Backdrops ({images?.backdrops?.length || 0})
                    </button>
                    <button
                      className={`btn ${activeTab === 'posters' ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => setActiveTab('posters')}
                      style={{ borderRadius: '8px', padding: '5px 15px' }}
                    >
                      Posters ({images?.posters?.length || 0})
                    </button>
                  </div>

                  {activeTab === 'videos' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {videos?.slice(0, 2).map(video => (
                        <div key={video.id} className="me-3 text-center">
                          <iframe
                            width="200"
                            height="150"
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            frameBorder="0"
                            allowFullScreen
                            style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                          />
                          <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>{video.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'backdrops' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {images?.backdrops?.length > 0 ? (
                        images.backdrops.slice(0, 4).map(image => (
                          <img
                            key={image.file_path}
                            src={image.file_path ? `https://image.tmdb.org/t/p/w500${image.file_path}` : 'https://via.placeholder.com/150x85'}
                            alt="Backdrop"
                            style={{ width: '150px', height: '85px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', objectFit: 'cover' }}
                          />
                        ))
                      ) : (
                        <p style={{ textAlign: 'center', color: '#ccc' }}>No backdrops available</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'posters' && (
                    <div className="d-flex overflow-auto mb-3" style={{ gap: '15px' }}>
                      {images?.posters?.length > 0 ? (
                        images.posters.slice(0, 4).map(image => (
                          <img
                            key={image.file_path}
                            src={image.file_path ? `https://image.tmdb.org/t/p/w500${image.file_path}` : 'https://via.placeholder.com/100x150'}
                            alt="Poster"
                            style={{ width: '100px', height: '150px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', objectFit: 'cover' }}
                          />
                        ))
                      ) : (
                        <p style={{ textAlign: 'center', color: '#ccc' }}>No posters available</p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-info mt-4 mb-3" style={{ marginBottom: '15px' }}>Recommendations</h3>
                <div className="row">
                  {recommendations?.slice(0, 4).map(rec => (
                    <div key={rec.id} className="col-md-3 mb-4">
                      <div className="card text-white bg-secondary" style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
                        <img
                          src={rec.poster_path ? `https://image.tmdb.org/t/p/w500${rec.poster_path}` : 'https://via.placeholder.com/500x750'}
                          alt={rec.name}
                          style={{ borderRadius: '0', width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                        <div className="card-body" style={{ backgroundColor: '#333', padding: '10px' }}>
                          <h5 style={{ fontSize: '1rem', margin: '0' }}>{rec.name}</h5>
                          <Link to={`/details/tv/${rec.id}`} className="btn btn-info mt-2" style={{ padding: '5px 10px' }}>Details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-info mt-4 mb-3" style={{ marginBottom: '15px' }}>Similar Series</h3>
                <div className="row">
                  {similar?.slice(0, 4).map(series => (
                    <div key={series.id} className="col-md-3 mb-4">
                      <div className="card text-white bg-secondary" style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
                        <img
                          src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://via.placeholder.com/500x750'}
                          alt={series.name}
                          style={{ borderRadius: '0', width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                        <div className="card-body" style={{ backgroundColor: '#333', padding: '10px' }}>
                          <h5 style={{ fontSize: '1rem', margin: '0' }}>{series.name}</h5>
                          <Link to={`/details/tv/${series.id}`} className="btn btn-info mt-2" style={{ padding: '5px 10px' }}>Details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-4">
                <h3 className="text-info mb-3" style={{ marginBottom: '15px' }}>Details</h3>
                <div className="card p-3" style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                  <p style={{ margin: '0 0 10px' }}><strong>Status:</strong> {details.status || 'N/A'}</p>
                  <p style={{ margin: '0 0 10px' }}><strong>Original Language:</strong> {details.original_language?.toUpperCase() || 'N/A'}</p>
                  <p style={{ margin: '0 0 10px' }}><strong>Content Ratings:</strong></p>
                  <div style={{ color: '#000', paddingLeft: '15px' }}>
                    {contentRatings.map(rating => (
                      <span key={rating.iso_3166_1} style={{ display: 'block' }}>{rating.iso_3166_1}: {rating.rating}</span>
                    ))}
                  </div>
                  <h3 className="text-info mt-3 mb-2" style={{ marginBottom: '10px' }}>Keywords</h3>
                  <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                    {keywords.map(keyword => (
                      <span key={keyword.id} style={{ backgroundColor: '#444', padding: '5px 10px', borderRadius: '15px', color: '#fff', fontSize: '0.9rem' }}>{keyword.name}</span>
                    ))}
                  </div>
                  <h3 className="text-info mt-3 mb-2" style={{ marginBottom: '10px' }}>Social Media</h3>
                  <div className="d-flex" style={{ gap: '15px' }}>
                    {externalIds?.facebook_id && (
                      <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'color 0.3s' }}
                        onMouseOver={(e) => (e.target.style.color = '#3b5998')}
                        onMouseOut={(e) => (e.target.style.color = '#fff')}>
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                      </a>
                    )}
                    {externalIds?.twitter_id && (
                      <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'color 0.3s' }}
                        onMouseOver={(e) => (e.target.style.color = '#1da1f2')}
                        onMouseOut={(e) => (e.target.style.color = '#fff')}>
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                      </a>
                    )}
                    {externalIds?.instagram_id && (
                      <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-white" style={{ transition: 'color 0.3s' }}
                        onMouseOver={(e) => (e.target.style.color = '#e1306c')}
                        onMouseOut={(e) => (e.target.style.color = '#fff')}>
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-info mt-3" onClick={() => navigate(-1)} style={{ padding: '10px 20px', boxShadow: '0 2px 4px rgba(0, 123, 255, 0.5)', transition: 'all 0.3s' }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}>
        Back
      </button>
    </div>
  );
};

export default SeriesDetails;