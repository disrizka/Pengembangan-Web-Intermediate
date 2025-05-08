import { getStoryDetail } from "../models/api.js";
import { getAddress } from "../models/location_api.js";

const StoryDetailPresenter = {
  async loadStoryDetail(id, token) {
    try {
      const result = await getStoryDetail(id, token);
      if (result.error) {
        return { error: result.message || 'Story not found' };
      }

      const story = result.story;
      const address = story.lat && story.lon ? await getAddress(story.lat, story.lon) : null;

      return { story: { ...story, address }, error: null };
    } catch (error) {
      return { error: "Failed to load story detail" };
    }
  }
};

export default StoryDetailPresenter;
