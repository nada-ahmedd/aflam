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
    <form onSubmit={handleSearch} className="d-flex position-relative">
      <select
        className="form-select me-2"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        style={{ width: '100px' }}
      >
        <option value="movie">Movies</option>
        <option value="tv">Series</option>
      </select>
      <input
        className="form-control me-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Movies or Series..."
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      <button className="btn btn-info" type="submit"><FontAwesomeIcon icon={faSearch} /></button>
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
    </form>
  );
};

export default SearchBar;