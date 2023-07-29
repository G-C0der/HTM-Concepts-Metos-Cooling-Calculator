interface User {
  id: number;
  email: string;
  verified: boolean;
  active: boolean;
  admin: boolean;
  title?: string;
  fname?: string;
  lname?: string;
  phone?: string;
  country?: string;
  city?: string;
  zip?: string;
  street?: string;
  company?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserForm {
  title: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  passwordRetype: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  company: string;
  website: string;
}

type UserFormEdit = Omit<Partial<UserForm>, 'email' | 'password' | 'passwordRetype'>;

export type {
  User,
  UserForm,
  UserFormEdit
};