interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address?: Address;
}

interface Address {
  street: string;
  city: string;
  country: string;
}

export default User;
