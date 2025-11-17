export type AuthFormState = {
  success: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  };
};
