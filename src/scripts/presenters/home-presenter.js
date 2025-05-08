import { getStories } from '../models/api.js';
import { getAddress } from '../models/location_api.js';

const HomePresenter = {
  async getEnrichedStories(token) {
    const result = await getStories(token);
    if (result.error || !result.listStory) {
      return { error: result.message || 'Failed to fetch stories', stories: [] };
    }

    const enriched = [];

    for (const story of result.listStory) {
      const address = await getAddress(story.lat, story.lon);
      enriched.push({ ...story, address });
    }

    return { error: null, stories: enriched };
  }
};

export default HomePresenter;
