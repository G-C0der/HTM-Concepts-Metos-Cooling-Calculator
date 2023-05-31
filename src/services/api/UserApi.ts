import {Api} from "./Api";

interface UserForm {
  title: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  company: string;
  website: string;
  tnc: boolean;
}

class UserApi extends Api {
  register = async (userFormData: UserForm) => {
    const { data } = await this.axios.post('/user', userFormData);
    return data;
  };
}

export default new UserApi();