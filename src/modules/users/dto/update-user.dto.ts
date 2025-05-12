import { EUserGender, EUserRole } from '../user.model';

export type TUpdateUserDto = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date | string;
  phoneNumber?: string;
  role?: EUserRole;
  gender?: EUserGender;
};
