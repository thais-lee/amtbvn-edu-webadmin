import { EUserGender } from '../user.model';

export type TCreateUserDto = {
  firstName: string;
  lastName?: string;
  dateOfBirth?: Date | string;
  gender?: EUserGender;
  phoneNumber?: string;
};
