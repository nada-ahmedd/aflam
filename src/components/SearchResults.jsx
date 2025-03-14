import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResults } from '../services/api';
import { setSearchResults } from '../slices/searchSlice'; 
import Navbar from './Navbar';

const SearchResults = () => {
  const { type, query } = useParams();
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.search.results) || [];

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetchSearchResults(type, query);
        dispatch(setSearchResults(response.results || []));
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    loadResults();
  }, [type, query, dispatch]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: 'cyan' }}>Search Results for "{query}" ({type === 'movie' ? 'Movies' : 'Series'})</h1>
      <div className="row">
        {searchResults.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card text-white bg-secondary" style={{ borderRadius: '10px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                style={{ borderRadius: '10px 10px 0 0' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750'; }}
              />
              <div className="card-body" style={{ backgroundColor: '#333' }}>
                <h5>{item.title || item.name}</h5>
                <button
                  className="btn btn-info"
                  onClick={() => window.location.href = `/details/${type}/${item.id}`}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;