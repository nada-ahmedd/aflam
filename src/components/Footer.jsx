import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#000', textAlign: 'center', padding: '10px 20px', color: '#ccc', borderTop: '1px solid #333' }}>
      <p style={{ margin: '0' }}>
        <span style={{ color: '#007bff' }}>Reach Movies</span> © 2025 All Rights Reserved | 
        <a href="#" style={{ color: '#dc3545', margin: '0 10px', textDecoration: 'none' }} onMouseOver={(e) => (e.target.style.color = '#c82333')} onMouseOut={(e) => (e.target.style.color = '#dc3545')}>
          About
        </a> | 
        <a href="#" style={{ color: '#dc3545', margin: '0 10px', textDecoration: 'none' }} onMouseOver={(e) => (e.target.style.color = '#c82333')} onMouseOut={(e) => (e.target.style.color = '#dc3545')}>
          Terms of Use
        </a> | 
        <a href="#" style={{ color: '#dc3545', margin: '0 10px', textDecoration: 'none' }} onMouseOver={(e) => (e.target.style.color = '#c82333')} onMouseOut={(e) => (e.target.style.color = '#dc3545')}>
          Privacy
        </a>
      </p>
    </footer>
  );
};

export default Footer;