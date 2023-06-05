import {Api} from "./Api";
import {Credentials} from "../../types";

class AuthApi extends Api {
  login = async (credentials: Credentials) => {
    const { data } = await this.api.post('/auth', credentials);
    return data;
  };

  getAuthenticatedUser =  async () => {
    const { data } = await this.api.get('/auth');
    return data;
  };
}

export default new AuthApi();