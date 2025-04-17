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
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <Navbar />
      <h1 className="text-center" style={{ color: '#00bcd4', fontSize: '3rem', marginBottom: '30px', textShadow: '0 0 10px #00bcd4', transition: 'all 0.3s' }}>
        Search Results for "{query}" ({type === 'movie' ? 'Movies' : 'Series'})
      </h1>
      <div className="container">
        <div className="row">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div key={item.id} className="col-md-3 col-sm-6 mb-4">
                <div className="card text-white" style={{ borderRadius: '15px', backgroundColor: '#1a1a1a', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', maxWidth: '250px', width: '100%', margin: '0 auto', transition: 'transform 0.3s' }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    style={{ borderRadius: '15px 15px 0 0', width: '100%', height: '375px', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/250x375'; }}
                  />
                  <div className="card-body" style={{ backgroundColor: '#1a1a1a', padding: '15px' }}>
                    <h5 style={{ fontSize: '1.1rem', margin: '0 0 10px', color: '#fff' }}>{item.title || item.name}</h5>
                    <button
                      className="btn btn-info w-100"
                      onClick={() => window.location.href = `/details/${type}/${item.id}`}
                      style={{ padding: '8px', fontSize: '0.9rem', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; e.target.style.transform = 'scale(1.05)'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'scale(1)'; }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center" style={{ fontSize: '1.2rem', color: '#ccc' }}>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;