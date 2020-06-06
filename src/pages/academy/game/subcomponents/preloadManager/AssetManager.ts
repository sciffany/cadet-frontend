import * as _ from 'lodash';

import { XML } from '../constants/types';
import Tagnames from '../constants/tagname';
import Constants from '../constants/constants';

declare const PIXI: any;

class AssetManager {
  static instance = new AssetManager();

  graphicAssetsTable = {};
  soundAssetsTable = {};

  static getInstance() {
    return this.instance;
  }

  loadAssets(stories: XML[]) {
    this.graphicAssetsTable = preloadAssets(stories);
    this.soundAssetsTable = preloadSounds(stories);
  }
}

function preloadAssets(stories: XML[]) {
  const assetsToLoadTable = loadAssetsTable(stories);
  return Object.keys(assetsToLoadTable).map(asset => PIXI.loader.add(asset, asset));
}

function loadAssetsTable(stories: XML[]) {
  const [storyAssets, depAssets] = stories.map(loadAssetTableForStory);
  return { ...depAssets, ...storyAssets };
}

function loadAssetTableForStory(story: XML) {
  return makeTableFromPaths([
    ...getAssetPaths(story, Tagnames.LOCATION, Constants.locationPath),
    ...getAssetPaths(story, Tagnames.OBJECT, Constants.objectPath),
    ...getAssetPaths(story, Tagnames.TEMP_OBJECT, Constants.objectPath),
    ...getImagePaths(story),
    ...getSpeechPaths(story)
  ]);
}

function makeTableFromPaths(paths: string[]) {
  return paths.reduce((assetTable, resName) => {
    return PIXI.utils.TextureCache[resName] ? assetTable : { ...assetTable, [resName]: true };
  }, {});
}

function getAssetPaths(story: XML, type: string, path: string) {
  const nodes = story.getElementsByTagName(type);
  return Array.from(nodes).map((node: any) => {
    const name = node.getAttribute('name');
    const skin = node.getAttribute('skin') || 'normal';
    return path + name + '/' + skin + '.png';
  });
}

function getImagePaths(story: XML) {
  const nodes = story.getElementsByTagName(Tagnames.IMAGE);
  return Array.from(nodes).map((node: any) => Constants.imgPath + node.textContent);
}

function getSpeechPaths(story: XML) {
  var resNames: string[] = [];
  const nodes = story.getElementsByTagName(Tagnames.SPEECH);
  Array.from(nodes).forEach((node: any) => {
    const speaker = node.getAttribute('speaker');
    const audience = node.getAttribute('audience');
    const resName = Constants.avatarPath + speaker + '/sprites.json';
    if (speaker != 'you') {
      resNames.push(resName);
    }
    if (audience && audience != 'you') {
      const audienceResName = Constants.avatarPath + audience + '/sprites.json';
      resNames.push(audienceResName);
    }
  });
  return resNames;
}

function preloadSounds(stories: XML[]) {
  const soundTable = loadSoundsTable(stories);
  return _.mapValues(
    soundTable,
    (key: string, _: boolean) => new Audio(Constants.soundPath + key + '.mp3')
  );
}
function loadSoundsTable(stories: XML[]) {
  const [storyAssets, depAssets] = stories.map(loadSoundsTableForStory);
  return { ...depAssets, ...storyAssets };
}

function loadSoundsTableForStory(story: XML) {
  const soundsToLoad = {};
  const nodes = story.getElementsByTagName(Tagnames.SOUND);
  Array.from(nodes)
    .map((node: any) => node.getAttribute('name'))
    .forEach((nodeName: string) => (soundsToLoad[nodeName] = true));
  return soundsToLoad;
}

export default AssetManager;
