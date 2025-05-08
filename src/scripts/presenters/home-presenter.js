import { getStories } from '../models/api.js';
import { getAddress } from '../models/location_api.js';
import { StoryDB } from '../utils/indexedDB.js'; // ⬅️ pastikan file ini sudah dibuat

const HomePresenter = {
  async getEnrichedStories(token) {
    try {
      const result = await getStories(token);

      if (result.error || !result.listStory) throw new Error();

      // ✅ Simpan hasil online ke IndexedDB
      await StoryDB.putStories(result.listStory);

      // ➕ Tambahkan alamat
      const enriched = await Promise.all(
        result.listStory.map(async (story) => ({
          ...story,
          address: await getAddress(story.lat, story.lon),
        }))
      );

      return { error: null, stories: enriched };
    } catch {
      // 🔁 Fallback offline dari IndexedDB
      const offlineStories = await StoryDB.getAllStories();

      const enriched = await Promise.all(
        offlineStories.map(async (story) => ({
          ...story,
          address: await getAddress(story.lat, story.lon),
        }))
      );

      return { error: null, stories: enriched };
    }
  },
};

export default HomePresenter;
