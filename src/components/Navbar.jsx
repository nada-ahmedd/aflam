import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSearchResults } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search/${searchType}/${searchQuery}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await fetchSearchResults(searchType, searchQuery);
          setSuggestions(response.results || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [searchQuery, searchType]);

  const handleSuggestionClick = (id, title) => {
    setSearchQuery(title);
    navigate(`/details/${searchType}/${id}`);
    setShowSuggestions(false);
  };

  const placeholderText = searchType === 'movie' ? 'Search With Movies' : 'Search With Series';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Aflam</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/movies">Movies</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/series">Series</a>
            </li>
          </ul>
          <div className="d-flex position-relative">
            <select
              className="form-select me-2"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ width: '120px' }}
            >
              <option value="movie">Movies</option>
              <option value="tv">Series</option>
            </select>
            <input
              className="form-control me-2"
              type="search"
              placeholder={placeholderText} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button className="btn btn-info" onClick={handleSearch}>Search</button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute top-100 start-0 w-75 bg-dark text-white border rounded" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center p-2 border-bottom"
                    onClick={() => handleSuggestionClick(item.id, item.title || item.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w45${item.poster_path || item.profile_path}`}
                      alt={item.title || item.name}
                      style={{ width: '45px', height: '67px', objectFit: 'cover', marginRight: '10px' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/45x67'; }}
                    />
                    <span>{item.title || item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;