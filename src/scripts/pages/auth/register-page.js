import RegisterPresenter from "../../presenters/register-presenter.js";

export default class RegisterPage {
  async render() {
    return `
      <section class="container auth-container">
        <h1>Register</h1>
        
        <div class="auth-form-container">
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your name" 
                required
              >
            </div>
            
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
                placeholder="Enter your password (min 6 characters)" 
                minlength="6"
                required
              >
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
            
            <p id="error-message" class="error-message"></p>
            <p id="success-message" class="success-message"></p>
            
            <div class="auth-redirect">
              <p>Already have an account? <a href="#/login">Login</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

    
      errorMessage.textContent = '';
      successMessage.textContent = '';

     
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

  
      const submitButton = registerForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Registering...';
      submitButton.disabled = true;

    
      const result = await RegisterPresenter.submitRegister(name, email, password);

  
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      if (!result.success) {
        errorMessage.textContent = result.message;
        return;
      }

      successMessage.textContent = `${result.message} Redirecting to login...`;
      registerForm.reset();

      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);
    });
  }
}
