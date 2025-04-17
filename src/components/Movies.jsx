import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setMovies } from '../slices/moviesSlice';
import { fetchMovies } from '../services/api';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; 

const Movies = () => {
  const dispatch = useDispatch();
  const moviesState = useSelector((state) => state.movies) || {};
  const movies = moviesState.data?.results || moviesState.data || [];
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchMovies();
        dispatch(setMovies(response.results || []));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    loadData();
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const displayedMovies = movies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: '#00bcd4', fontSize: '3rem', marginBottom: '20px', textShadow: '0 0 10px #00bcd4', transition: 'all 0.3s' }}>Movies</h1>
      <h3 className="text-center mb-4" style={{ fontSize: '1.2rem', color: '#bbb' }}>Page {currentPage} of {totalPages}</h3>
      <div style={{ width: '90%', margin: '0 auto' }}>
        <div className="row">
          {displayedMovies.map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#1a1a1a', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.4)', maxWidth: '250px', width: '100%', margin: '0 auto', transition: 'transform 0.3s' }}
                onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  style={{ borderRadius: '10px 10px 0 0', width: '100%', height: '375px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/250x375'; }}
                />
                <div className="card-body" style={{ backgroundColor: '#1a1a1a', padding: '15px' }}>
                  <p style={{ fontSize: '1rem', margin: '0 0 10px', color: '#fff' }}><strong>{item.title}</strong></p>
                  <p style={{ fontSize: '0.9rem', margin: '0 0 10px' }}>
                    <strong>Rating:</strong> {item.vote_average.toFixed(1)} {' '}
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
                  <Link to={`/details/movie/${item.id}`} className="btn btn-info w-100" style={{ padding: '8px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}>
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {movies.length > 0 && (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <button
              className="btn btn-outline-light me-2"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              style={{ fontSize: '1.2rem', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseOver={(e) => { if (currentPage !== 1) e.target.style.backgroundColor = '#17a2b8'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button
              className="btn btn-outline-light me-3"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ fontSize: '1.2rem', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseOver={(e) => { if (currentPage !== 1) e.target.style.backgroundColor = '#17a2b8'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span className="mx-3" style={{ fontSize: '1.2rem', color: '#00bcd4' }}>
              {currentPage}
            </span>
            <button
              className="btn btn-outline-light ms-3"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ fontSize: '1.2rem', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseOver={(e) => { if (currentPage !== totalPages) e.target.style.backgroundColor = '#17a2b8'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              className="btn btn-outline-light ms-2"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              style={{ fontSize: '1.2rem', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseOver={(e) => { if (currentPage !== totalPages) e.target.style.backgroundColor = '#17a2b8'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
        )}
        {movies.length === 0 && <p className="text-center" style={{ fontSize: '1.2rem', color: '#ccc' }}>No movies available</p>}
      </div>
    </div>
  );
};

export default Movies;