const userFieldLengths = {
  title: { max: 64 },
  fname: { max: 64 },
  lname: { max: 64 },
  email: { max: 128 },
  password: { min: 8 },
  street: { max: 128 },
  city: { max: 64 },
  zip: { max: 16 },
  country: { max: 2 },
  phone: { max: 32 },
  company: { max: 256 },
  website: { max: 512 }
};

const userFieldLabels = {
  email: 'Email',
  verified: 'Verified',
  active: 'Active',
  admin: 'Admin',
  title: 'Title',
  fname: 'First Name',
  lname: 'Last Name',
  phone: 'Phone',
  country: 'Country',
  city: 'City',
  zip: 'ZIP',
  street: 'Street',
  company: 'Company',
  website: 'Website'
};

export {
  userFieldLengths,
  userFieldLabels
};