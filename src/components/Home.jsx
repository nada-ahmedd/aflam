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
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan' }}>Home</h1>

      <div className="d-flex justify-content-center mb-4">
        <div className="me-5">
          <strong>SORT BY</strong>
          <div className="d-flex mt-2">
            <button className={`btn btn-outline-light me-2 ${sortBy === 'title' ? 'active' : ''}`} onClick={() => setSortBy('title')}>Title</button>
            <button className={`btn btn-outline-light me-2 ${sortBy === 'popularity' ? 'active' : ''}`} onClick={() => setSortBy('popularity')}>Popularity</button>
            <button className={`btn btn-outline-light me-2 ${sortBy === 'date' ? 'active' : ''}`} onClick={() => setSortBy('date')}>Date</button>
            <button className={`btn btn-outline-light ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')}>Rating</button>
          </div>
        </div>
        <div>
          <strong>SORT ORDER</strong>
          <div className="d-flex mt-2">
            <button className={`btn btn-outline-light me-2 ${sortOrder === 'desc' ? 'active' : ''}`} onClick={() => setSortOrder('desc')}>Descending</button>
            <button className={`btn btn-outline-light ${sortOrder === 'asc' ? 'active' : ''}`} onClick={() => setSortOrder('asc')}>Ascending</button>
          </div>
        </div>
      </div>

      <h2 className="text-info mt-5">Movies</h2>
      <div className="position-relative" style={{ width: '80%', margin: '0 auto' }}>
        {sortedMovies.length > cardsPerPage && (
          <button className="btn position-absolute top-50 start-0 translate-middle-y" onClick={handlePrevMovies} disabled={movieIndex === 0} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&lt;</button>
        )}
        <div className="row flex-nowrap overflow-hidden">
          {sortedMovies.slice(movieIndex * cardsPerPage, (movieIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <Link to={`/details/movie/${item.id}`}>
                <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#000' }}>
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} style={{ borderRadius: '10px 10px 0 0' }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {sortedMovies.length > cardsPerPage && (
          <button className="btn position-absolute top-50 end-0 translate-middle-y" onClick={handleNextMovies} disabled={movieIndex * cardsPerPage + cardsPerPage >= sortedMovies.length} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&gt;</button>
        )}
      </div>

      <h2 className="text-info mt-5">Series</h2>
      <div className="position-relative" style={{ width: '80%', margin: '0 auto' }}>
        {sortedSeries.length > cardsPerPage && (
          <button className="btn position-absolute top-50 start-0 translate-middle-y" onClick={handlePrevSeries} disabled={seriesIndex === 0} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&lt;</button>
        )}
        <div className="row flex-nowrap overflow-hidden">
          {sortedSeries.slice(seriesIndex * cardsPerPage, (seriesIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <Link to={`/details/tv/${item.id}`}>
                <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#000' }}>
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} style={{ borderRadius: '10px 10px 0 0' }} />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {sortedSeries.length > cardsPerPage && (
          <button className="btn position-absolute top-50 end-0 translate-middle-y" onClick={handleNextSeries} disabled={seriesIndex * cardsPerPage + cardsPerPage >= sortedSeries.length} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&gt;</button>
        )}
      </div>

      <h2 className="text-info mt-5">Top Movies</h2>
      <div className="position-relative" style={{ width: '80%', margin: '0 auto' }}>
        {sortedTopMovies.length > cardsPerPage && (
          <button className="btn position-absolute top-50 start-0 translate-middle-y" onClick={handlePrevTopMovies} disabled={topMovieIndex === 0} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&lt;</button>
        )}
        <div className="row flex-nowrap overflow-hidden">
          {sortedTopMovies.slice(topMovieIndex * cardsPerPage, (topMovieIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#000' }}>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} style={{ borderRadius: '10px 10px 0 0' }} />
                <div className="card-body" style={{ backgroundColor: '#000' }}>
                  <h5>{item.title}</h5>
                  <p>
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
                  <Link to={`/details/movie/${item.id}`} className="btn btn-info">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sortedTopMovies.length > cardsPerPage && (
          <button className="btn position-absolute top-50 end-0 translate-middle-y" onClick={handleNextTopMovies} disabled={topMovieIndex * cardsPerPage + cardsPerPage >= sortedTopMovies.length} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&gt;</button>
        )}
      </div>

      <h2 className="text-info mt-5">Top Series</h2>
      <div className="position-relative" style={{ width: '80%', margin: '0 auto' }}>
        {sortedTopSeries.length > cardsPerPage && (
          <button className="btn position-absolute top-50 start-0 translate-middle-y" onClick={handlePrevTopSeries} disabled={topSeriesIndex === 0} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&lt;</button>
        )}
        <div className="row flex-nowrap overflow-hidden">
          {sortedTopSeries.slice(topSeriesIndex * cardsPerPage, (topSeriesIndex + 1) * cardsPerPage).map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#000' }}>
                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.name} style={{ borderRadius: '10px 10px 0 0' }} />
                <div className="card-body" style={{ backgroundColor: '#000' }}>
                  <h5>{item.name}</h5>
                  <p>
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
                  <Link to={`/details/tv/${item.id}`} className="btn btn-info">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sortedTopSeries.length > cardsPerPage && (
          <button className="btn position-absolute top-50 end-0 translate-middle-y" onClick={handleNextTopSeries} disabled={topSeriesIndex * cardsPerPage + cardsPerPage >= sortedTopSeries.length} style={{ zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}>&gt;</button>
        )}
      </div>
    </div>
  );
};

export default Home;