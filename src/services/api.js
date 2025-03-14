import axios from 'axios';

const API_KEY = '1919d7799ffade8860cdb9985830150d';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async () => {
  try {
    const firstPageResponse = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`);
    const totalPages = Math.min(firstPageResponse.data.total_pages, 100); 
    const allMovies = [...firstPageResponse.data.results]; 

    const requests = [];
    for (let page = 2; page <= totalPages; page++) {
      requests.push(axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`));
    }

    const responses = await Promise.all(requests);
    responses.forEach(response => {
      allMovies.push(...response.data.results); 
    });

    return { results: allMovies }; 
  } catch (error) {
    console.error('Error fetching all movies:', error);
    return { results: [] };
  }
};

export const fetchTopMovies = async () => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieCredits = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieVideos = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieReviews = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieRecommendations = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieImages = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieKeywords = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/keywords?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieExternalIds = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/external_ids?api_key=${API_KEY}`);
  return response.data;
};

export const fetchMovieReleaseDates = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSimilarMovies = async (id) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeries = async () => {
  try {
    const firstPageResponse = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`);
    const totalPages = Math.min(firstPageResponse.data.total_pages, 100); 
    const allSeries = [...firstPageResponse.data.results]; 

    const requests = [];
    for (let page = 2; page <= totalPages; page++) {
      requests.push(axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`));
    }

    const responses = await Promise.all(requests);
    responses.forEach(response => {
      allSeries.push(...response.data.results); 
    });

    return { results: allSeries }; 
  } catch (error) {
    console.error('Error fetching all series:', error);
    return { results: [] };
  }
};

export const fetchTopSeries = async () => {
  const response = await axios.get(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesCredits = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesVideos = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesReviews = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/reviews?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesRecommendations = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/recommendations?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesImages = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/images?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesKeywords = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/keywords?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesExternalIds = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/external_ids?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeriesContentRatings = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSimilarSeries = async (id) => {
  const response = await axios.get(`${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSeasonDetails = async (tvId, seasonNumber) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
  return response.data;
};

export const fetchEpisodeDetails = async (tvId, seasonNumber, episodeNumber) => {
  const response = await axios.get(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonCombinedCredits = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonImages = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}/images?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonExternalIds = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}/external_ids?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonMovieCredits = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}`);
  return response.data;
};

export const fetchPersonTVCredits = async (id) => {
  const response = await axios.get(`${BASE_URL}/person/${id}/tv_credits?api_key=${API_KEY}`);
  return response.data;
};

export const fetchSearchResults = async (type, query) => {
  const response = await axios.get(`${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  return response.data;
};

export const fetchMovieGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return response.data;
};

export const fetchTVGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
  return response.data;
};

export const fetchConfiguration = async () => {
  const response = await axios.get(`${BASE_URL}/configuration?api_key=${API_KEY}`);
  return response.data;
};