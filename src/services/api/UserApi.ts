import {Api} from "./Api";
import {UserForm} from "../../types";

class UserApi extends Api {
  register = async (userFormData: UserForm) => {
    const { data } = await this.axios.post('/users', userFormData);
    return data;
  };
}

export default new UserApi();