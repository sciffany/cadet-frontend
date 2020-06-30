import { AssetKey, AssetPath } from 'src/features/game/commons/CommonsTypes';

export const loadImage = (scene: Phaser.Scene, assetKey: AssetKey, assetPath: AssetPath) =>
  new Promise<AssetKey>(resolve => {
    if (scene.textures.get(assetKey).key !== '__MISSING') {
      resolve(assetKey);
    } else {
      scene.load.image(assetKey, assetPath);
      scene.load.once('filecomplete', resolve);
      scene.load.start();
    }
  });