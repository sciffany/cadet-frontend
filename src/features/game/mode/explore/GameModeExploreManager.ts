import { GameMode } from '../GameModeTypes';
import { GameChapter } from '../../chapter/GameChapterTypes';
import GameModeExplore from './GameModeExplore';
import { mapValues } from '../../utils/GameUtils';
import { GameItemTypeDetails } from '../../location/GameMapConstants';

class GameModeExploreManager {
  static processExploreMenus(chapter: GameChapter): Map<string, GameModeExplore> {
    return mapValues(chapter.map.getLocations(), location => {
      const objects = chapter.map.getItemAt(location.name, GameItemTypeDetails.Object);
      if (!location.modes || !location.modes.includes(GameMode.Explore)) {
        return;
      }
      return new GameModeExplore(objects, undefined);
    });
  }
}

export default GameModeExploreManager;