import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMovies, setTopMovies } from '../slices/moviesSlice';
import { setSeries, setTopSeries } from '../slices/seriesSlice';
import { fetchMovies, fetchTopMovies, fetchSeries, fetchTopSeries } from '../services/api';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; 

const Home = () => {
  const dispatch = useDispatch();
  const moviesState = useSelector((state) => state.movies) || {};
  const seriesState = useSelector((state) => state.series) || {};
  const movies = moviesState.data || [];
  const topMovies = moviesState.topMovies || [];
  const series = seriesState.data || [];
  const topSeries = seriesState.topSeries || [];
  const cardsPerPage = 4;

  const [movieIndex, setMovieIndex] = useState(0);
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [topMovieIndex, setTopMovieIndex] = useState(0);
  const [topSeriesIndex, setTopSeriesIndex] = useState(0);

  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loadData = async () => {
      try {
        const movieResponse = await fetchMovies();
        const topMovieResponse = await fetchTopMovies();
        const seriesResponse = await fetchSeries();
        const topSeriesResponse = await fetchTopSeries();

        if (movieResponse?.results) dispatch(setMovies(movieResponse.results));
        if (topMovieResponse?.results) dispatch(setTopMovies(topMovieResponse.results));
        if (seriesResponse?.results) dispatch(setSeries(seriesResponse.results));
        if (topSeriesResponse?.results) dispatch(setTopSeries(topSeriesResponse.results));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  const sortData = (data) => {
    const sortedData = [...data];
    if (sortBy === 'title') {
      sortedData.sort((a, b) => {
        const titleA = a.title || a.name;
        const titleB = b.title || b.name;
        return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      });
    } else if (sortBy === 'date') {
      sortedData.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date);
        const dateB = new Date(b.release_date || b.first_air_date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === 'rating') {
      sortedData.sort((a, b) => {
        return sortOrder === 'asc' ? a.vote_average - b.vote_average : b.vote_average - a.vote_average;
      });
    } else if (sortBy === 'popularity') {
      sortedData.sort((a, b) => {
        return sortOrder === 'asc' ? a.popularity - b.popularity : b.popularity - a.popularity;
      });
    }
    return sortedData;
  };

  const sortedMovies = sortData(movies);
  const sortedSeries = sortData(series);
  const sortedTopMovies = sortData(topMovies);
  const sortedTopSeries = sortData(topSeries);

  const handleNextMovies = () => setMovieIndex(movieIndex + 1);
  const handlePrevMovies = () => setMovieIndex(movieIndex - 1);
  const handleNextSeries = () => setSeriesIndex(seriesIndex + 1);
  const handlePrevSeries = () => setSeriesIndex(seriesIndex - 1);
  const handleNextTopMovies = () => setTopMovieIndex(topMovieIndex + 1);
  const handlePrevTopMovies = () => setTopMovieIndex(topMovieIndex - 1);
  const handleNextTopSeries = () => setTopSeriesIndex(topSeriesIndex + 1);
  const handlePrevTopSeries = () => setTopSeriesIndex(topSeriesIndex - 1);

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <Navbar />
      <h1 className="text-center mb-5" style={{ color: 'cyan', fontSize: '2.5rem', fontWeight: '700' }}>Home</h1>

      <div className="d-flex justify-content-center mb-5 gap-5">
        <div>
          <strong style={{ fontSize: '1.1rem' }}>SORT BY</strong>
          <div className="d-flex mt-2 gap-2">
            <button className={`btn btn-outline-light me-2 ${sortBy === 'title' ? 'active' : ''}`} onClick={() => setSortBy('title')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Title</button>
            <button className={`btn btn-outline-light me-2 ${sortBy === 'popularity' ? 'active' : ''}`} onClick={() => setSortBy('popularity')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Popularity</button>
            <button className={`btn btn-outline-light me-2 ${sortBy === 'date' ? 'active' : ''}`} onClick={() => setSortBy('date')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Date</button>
            <button className={`btn btn-outline-light ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Rating</button>
          </div>
        </div>
        <div>
          <strong style={{ fontSize: '1.1rem' }}>SORT ORDER</strong>
          <div className="d-flex mt-2 gap-2">
            <button className={`btn btn-outline-light me-2 ${sortOrder === 'desc' ? 'active' : ''}`} onClick={() => setSortOrder('desc')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Descending</button>
            <button className={`btn btn-outline-light ${sortOrder === 'asc' ? 'active' : ''}`} onClick={() => setSortOrder('asc')} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Ascending</button>
          </div>
        </div>
      </div>

      <h2 className="text-info mb-4" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '20px' }}>Movies</h2>
      <div className="carousel-container" style={{ position: 'relative', display: 'flex', overflow: 'hidden', width: '90%', margin: '0 auto', maxWidth: '1400px' }}>
        {sortedMovies.length > cardsPerPage && (
          <button className="btn arrow arrow-left" onClick={handlePrevMovies} disabled={movieIndex === 0} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'←'}</button>
        )}
        <div className="row flex-nowrap overflow-auto" style={{ padding: '0 40px' }}>
          {sortedMovies.slice(movieIndex * cardsPerPage, (movieIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4" style={{ minWidth: '280px', marginRight: '25px' }}>
              <Link to={`/details/movie/${item.id}`}>
                <div className="card text-white" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111' }}>
                  <img className="img-fluid" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} style={{ borderRadius: '12px 12px 0 0', transition: 'transform 0.3s', width: '100%', height: '400px', objectFit: 'cover' }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {sortedMovies.length > cardsPerPage && (
          <button className="btn arrow arrow-right" onClick={handleNextMovies} disabled={movieIndex * cardsPerPage + cardsPerPage >= sortedMovies.length} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'→'}</button>
        )}
      </div>

      <h2 className="text-info mb-4 mt-5" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '20px' }}>Series</h2>
      <div className="carousel-container" style={{ position: 'relative', display: 'flex', overflow: 'hidden', width: '90%', margin: '0 auto', maxWidth: '1400px' }}>
        {sortedSeries.length > cardsPerPage && (
          <button className="btn arrow arrow-left" onClick={handlePrevSeries} disabled={seriesIndex === 0} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'←'}</button>
        )}
        <div className="row flex-nowrap overflow-auto" style={{ padding: '0 40px' }}>
          {sortedSeries.slice(seriesIndex * cardsPerPage, (seriesIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4" style={{ minWidth: '280px', marginRight: '25px' }}>
              <Link to={`/details/tv/${item.id}`}>
                <div className="card text-white" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111' }}>
                  <img className="img-fluid" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} style={{ borderRadius: '12px 12px 0 0', transition: 'transform 0.3s', width: '100%', height: '400px', objectFit: 'cover' }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {sortedSeries.length > cardsPerPage && (
          <button className="btn arrow arrow-right" onClick={handleNextSeries} disabled={seriesIndex * cardsPerPage + cardsPerPage >= sortedSeries.length} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'→'}</button>
        )}
      </div>

      <h2 className="text-info mb-4 mt-5" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '20px' }}>Top Movies</h2>
      <div className="carousel-container" style={{ position: 'relative', display: 'flex', overflow: 'hidden', width: '90%', margin: '0 auto', maxWidth: '1400px' }}>
        {sortedTopMovies.length > cardsPerPage && (
          <button className="btn arrow arrow-left" onClick={handlePrevTopMovies} disabled={topMovieIndex === 0} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'←'}</button>
        )}
        <div className="row flex-nowrap overflow-auto" style={{ padding: '0 40px' }}>
          {sortedTopMovies.slice(topMovieIndex * cardsPerPage, (topMovieIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4" style={{ minWidth: '280px', marginRight: '25px' }}>
              <div className="card text-white" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111' }}>
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} style={{ borderRadius: '12px 12px 0 0', transition: 'transform 0.3s', width: '100%', height: '400px', objectFit: 'cover' }} />
                <div className="card-body p-3" style={{ backgroundColor: '#111' }}>
                  <h5 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '10px' }}>{item.title}</h5>
                  <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                    Rating: {item.vote_average.toFixed(1)} {' '}
                    <span style={{ color: 'gold' }}>
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = item.vote_average / 2; 
                        return (
                          <FontAwesomeIcon
                            key={index}
                            icon={index + 1 <= Math.floor(ratingValue) ? faStarSolid : faStarRegular}
                            style={{ marginRight: '2px' }}
                          />
                        );
                      })}
                    </span>
                  </p>
                  <Link to={`/details/movie/${item.id}`} className="btn btn-info" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sortedTopMovies.length > cardsPerPage && (
          <button className="btn arrow arrow-right" onClick={handleNextTopMovies} disabled={topMovieIndex * cardsPerPage + cardsPerPage >= sortedTopMovies.length} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'←'}</button>
        )}
      </div>

      <h2 className="text-info mb-4 mt-5" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '20px' }}>Top Series</h2>
      <div className="carousel-container" style={{ position: 'relative', display: 'flex', overflow: 'hidden', width: '90%', margin: '0 auto', maxWidth: '1400px' }}>
        {sortedTopSeries.length > cardsPerPage && (
          <button className="btn arrow arrow-left" onClick={handlePrevTopSeries} disabled={topSeriesIndex === 0} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'→'}</button>
        )}
        <div className="row flex-nowrap overflow-auto" style={{ padding: '0 40px' }}>
          {sortedTopSeries.slice(topSeriesIndex * cardsPerPage, (topSeriesIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4" style={{ minWidth: '280px', marginRight: '25px' }}>
              <div className="card text-white" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#111' }}>
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} style={{ borderRadius: '12px 12px 0 0', transition: 'transform 0.3s', width: '100%', height: '400px', objectFit: 'cover' }} />
                <div className="card-body p-3" style={{ backgroundColor: '#111' }}>
                  <h5 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '10px' }}>{item.name}</h5>
                  <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                    Rating: {item.vote_average.toFixed(1)} {' '}
                    <span style={{ color: 'gold' }}>
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = item.vote_average / 2; 
                        return (
                          <FontAwesomeIcon
                            key={index}
                            icon={index + 1 <= Math.floor(ratingValue) ? faStarSolid : faStarRegular}
                            style={{ marginRight: '2px' }}
                          />
                        );
                      })}
                    </span>
                  </p>
                  <Link to={`/details/tv/${item.id}`} className="btn btn-info" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sortedTopSeries.length > cardsPerPage && (
          <button className="btn arrow arrow-right" onClick={handleNextTopSeries} disabled={topSeriesIndex * cardsPerPage + cardsPerPage >= sortedTopSeries.length} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '-20px', zIndex: 10, backgroundColor: '#00bcd4', color: '#fff', padding: '12px 18px', fontSize: '1.8rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', transition: 'background-color 0.3s, transform 0.3s', cursor: 'pointer' }}>{'→'}</button>
        )}
      </div>
    </div>
  );
};

export default Home;