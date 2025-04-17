import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { fetchSearchResults } from '../services/api'; 

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search/${searchType}/${query}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 1) {
        try {
          const response = await fetchSearchResults(searchType, query);
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
  }, [query, searchType]);

  const handleSuggestionClick = (id, title) => {
    setQuery(title);
    navigate(`/details/${searchType}/${id}`);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSearch} className="d-flex position-relative" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <select
        className="form-select me-2"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        style={{ width: '120px', fontSize: '0.9rem', borderRadius: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', transition: 'all 0.3s' }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#222')}
      >
        <option value="movie" style={{ backgroundColor: '#222', color: '#fff' }}>Movies</option>
        <option value="tv" style={{ backgroundColor: '#222', color: '#fff' }}>Series</option>
      </select>
      <input
        className="form-control me-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Movies or Series..."
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        style={{ flex: '1', borderRadius: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', padding: '8px 12px', transition: 'all 0.3s' }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#333')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#222')}
      />
      <button className="btn btn-info" type="submit"
        style={{ padding: '10px 15px', borderRadius: '8px', boxShadow: '0 3px 6px rgba(0, 123, 255, 0.4)', transition: 'all 0.3s' }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#17a2b8')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {showSuggestions && suggestions.length > 0 && (
        <div className="position-absolute top-100 start-0 w-100 bg-dark text-white border rounded" style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', borderRadius: '8px', padding: '5px' }}>
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
    </form>
  );
};

export default SearchBar;