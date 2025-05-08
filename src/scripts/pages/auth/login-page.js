import LoginPresenter from "../../presenters/login-presenter.js";

export default class LoginPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Login</h1>
        
        <div class="auth-form-container">
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Enter your email" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                required
              >
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            
            <p id="error-message" class="error-message"></p>
            
            <div class="auth-redirect">
              <p>Don't have an account? <a href="#/register">Register</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessage.textContent = '';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const submitButton = loginForm.querySelector('button[type="submit"]');

      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Logging in...';
      submitButton.disabled = true;

      const result = await LoginPresenter.submitLogin(email, password);

      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      if (!result.success) {
        errorMessage.textContent = result.message;
        return;
      }

      if (typeof window.showMenusIfLoggedIn === 'function') {
        window.showMenusIfLoggedIn();
      }

      document.body.classList.add('authenticated');
      window.location.hash = '#/';
    });
  }
}
