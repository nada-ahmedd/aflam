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

  const placeholderText = searchType === 'movie' ? 'Search Movies...' : 'Search Series...';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', transition: 'all 0.3s' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00bcd4', textShadow: '0 0 8px #00bcd4' }}>Aflam</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ border: 'none', background: 'transparent' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/" style={{ fontSize: '1.1rem', transition: 'color 0.3s' }}
                onMouseOver={(e) => (e.target.style.color = '#00bcd4')}
                onMouseOut={(e) => (e.target.style.color = '#fff')}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/movies" style={{ fontSize: '1.1rem', transition: 'color 0.3s' }}
                onMouseOver={(e) => (e.target.style.color = '#00bcd4')}
                onMouseOut={(e) => (e.target.style.color = '#fff')}>
                Movies
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/series" style={{ fontSize: '1.1rem', transition: 'color 0.3s' }}
                onMouseOver={(e) => (e.target.style.color = '#00bcd4')}
                onMouseOut={(e) => (e.target.style.color = '#fff')}>
                Series
              </a>
            </li>
          </ul>
          <div className="d-flex position-relative">
            <select
              className="form-select me-2"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ width: '130px', fontSize: '0.9rem', borderRadius: '8px', backgroundColor: '#222', color: '#fff', transition: 'all 0.3s' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#222')}
            >
              <option value="movie" style={{ backgroundColor: '#222', color: '#fff' }}>Movies</option>
              <option value="tv" style={{ backgroundColor: '#222', color: '#fff' }}>Series</option>
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
              style={{ maxWidth: '300px', borderRadius: '8px', backgroundColor: '#fff', color: '#000', transition: 'all 0.3s' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#fff')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#ddd')}
            />
            <button className="btn btn-info" onClick={handleSearch}
              style={{ padding: '8px 20px', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}>
              Search
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute top-100 start-0 w-75 bg-dark text-white border rounded" style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center p-3 border-bottom"
                    onClick={() => handleSuggestionClick(item.id, item.title || item.name)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w45${item.poster_path || item.profile_path}`}
                      alt={item.title || item.name}
                      style={{ width: '50px', height: '75px', objectFit: 'cover', marginRight: '15px', borderRadius: '5px' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50x75'; }}
                    />
                    <span style={{ fontSize: '1rem', color: '#bbb' }}>{item.title || item.name}</span>
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