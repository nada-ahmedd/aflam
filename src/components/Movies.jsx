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
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan' }}>Movies</h1>
      <h3 className="text-center mb-4">Page Number {currentPage} From {totalPages}</h3>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <div className="row">
          {displayedMovies.map(item => (
            <div key={item.id} className="col-md-3 mb-4">
              <div className="card text-white" style={{ borderRadius: '10px', backgroundColor: '#333' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  style={{ borderRadius: '10px 10px 0 0' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750'; }}
                />
                <div className="card-body" style={{ backgroundColor: '#333' }}>
                  <p><strong>Title:</strong> {item.title}</p>
                  <p>
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
                  <Link to={`/details/movie/${item.id}`} className="btn btn-info">Details</Link>
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
              style={{ fontSize: '1.5rem', padding: '5px 15px' }}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button
              className="btn btn-outline-light me-3"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ fontSize: '1.5rem', padding: '5px 15px' }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span className="mx-3" style={{ fontSize: '1.2rem' }}>
              {currentPage}
            </span>
            <button
              className="btn btn-outline-light ms-3"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ fontSize: '1.5rem', padding: '5px 15px' }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              className="btn btn-outline-light ms-2"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              style={{ fontSize: '1.5rem', padding: '5px 15px' }}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
        )}
        {movies.length === 0 && <p className="text-center">No movies available</p>}
      </div>
    </div>
  );
};

export default Movies;