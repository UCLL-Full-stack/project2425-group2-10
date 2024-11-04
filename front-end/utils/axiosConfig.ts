// front-end/utils/axiosConfig.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your back-end URL
  withCredentials: true, // If your back-end requires credentials
});

export default instance;
