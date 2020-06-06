import StoryManager from './StoryManager';
import { loadStoryXmlWithDeps } from './storyLoader';
import AssetManager from './AssetManager';

class GameEngine {
  static instance = new GameEngine();

  static getInstance() {
    return this.instance;
  }

  async playStory(storyId: string) {
    const stories = await loadStoryXmlWithDeps(storyId);
    AssetManager.getInstance().loadAssets(stories);
    StoryManager.getInstance().loadQuests(stories);
    StoryManager.getInstance().unlockFirstQuest();
  }
}

export default GameEngine;
