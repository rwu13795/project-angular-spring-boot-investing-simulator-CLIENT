export interface InputField {
  [field: string]: string;
}

export interface InputFieldTouched {
  [field: string]: boolean;
}

export interface UserAccount {
  id: number;
  email: string;
  fund: number;
  joinedAt: string;
}

export interface AuthError {
  status: number;
  message: string;
  timeStamp: number;
  field: string;
}

export interface Response_authError {
  error: AuthError;
}

export enum InputFieldNames {
  email = "email",
  password = "password",
  confirm_password = "confirm_password",
}

export enum LoadingStatus_user {
  idle = "idle",
  succeeded_auth = "succeeded_auth",
  loading_auth = "loading_auth",
  failed_auth = "failed_auth",
}
