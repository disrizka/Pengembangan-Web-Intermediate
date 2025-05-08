import { login } from '../models/api.js';

const LoginPresenter = {
  async submitLogin(email, password) {
    try {
      const response = await login(email, password);

      if (response.error) {
        return { success: false, message: response.message };
      }

      const { token, userId, name } = response.loginResult;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
  }
};

export default LoginPresenter;
