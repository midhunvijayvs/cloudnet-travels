import axios from 'axios';

// const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL='http://3.110.177.125/omairiq-proxy/';
const AIR_IQ_API_KEY=process.env.REACT_APP_AIR_IQ_API_KEY
const instance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
     },

});

// Request interceptor to conditionally add Authorization header
instance.interceptors.request.use(
  config => {
    const isLoginAPI = config.url === '/api/login/';

    if (!isLoginAPI) {
      // Include the authentication token from the cookie
      //const authToken = Cookies.get('authToken');use this for more secure login. the token will be removed after page refresh
      const authToken = localStorage.getItem('accessToken')
      if (authToken) {
        config.headers['Authorization'] = `${authToken}`;
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;

