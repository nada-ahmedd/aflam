import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeriesImages } from '../services/api';
import { setSeriesImages } from '../slices/seriesSlice';
import Navbar from './Navbar';

const SeriesBackdrops = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const images = useSelector((state) => state.series.images);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagesData = await fetchSeriesImages(id);
        dispatch(setSeriesImages(imagesData));
      } catch (error) {
        console.error('Error fetching series images:', error);
      }
    };
    loadImages();
  }, [id, dispatch]);

  if (!images) return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const languages = [...new Set(images.backdrops.map(backdrop => backdrop.iso_639_1))];
  const filteredBackdrops = selectedLanguage === 'null'
    ? [] 
    : selectedLanguage
      ? images.backdrops.filter(backdrop => backdrop.iso_639_1 === selectedLanguage)
      : images.backdrops;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      <Navbar />
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'left' }}>
        Series Backdrops
      </h1>

      <div style={{ marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button
          style={{
            padding: '8px 16px',
            margin: '0 5px',
            border: '1px solid #ccc',
            backgroundColor: selectedLanguage === '' ? '#00bcd4' : '#222',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedLanguage('')}
        >
          All Languages
        </button>
        {languages.map(lang => (
          <button
            key={lang || 'null'}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              border: '1px solid #ccc',
              backgroundColor: selectedLanguage === (lang || 'null') ? '#00bcd4' : '#222',
              color: '#fff',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedLanguage(lang || 'null')}
          >
            {lang ? lang.toUpperCase() : 'No Language'}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        padding: '0 10px'
      }}>
        {filteredBackdrops?.length > 0 ? (
          filteredBackdrops.map(backdrop => (
            <div
              key={backdrop.file_path}
              style={{
                border: '2px solid #000',
                borderRadius: '5px',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              <img
                src={backdrop.file_path ? `https://image.tmdb.org/t/p/w500${backdrop.file_path}` : 'https://via.placeholder.com/500x281'}
                alt="Backdrop"
                style={{ width: '100%', height: '169px', objectFit: 'cover' }}
              />
              <div style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#00bcd4' }}>INFO</span>
                  <span style={{ fontSize: '0.9rem', color: '#ccc' }}>🔒</span>
                </div>
                <p style={{ margin: '0 0 5px', fontSize: '0.8rem', color: '#ccc' }}>
                  <strong style={{ color: '#fff' }}>Primary?</strong> {backdrop.primary ? '✓' : '✗'}
                </p>
                <p style={{ margin: '0 0 5px', fontSize: '0.8rem', color: '#ccc' }}>
                  <strong style={{ color: '#fff' }}>Size:</strong> {backdrop.width}x{backdrop.height}
                </p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#ccc' }}>
                  <strong style={{ color: '#fff' }}>Language:</strong> {backdrop.iso_639_1 ? backdrop.iso_639_1.toUpperCase() : 'N/A'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '1rem', gridColumn: '1 / -1' }}>
            No backdrops available for this language
          </p>
        )}
      </div>

      <button
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#00bcd4',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
          transition: 'all 0.3s',
        }}
        onClick={() => navigate(-1)}
        onMouseOver={(e) => { e.target.style.backgroundColor = '#17a2b8'; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = '#00bcd4'; }}
      >
        Back
      </button>
    </div>
  );
};

export default SeriesBackdrops;