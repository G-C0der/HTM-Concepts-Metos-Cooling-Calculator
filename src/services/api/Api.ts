import axios from 'axios';
import {serverAPIBaseURL} from '../../config';

class Api {
  axios = axios.create({
    baseURL: serverAPIBaseURL
  });

  constructor() {
    this.axios.interceptors.response.use(
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