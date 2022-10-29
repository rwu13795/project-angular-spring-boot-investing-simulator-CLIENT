export interface InputField {
  [field: string]: string;
}

export interface InputFieldTouched {
  [field: string]: boolean;
}

export enum InputFieldNames {
  email = "email",
  password = "password",
  confirm_password = "confirm_password",
}
