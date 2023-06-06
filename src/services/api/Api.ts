import axios from 'axios';
import {serverAPIBaseURL} from '../../config';

class Api {
  api = axios.create({
    baseURL: serverAPIBaseURL
  });

  constructor() {
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.api.interceptors.response.use(
      res => res,
      err => {
        if (err.response.status === 401) {
          localStorage.clear();
          window.location.reload();
        }

        return Promise.reject(err);
      }
    );
  }
}

export {
  Api
};