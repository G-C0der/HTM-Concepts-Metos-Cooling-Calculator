import {Api} from "./Api";

interface Credentials {
  email: string;
  password: string;
}

class AuthApi extends Api {
  login = async (credentials: Credentials) => {
    const { data } = await this.axios.post('/auth', credentials);
    return data;
  }
}

export default new AuthApi();