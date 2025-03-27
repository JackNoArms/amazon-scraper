import { HomePage } from './pages/HomePage.js';
import './styles/main.css';

/**
 * Application entry point:
 * - Initializes root component
 * - Mounts to DOM
 */
const app = document.getElementById('app');
const homePage = new HomePage();

// Render application
app.appendChild(homePage.render());

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  const errorContainer = document.createElement('div');
  errorContainer.className = 'global-error';
  errorContainer.innerHTML = `
    <h2>Application Error</h2>
    <p>${event.message}</p>
    <button onclick="window.location.reload()">Reload</button>
  `;
  app.innerHTML = '';
  app.appendChild(errorContainer);
});