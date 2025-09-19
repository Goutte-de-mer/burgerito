export default interface AuthFormState {
  success: boolean;
  errors: {
    name?: string;
    eamil?: string;
    password?: string;
  };
}
