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

  sendResetPasswordEmail = async (email: string) => {
    const { data } = await this.api.post('/users/password/reset/send', email);
    return data;
  };

  resetPassword = async (token: string, password: string) => {
    const { data } = await this.api.post(`/users/password/reset/${token}`, password);
    return data;
  };
}

export default new UserApi();