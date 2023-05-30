import {Api} from "./Api";

class AuthApi extends Api {
  login = async (credentials: { email: string, password: string }) => {
    const { data } = await this.axios.post('/auth', credentials);
    return data;
  }
}

export default new AuthApi();