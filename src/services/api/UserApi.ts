import {Api} from "./Api";
import {UserForm} from "../../types";

class UserApi extends Api {
  register = async (userFormData: UserForm) => {
    const { data } = await this.api.post('/users', userFormData);
    return data;
  };

  sendVerificationEmail = async (email: string) => {
    const { data } = await this.api.post('/users/verification/send', { email });
    return data;
  };

  verify = async (token: string) => {
    const { data } = await this.api.post(`/users/verification/${token}`);
    return data;
  };
}

export default new UserApi();