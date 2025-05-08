import AddStoryPresenter from "../../presenters/add-story-presenter.js";

export default class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h2>Add New Story</h2>
        <form id="add-story-form" class="story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="camera">Camera</label>
            <video id="camera-preview" autoplay playsinline width="300"></video>
            <canvas id="snapshot" style="display:none;"></canvas>
            <button type="button" id="capture-btn" disabled>Capture</button>
            <p id="camera-status" style="font-size: small; color: green;"></p>
            <img id="preview-image" alt="Snapshot preview" style="display:none; max-width: 100%; margin-top: 1rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);" />
          </div>

          <div class="form-group">
            <label>Click on Map to Select Location</label>
            <div id="map" style="height: 300px;"></div>
            <p id="coords-display" style="font-size: small; color: #333;"></p>
          </div>

          <input type="hidden" id="lat">
          <input type="hidden" id="lon">

          <div class="form-group">
            <button type="submit">Submit</button>
          </div>
          <p id="response-message"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const video = document.getElementById("camera-preview");
    const canvas = document.getElementById("snapshot");
    const captureBtn = document.getElementById("capture-btn");
    const statusEl = document.getElementById("camera-status");
    const previewImage = document.getElementById("preview-image");

    this.stream = null;
    this._map = null;
    let imageBlob = null;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = this.stream;
      statusEl.textContent = "Camera started ✅";
    } catch (err) {
      statusEl.textContent = "Camera error ❌";
      console.error("Camera error:", err);
    }

    video.addEventListener("loadeddata", () => {
      captureBtn.disabled = false;
    });

    captureBtn.addEventListener("click", () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        statusEl.textContent = "Camera not ready yet.";
        return;
      }

      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          statusEl.textContent = "❌ Failed to capture image.";
          previewImage.style.display = "none";
          previewImage.src = "";
          return;
        }

        imageBlob = blob;
        statusEl.textContent = "✅ Image captured";

        const url = URL.createObjectURL(blob);
        previewImage.src = url;
        previewImage.style.display = "block";
      }, "image/jpeg", 0.95);
    });

    const mapContainer = document.getElementById("map");
    if (mapContainer && mapContainer._leaflet_id !== undefined) {
      mapContainer._leaflet_id = null;
    }

    this._map = L.map("map").setView([-2.5, 117], 4.5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this._map);

    let marker = null;
    this._map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
      document.getElementById("coords-display").textContent =
        `Selected coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(this._map);
    });


    const form = document.getElementById("add-story-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;
      const token = localStorage.getItem("token");
      const message = document.getElementById("response-message");

      if (!imageBlob) {
        message.textContent = "❌ Please capture an image first.";
        return;
      }
      if (!lat || !lon) {
        message.textContent = "❌ Please select a location.";
        return;
      }

      const result = await AddStoryPresenter.submitStory({ description, lat, lon, imageBlob, token });

      if (!result.success) {
        message.textContent = `❌ ${result.message}`;
        return;
      }

      message.textContent = "✅ Story added successfully!";
      window.location.hash = "#/";
    });
  }

  destroy() {
    if (this._map && typeof this._map.remove === "function") {
      try {
        this._map.off();
        this._map.remove();
      } catch (e) {
        console.warn("Map removal failed:", e);
      }
      this._map = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    const mapContainer = document.getElementById("map");
    if (mapContainer && mapContainer._leaflet_id !== undefined) {
      mapContainer._leaflet_id = null;
    }
  }
}
