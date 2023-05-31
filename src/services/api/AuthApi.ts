import {Api} from "./Api";
import {Credentials} from "../../types";

class AuthApi extends Api {
  login = async (credentials: Credentials) => {
    const { data } = await this.axios.post('/auth', credentials);
    return data;
  };
}

export default new AuthApi();