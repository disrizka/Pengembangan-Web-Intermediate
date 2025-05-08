import { showFormattedDate } from "../../utils";
import HomePresenter from "../../presenters/home-presenter.js";
import NotificationButton from "./index.js"; // tombol notifikasi
import { StoryDB } from "../../utils/indexedDB.js"; // hapus IndexedDB

export default class HomePage {
  async render() {
    const isAuthenticated = !!localStorage.getItem('token');

    return `
      <section class="container">
        ${!isAuthenticated ? `
          <div class="welcome-section">
            <div class="welcome-content">
              <h2>Share Your Stories</h2>
              <p>Join our community to share your experiences and discover amazing stories from around the world.</p>
              <div class="welcome-buttons">
                <a href="#/login" class="btn btn-primary">Login</a>
                <a href="#/register" class="btn btn-secondary">Register</a>
              </div>
            </div>
          </div>
        ` : `
          <div class="story-container">
            ${NotificationButton.render()}
            <button id="clear-indexeddb" class="btn btn-danger">Hapus Story Lokal</button>

            <h2>Stories</h2>
            <div id="story-list" class="story-list">
              <p id="loading">Loading stories...</p>
            </div>

            <div class="map-container">
              <h2>Story Locations</h2>
              <div id="map" class="map"></div>
            </div>
          </div>
        `}
      </section>
    `;
  }

  async afterRender() {
    const isAuthenticated = !!localStorage.getItem('token');

    if (isAuthenticated) {
      await this._loadStories();
      NotificationButton.afterRender(); // aktifkan notifikasi
      this._setupClearButton(); // hapus IndexedDB
      await this._initMap();
    }
  }

  async _loadStories() {
    const token = localStorage.getItem('token');
    const storyListElement = document.getElementById('story-list');

    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    storyListElement.innerHTML = '<p>Loading stories...</p>';
    const { error, stories } = await HomePresenter.getEnrichedStories(token);

    if (error) {
      storyListElement.innerHTML = `<p class="error-message">${error}</p>`;
      return;
    }

    if (stories.length === 0) {
      storyListElement.innerHTML = '<p>No stories found</p>';
      return;
    }

    storyListElement.innerHTML = '';
    for (const story of stories) {
      storyListElement.innerHTML += this._createStoryItemTemplate(story, story.address);
    }

    const storyItems = storyListElement.querySelectorAll('.story-item');
    storyItems.forEach(item => {
      item.addEventListener('click', () => {
        const storyId = item.dataset.id;
        window.location.hash = `#/story/${storyId}`;
      });
    });
  }

  async _initMap() {
    const mapElement = document.getElementById("map");
    mapElement.innerHTML = ''; // cegah init ganda

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    const { error, stories } = await HomePresenter.getEnrichedStories(token);
    if (error || stories.length === 0) {
      mapElement.innerHTML = '<p class="map-message">No story locations available</p>';
      return;
    }

    this._map = L.map("map").setView([-2.5, 117], 4.5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this._map);

    stories.filter(s => s.lat && s.lon).forEach(story => {
      const marker = L.marker([story.lat, story.lon]).addTo(this._map);
      marker.bindPopup(`
        <strong>${story.name}</strong>
        <p>${story.description}</p>
        <p><small><strong>Lat:</strong> ${story.lat.toFixed(5)}, <strong>Lon:</strong> ${story.lon.toFixed(5)}</small></p>
        <small>${new Date(story.createdAt).toLocaleString()}</small><br>
        <a href="#/story/${story.id}" class="map-story-link">View Story</a>
      `);
    });
  }

  _setupClearButton() {
    document.getElementById('clear-indexeddb')?.addEventListener('click', async () => {
      await StoryDB.deleteAllStories();
      alert('Semua story lokal berhasil dihapus!');
      window.location.reload();
    });
  }

  _createStoryItemTemplate(story, address) {
    return `
      <article class="story-item" data-id="${story.id}">
        <img 
          src="${story.photoUrl}" 
          alt="Story by ${story.name}" 
          class="story-image"
          onerror="this.onerror=null;this.src='https://placeholder.pics/svg/300x200/DEDEDE/555555/Image%20Not%20Available';"
        >
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <small class="story-date">${showFormattedDate(story.createdAt)}</small>
          ${story.lat && story.lon ? 
            `<p class="story-location">
              <span class="location-icon">📍</span> 
              <span>${address}</span>
            </p>` : ''
          }
        </div>
      </article>
    `;
  }

  destroy() {
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }
}
