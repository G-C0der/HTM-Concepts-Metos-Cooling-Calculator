import dotenv from 'dotenv';

dotenv.config();

const serverAPIBaseURL = process.env.SERVER_API_BASE_URL;

export {
  serverAPIBaseURL
};