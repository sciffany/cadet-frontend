import Tagnames from '../constants/tagname';
import { flatten } from '../constants/helper';
import { XML } from '../constants/types';
import { unlockQuest } from 'src/components/academy/game/story-xml-player';

class StoryManager {
  static instance = new StoryManager();

  storyList: XML[] = [];
  questList: any[] = [];
  questsByStory = {};
  activeQuest: any;

  static getInstance() {
    return this.instance;
  }

  async loadQuests(stories: XML[]) {
    this.questsByStory = {};
    stories.forEach(story => {
      const [questList, quests] = getQuests(story);
      this.questList = [...this.questList, ...questList];
      this.questsByStory[story.id] = quests;
    });
  }

  unlockFirstQuest() {
    this.activeQuest = this.questsByStory[this.storyList[0].id][this.questList[0]];
    unlockQuest(this.activeQuest);
  }
}

function getQuests(story: XMLDocument) {
  const quests = {};
  const [quest]: any = story.children;
  const questList = flatten(quest) as any;
  questList
    .filter((quest: any) => quest.tagName === Tagnames.QUEST)
    .forEach((quest: any) => (quests[quest.id] = quest));
  return [questList, quests];
}

export default StoryManager;
