import StoryDetailPresenter from "../../presenters/story-detail-presenter.js";
import { showFormattedDate } from "../../utils";
import { parseActivePathname } from "../../routes/url-parser";

export default class StoryDetailPage {
  async render() {
    return `<section class="container" id="story-detail-content">Loading...</section>`;
  }

  async afterRender() {
    const container = document.getElementById("story-detail-content");
    const { id } = parseActivePathname();
    const token = localStorage.getItem("token");

    const { story, error } = await StoryDetailPresenter.loadStoryDetail(id, token);

    if (error || !story) {
      container.innerHTML = `<p class="error-message">${error || "Story not found"}</p>`;
      return;
    }

    container.innerHTML = `
      <h2>${story.name}</h2>
      <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image" />
      <p>${story.description}</p>
      <small>${showFormattedDate(story.createdAt)}</small>

      ${story.lat && story.lon ? `
        <p><strong>Latitude:</strong> ${story.lat.toFixed(5)}</p>
        <p><strong>Longitude:</strong> ${story.lon.toFixed(5)}</p>
        <p><strong>Address:</strong> ${story.address}</p>
        <div id="map" style="height: 300px; margin-top: 1rem;"></div>
      ` : ''}
    `;

    if (story.lat && story.lon) {
      const map = L.map("map").setView([story.lat, story.lon], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      L.marker([story.lat, story.lon]).addTo(map).bindPopup(story.address).openPopup();
    }
  }
}
