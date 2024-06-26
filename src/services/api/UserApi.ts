import {Api} from "./Api";
import {UserForm, UserFormEdit} from "../../types";
import {UserMode} from "../../enums/UserMode";

class UserApi extends Api {
  basePath = '/users';

  register = async (form: UserForm) => {
    const { data } = await this.api.post(this.basePath, form);
    return data;
  };

  sendVerificationEmail = async (email: string) => {
    const { data } = await this.api.post(`${this.basePath}/verification`, { email });
    return data;
  };

  verify = async (token: string) => {
    const { data } = await this.api.patch(`${this.basePath}/verification/${token}`);
    return data;
  };

  sendResetPasswordEmail = async (email: string) => {
    const { data } = await this.api.post(`${this.basePath}/password-reset`, { email });
    return data;
  };

  verifyResetPasswordToken = async (token: string) => {
    const { data } = await this.api.get(`${this.basePath}/password-reset/${token}`);
    return data;
  };

  resetPassword = async (password: string, token?: string) => {
    const path = token ? `${this.basePath}/password-reset/${token}` : `${this.basePath}/password-reset`;
    const { data } = await this.api.patch(path, { password });
    return data;
  };

  fetchForm = async () => {
    const { data } = await this.api.get(`${this.basePath}/form`);
    return data;
  };

  editProfile = async (form: UserFormEdit, id?: string) => {
    const path = id ? `${this.basePath}/${id}` : this.basePath;
    const { data } = await this.api.patch(path, form);
    return data;
  };

  list = async () => {
    const { data } = await this.api.get(this.basePath);
    return data;
  };

  changeMode = async (id: number, mode: UserMode) => {
    const { data } = await this.api.patch(`${this.basePath}/${id}/mode-change`, { mode });
    return data;
  };

  changeActiveState = async (id: number, active: boolean) => {
    const { data } = await this.api.patch(`${this.basePath}/${id}/state-change`, { active });
    return data;
  };
}

export default new UserApi();
