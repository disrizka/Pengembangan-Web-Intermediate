import { addStory } from '../models/api.js';

const AddStoryPresenter = {
  async submitStory({ description, lat, lon, imageBlob, token }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", imageBlob, "snapshot.jpg");
    formData.append("lat", lat);
    formData.append("lon", lon);

    try {
      const response = await addStory(formData, token);
      if (response.error) {
        return { success: false, message: response.message };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: "Failed to submit story." };
    }
  }
};

export default AddStoryPresenter;
