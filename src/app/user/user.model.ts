import mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  address: addressSchema,
  email: String,
  name: String,
  password: { type: String, get: (): undefined => undefined },
  twoFactorAuthenticationCode: String,
  isTwoFactorAuthenticationEnabled: Boolean,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
