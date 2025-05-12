export enum EUserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum EUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type TUserLogin = {
  userId: number;
  username: string;
  email: string;
  isEmailVerified: boolean;
  emailVerifyToken: string | null;
  emailVerifyTokenAt: string | null;
  password: string | null;
  passwordResetToken: string | null;
  passwordResetTokenAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type TUser = {
  id: number;
  firstName: string;
  lastName: string | null;
  gender: EUserGender | null;
  dateOfBirth: string | null;
  avatarImageFileUrl: string;
  phoneNumber: string | null;
  roles: EUserRole[];
  userLogin: TUserLogin;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
