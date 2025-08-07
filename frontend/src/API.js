import axios from 'axios';

// const BACKEND_URL='http://127.0.0.1:8000/';
const BACKEND_URL='https://booking.cloudnettravels/';
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

