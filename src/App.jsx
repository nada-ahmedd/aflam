import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/Home';
import Movies from './components/Movies';
import Series from './components/Series';
import MovieDetails from './components/MovieDetails';
import SeriesDetails from './components/SeriesDetails';
import PersonDetails from './components/PersonDetails';
import SearchResults from './components/SearchResults';
import CastCrew from './components/CastCrew';
import MoviePosters from './components/MoviePosters'; 
import MovieBackdrops from './components/MovieBackdrops'; 
import SeriesPosters from './components/SeriesPosters';
import SeriesBackdrops from './components/SeriesBackdrops';
import Footer from './components/Footer';

const App = () => {
  return (
    <Provider store={store}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/details/movie/:id" element={<MovieDetails />} />
            <Route path="/details/tv/:id" element={<SeriesDetails />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/search/:type/:query" element={<SearchResults />} />
            <Route path="/cast-crew/:type/:id" element={<CastCrew />} />
            <Route path="/movie/:id/posters" element={<MoviePosters />} />
            <Route path="/movie/:id/backdrops" element={<MovieBackdrops />} />
            <Route path="/series/:id/posters" element={<SeriesPosters />} />
<Route path="/series/:id/backdrops" element={<SeriesBackdrops />} />
          </Routes>
        </main>
        <Footer /> 
      </div>
    </Provider>
  );
};

export default App;