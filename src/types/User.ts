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
  street: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  company: string;
  website: string;
  tnc: boolean;
}

export type {
  User,
  UserForm
};