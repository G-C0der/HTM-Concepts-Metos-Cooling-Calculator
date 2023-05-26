import axios from 'axios';

class Api {
  axios = axios.create({
    baseURL: process.env.SERVER_API_URL || 'http://localhost:4000/api/v1'
  })
}

export {
  Api
};