import * as PIXI from 'pixi.js';

import Constants from '../constants/constants';
import LocationManager from '../locationManager/locationManager';
import ObjectManager from '../objectManager/objectManager';
import DialogManager from '../dialogManager/dialogManager';
import QuestManager from '../questManager/questManager';
import SaveManager from '../saveManager/saveManager';
import ExternalManager from '../externalManager/externalManager';
import BlackOverlay from '../blackOverlay/blackOverlay';
import MapOverlay from '../mapOverlay/mapOverlay';
import Utils from '../utils/utils';

class StoryXmlPlayer {
  renderer;
  stage;

  constructor(div, canvas, config) {
    this.stage = this.initStage(div, canvas);
    this.createLayers(config);
  }

  initStage(div, canvas) {
    this.renderer = PIXI.autoDetectRenderer(Constants.screenWidth, Constants.screenHeight, {
      backgroundColor: 0x000000,
      view: canvas
    });
    div.append(this.renderer.view);
    Utils.saveRenderer(this.renderer);
    return new PIXI.Container();
  }

  createLayers(config) {
    var locationLayers = LocationManager.init(config.changeLocationHook);
    this.stage.addChild(locationLayers);
    var objectLayers = ObjectManager.init();
    this.stage.addChild(objectLayers);
    var dialogLayers = DialogManager.init(config.playerName, config.playerImageCanvas);
    this.stage.addChild(dialogLayers);
    this.stage.addChild(BlackOverlay.init());
    this.stage.addChild(ExternalManager.init(config.hookHandlers));

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.stage);
    };
    animate();

    SaveManager.init();
  }

  loadingScreen(div, canvas) {
    this.renderer = PIXI.autoDetectRenderer(Constants.screenWidth, Constants.screenHeight, {
      backgroundColor: 0x000000,
      view: canvas
    });
    div.append(this.renderer.view);
    Utils.saveRenderer(this.renderer);
    stage = new PIXI.Container();
    stage.addChild(BlackOverlay.init());

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.stage);
    };
    animate();
  }
}
export default StoryXmlPlayer;

export { getExternalOverlay } from '../externalManager/externalManager.js';
export {
  changeStartLocation,
  gotoStartLocation,
  gotoLocation
} from '../locationManager/locationManager.js';
export { unlockQuest, completeQuest, unlockLastQuest } from '../questManager/questManager.js';
export { sendNotification, changeWristDeviceFunction } from '../mapOverlay/mapOverlay.js';
