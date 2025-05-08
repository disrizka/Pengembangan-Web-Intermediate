import { signUp } from '../models/api.js';

const RegisterPresenter = {
  async submitRegister(name, email, password) {
    try {
      const response = await signUp(name, email, password);

      if (response.error) {
        return { success: false, message: response.message };
      }

      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      return { success: false, message: 'An error occurred during registration. Please try again.' };
    }
  }
};

export default RegisterPresenter;
