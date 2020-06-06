import * as PIXI from 'pixi.js';
import { isStudent } from '../backend/user.js';
import { createLoadingScreen, createBlackOverlay, createText } from '../effects/effects.js';
import { defaultText } from '../constants/styles.js';
import Constants from '../constants/constants';
import QuestManager from '../questManager/questManager.js';

var LocationManager = require('../locationManager/locationManager.js');
var SaveManager = require('../saveManager/saveManager.js');
var BlackOverlay = require('../blackOverlay/blackOverlay.js');
var SoundManager = require('../soundManager/soundManager.js');

export async function loadStoryById(storyId) {
  const stories = await loadStoryXmls(storyId);
  SaveManager.updateGameMap();
  // startLocation && LocationManager.changeStartLocation(startLocation);
  // unlockFirstQuest(storyXML, LocationManager.verifyGotoStart(callback));
}

async function loadStoryXmls(storyId) {
  const story = await loadOneStoryXml(storyId);
  const depStoryId = story.getAttribute('dependencies');
  const depStory = await loadOneStoryXml(depStoryId);
  return [story, depStory];
}

async function loadOneStoryXml(storyId) {
  const url = Constants.storyXMLPathTest + storyId + '.story.xml';
  const response = await fetch(url);
  const message = await response.text();
  const storyXml = new window.DOMParser().parseFromString(message, 'text/xml');
  const [story] = storyXml.children;
  return story;
}

async function preloadStories(stories) {
  var assetsToLoadTable = {};
  PIXI.loader.reset();
  stories.forEach(story => {
    markAssetsToLoad(story, assetsToLoadTable);
    SoundManager.markSoundsToLoad(story);
  });

  preloadAssets(assetsToLoadTable);
  preloadSounds();
}

export function closeStory(storyId) {
  BlackOverlay.blackScreen();
  g_loadedStories[storyId] = null;
  QuestManager.unloadQuests(storyId);
  SaveManager.removeActions({ storyId: storyId }, true);
  LocationManager.verifyCurCamLocation();
  LocationManager.goBackToCurCamLocation();
}
