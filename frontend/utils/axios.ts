import axios from 'axios';
import { getSession } from 'next-auth/react';

export const api = axios.create({
  baseURL: 'http://localhost:8000', 
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.customToken) {
    config.headers['Authorization'] = `${session.customToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


