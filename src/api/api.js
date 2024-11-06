import axios from 'axios';

// Create an Axios instance with your real backend URL
const API = axios.create({
    baseURL: 'http://localhost:8080',  // Update this URL as needed
});

export default API;
