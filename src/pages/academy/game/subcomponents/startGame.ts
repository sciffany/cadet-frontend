import { IAssessmentOverview } from 'src/components/assessment/assessmentShape';
import { GameState, Story } from '../../../../reducers/states';
import Constants from './constants/constants';
import hookHandlers from './utils/hookHandlers';
import GameEngine from './preloadManager/GameEngine';
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
  const storyId = 'mission-1';
  new StoryXmlPlayer(div, canvas, { ...config, playerName: username });
  GameEngine.getInstance().playStory(storyId);
  setLoading(false);
}

export default startGame;
