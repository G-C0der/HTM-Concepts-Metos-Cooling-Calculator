import axios from 'axios';
import {serverAPIBaseURL} from '../config';

class Api {
  axios = axios.create({
    baseURL: serverAPIBaseURL || 'http://localhost:4000/api/v1'
  })
}

export {
  Api
};