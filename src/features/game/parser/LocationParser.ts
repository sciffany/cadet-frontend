import Parser from './Parser';
import { splitToLines, stripEnclosingChars, splitByChar } from './ParserHelper';
import { Constants } from '../commons/CommonConstants';
import { capitalise } from '../utils/StringUtils';
import { GameMode } from '../mode/GameModeTypes';

function locationAssetKey(shortPath: string) {
  return shortPath;
}

function locationAssetValue(shortPath: string) {
  const [location, skin] = shortPath.split('/');
  return Constants.assetsFolder + '/locations/' + location + '/' + (skin || 'normal') + '.png';
}

export default function LocationParser(fileName: string, fileContent: string): void {
  const gameMap = Parser.chapter.map;
  const [locationAssets, locationModes, navigation] = fileContent.split('\n$\n');

  const locationIds: string[] = [];

  // Parse and load location assets
  splitToLines(locationAssets).forEach(locationAsset => {
    const [locationId, shortPath, fullLocationName] = splitByChar(locationAsset, ',');
    const locationName = stripEnclosingChars(fullLocationName);

    locationIds.push(locationId);
    gameMap.addLocation(locationId, {
      id: locationId,
      name: locationName,
      assetKey: locationAssetKey(shortPath)
    });
    gameMap.addMapAsset(locationAssetKey(shortPath), locationAssetValue(shortPath));
  });

  // Parse modes per location
  splitToLines(locationModes).forEach((modes, modeIndex) => {
    const formattedModeNames = stripEnclosingChars(modes)
      .split(' ')
      .map(mode => textToGameModeMap[capitalise(mode)]);
    gameMap.setModesAt(locationIds[modeIndex], formattedModeNames);
  });

  // Parse which locations can be visited from one location
  splitToLines(navigation).forEach(location => {
    const [locationId, connectedTo] = location.split(': ');
    gameMap.setNavigationFrom(locationId, connectedTo.split(', '));
  });
}

export const textToGameModeMap = {
  Talk: GameMode.Talk,
  Explore: GameMode.Explore,
  Move: GameMode.Move,
  Menu: GameMode.Menu
};
