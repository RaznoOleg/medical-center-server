import { Request } from 'express';

export type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isVerified: boolean;
  role: string;
  address: string;
  birthDate: string;
  city: string;
  country: string;
  specialization: number;
  photoUrl: string;
  gender: string;
};

export type GoogleUserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  photoUrl: string;
};

export interface IUserRequest extends Request {
  user: {
    email: string;
    id: number;
  };
}
