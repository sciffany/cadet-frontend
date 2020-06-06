import { IAssessmentOverview } from 'src/components/assessment/assessmentShape';
import { GameState, Story } from '../../../../reducers/states';
import { fetchGameData } from './backend/gameState';
import Constants from './constants/constants';
import hookHandlers from './utils/hookHandlers';
import { loadStoryById } from './preloadManager/storyLoader';
import StoryXmlPlayer from './preloadManager/storyXmlPlayer.js';
import { createLoadingScreen } from './effects/effects';

const config = {
  hookHandlers,
  playerImageCanvas: document.createElement('CANVAS'),
  changeLocationHook: (newLocation: string) =>
    localStorage.setItem(Constants.LOCATION_KEY, newLocation)
};

async function startGame(
  div: HTMLDivElement,
  canvas: HTMLCanvasElement,
  username: string | undefined,
  userStory: Story | undefined,
  gameState: GameState,
  missions: IAssessmentOverview[] | undefined
) {
  const setLoading = createLoadingScreen();
  const storyId: string = await fetchGameData(userStory, gameState, missions);
  new StoryXmlPlayer(div, canvas, { ...config, playerName: username });
  loadStoryById(storyId);
  setLoading(false);
}

export default startGame;
