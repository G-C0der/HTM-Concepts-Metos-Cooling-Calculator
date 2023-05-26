import {Api} from "./Api";

class AuthApi extends Api {
  login = async (credentials: { username: string, password: string }) => {
    const { data } = await this.axios.post('/login', credentials);
    return data;
  }
}

export default new AuthApi();