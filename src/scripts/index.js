import '../styles/styles.css';
import App from './pages/app';

let activePage = null;

const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  document.body.classList.toggle('authenticated', isAuthenticated);
  return isAuthenticated;
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const isAuthenticated = checkAuthentication();
  const currentHash = window.location.hash;

  if (!isAuthenticated && currentHash !== '#/register') {
    window.location.hash = '#/login';
  } else if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
    window.location.hash = '#/';
  }

  if (activePage && typeof activePage.destroy === 'function') {
    activePage.destroy(); // 🔥 destroy halaman sebelumnya
  }
  activePage = await app.renderPage(); // 🚀 simpan halaman baru

  window.addEventListener('hashchange', async () => {
    const isAuthenticated = checkAuthentication();
    const currentHash = window.location.hash;

    if (!isAuthenticated && currentHash !== '#/register') {
      window.location.hash = '#/login';
    }

    if (isAuthenticated && (currentHash === '#/login' || currentHash === '#/register')) {
      window.location.hash = '#/';
    }

    if (activePage && typeof activePage.destroy === 'function') {
      activePage.destroy(); // 🔥 destroy sebelum render ulang
    }
    activePage = await app.renderPage(); // 🚀 render ulang & simpan halaman aktif
  });
});

// 🔒 Logout
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-button') {
    localStorage.clear();
    window.location.hash = '#/login';
    location.reload(); 
  }
});

// 🔗 Skip to content
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const logoutMenu = document.getElementById("logout-menu");
  const addStoryMenu = document.getElementById("add-story-menu");

  if (token) {
    logoutMenu.style.display = "inline-block";
    addStoryMenu.style.display = "inline-block";
  }

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');

  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
});
