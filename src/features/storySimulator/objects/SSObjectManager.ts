import ObjectPlacement from '../scenes/ObjectPlacement/ObjectPlacement';
import { Constants, screenCenter } from 'src/features/game/commons/CommonConstants';
import { Layer } from 'src/features/game/layer/GameLayerTypes';
import { SSObjectDetail, ShortPath } from './SSObjectManagerTypes';
import { ItemId, AssetKey, AssetPath } from 'src/features/game/commons/CommonsTypes';
import { objectDetailStyle, activeSelectMargin, scaleFactor } from './SSObjectManagerConstants';
import { shortButton } from 'src/features/storySimulator/utils/StorySimulatorAssets';
import { multiplyDimensions } from 'src/features/game/utils/SpriteUtils';
import { toIntString } from '../utils/SSUtils';

export default class SSObjectManager {
  private objectPlacement: ObjectPlacement | undefined;
  private objectIdNumber: number;
  private objectDetailMap: Map<ItemId, SSObjectDetail>;
  private assetMap: Map<AssetKey, ShortPath>;
  private objectDetailMapContainer: Phaser.GameObjects.Container | undefined;
  private activeSelection: Phaser.GameObjects.Image | undefined;
  private activeSelectRect: Phaser.GameObjects.Rectangle | undefined;
  private backgroundAssetPath: string | undefined;

  constructor() {
    this.objectIdNumber = 0;
    this.objectDetailMap = new Map<ItemId, SSObjectDetail>();
    this.assetMap = new Map<AssetKey, ShortPath>();
  }

  public initialise(objectPlacement: ObjectPlacement) {
    this.objectPlacement = objectPlacement;
    this.objectIdNumber = 0;
    this.objectDetailMap = new Map<ItemId, SSObjectDetail>();
    this.trackDraggables();
    this.drawActiveSelectRect();
  }

  private trackDraggables() {
    this.getObjectPlacement().input.on(
      'drag',
      (_: MouseEvent, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;

        this.setAttribute(gameObject, 'x', dragX);
        this.setAttribute(gameObject, 'y', dragY);
        this.setActiveSelection(gameObject);
      }
    );
  }

  public loadBackground() {
    const shortPath = sessionStorage.getItem('selectedAsset');
    if (!shortPath || !shortPath.startsWith('/locations/')) {
      return;
    }
    this.backgroundAssetPath = shortPath;

    const backgroundAssetKey = `!${shortPath}`;
    this.assetMap.set(backgroundAssetKey, shortPath);
    this.loadImage(
      backgroundAssetKey,
      Constants.assetsFolder + shortPath,
      (backgroundAssetKey: string) => {
        this.renderBackground(backgroundAssetKey);
      }
    );
  }

  private renderBackground(backgroundAssetKey: AssetKey) {
    if (backgroundAssetKey[0] !== '!') {
      return;
    }
    this.getObjectPlacement().layerManager.clearLayerContents(Layer.Background);
    const backgroundSprite = new Phaser.GameObjects.Image(
      this.getObjectPlacement(),
      screenCenter.x,
      screenCenter.y,
      backgroundAssetKey
    );
    this.getObjectPlacement().layerManager.addToLayer(Layer.Background, backgroundSprite);
  }

  private loadImage(assetKey: AssetKey, assetPath: AssetPath, onLoad: (key: AssetKey) => void) {
    if (this.getObjectPlacement().textures.get(assetKey).key !== '__MISSING') {
      this.renderObject(assetKey);
    } else {
      this.getObjectPlacement().load.image(assetKey, assetPath);
      this.getObjectPlacement().load.once('filecomplete', onLoad);
      this.getObjectPlacement().load.start();
    }
  }

  public loadObject() {
    const shortPath = sessionStorage.getItem('selectedAsset');
    if (!shortPath) return;
    const objectAssetKey = `#${shortPath}`;
    this.assetMap.set(objectAssetKey, shortPath);

    this.loadImage(objectAssetKey, Constants.assetsFolder + shortPath, (objectAssetKey: string) => {
      this.renderObject(objectAssetKey);
    });
  }

  private renderObject(objectAssetKey: string) {
    if (objectAssetKey[0] !== '#') {
      return;
    }
    const objectSprite = new Phaser.GameObjects.Image(
      this.getObjectPlacement(),
      screenCenter.x,
      screenCenter.y,
      objectAssetKey
    )
      .setInteractive()
      .setDataEnabled();

    this.getObjectPlacement().input.setDraggable(objectSprite);
    const itemId = this.generateItemId(objectAssetKey, this.objectIdNumber++);
    objectSprite.data.set('itemId', itemId);

    const shortPath = this.assetMap.get(objectAssetKey);
    if (!shortPath) {
      throw new Error('Object short path not recorded');
    }

    const objectDetail: SSObjectDetail = {
      id: itemId,
      assetKey: objectAssetKey,
      assetPath: shortPath,
      x: screenCenter.x,
      y: screenCenter.y
    };

    this.objectDetailMap.set(itemId, objectDetail);

    this.getObjectPlacement().layerManager.addToLayer(Layer.Objects, objectSprite);
    this.setActiveSelection(objectSprite);
  }

  private generateItemId(assetKey: string, objectIdNumber: number) {
    const itemName = assetKey.split('/').pop()!.split('.')[0];
    return `${itemName}${objectIdNumber}`;
  }

  public showObjectDetailMap() {
    this.objectDetailMapContainer = new Phaser.GameObjects.Container(
      this.getObjectPlacement(),
      0,
      0
    );
    this.objectDetailMap.forEach((ssObjectDetail: SSObjectDetail) => {
      const rect = new Phaser.GameObjects.Image(
        this.getObjectPlacement(),
        ssObjectDetail.x,
        ssObjectDetail.y,
        shortButton.key
      );
      multiplyDimensions(rect, 1.2);
      const mapShowText = new Phaser.GameObjects.Text(
        this.getObjectPlacement(),
        ssObjectDetail.x,
        ssObjectDetail.y + 10,
        this.formatObjectDetails(ssObjectDetail),
        objectDetailStyle
      ).setOrigin(0.5);
      this.objectDetailMapContainer!.add([rect, mapShowText]);
    });
    this.getObjectPlacement().add.existing(this.objectDetailMapContainer);
  }

  private drawActiveSelectRect() {
    this.activeSelectRect = new Phaser.GameObjects.Rectangle(
      this.getObjectPlacement(),
      0,
      0,
      1,
      1,
      0
    ).setAlpha(0.3);
    this.getObjectPlacement().layerManager.addToLayer(Layer.Selector, this.activeSelectRect);
  }

  private formatObjectDetails(ssObjectDetail: SSObjectDetail) {
    let message = `${ssObjectDetail.assetPath}\nx: ${toIntString(
      ssObjectDetail.x
    )}\ny: ${toIntString(ssObjectDetail.y)}`;
    if (ssObjectDetail.width) {
      message += `\nwidth: ${toIntString(ssObjectDetail.width)}\nheight: ${toIntString(
        ssObjectDetail.height!
      )}`;
    }
    return message;
  }

  public hideMap() {
    if (this.objectDetailMapContainer) {
      this.objectDetailMapContainer.destroy();
    }
  }

  public printObjectDetailMap() {
    console.log(this.getObjectDetailMap());
  }

  private getObjectDetailMap() {
    let map = '<<locations>>\n\n';
    map += this.backgroundAssetPath;
    map += '\n\n<<objects>>\n\n';
    this.objectDetailMap.forEach((objectDetail: SSObjectDetail) => {
      const objectDetailArray = [
        objectDetail.id,
        objectDetail.assetPath,
        toIntString(objectDetail.x),
        toIntString(objectDetail.y)
      ];
      if (objectDetail.width) {
        objectDetailArray.push(toIntString(objectDetail.width));
        objectDetailArray.push(toIntString(objectDetail.height!));
      }

      map += objectDetailArray.join(', ') + '\n';
    });
    return map;
  }

  private getObjectPlacement() {
    if (!this.objectPlacement) {
      throw new Error('No object placement parent scene');
    }
    return this.objectPlacement;
  }

  public resizeActive(enlarge: boolean) {
    if (!this.activeSelection || !this.activeSelectRect) {
      return;
    }
    const factor = enlarge ? scaleFactor : 1 / scaleFactor;
    multiplyDimensions(this.activeSelection, factor);
    this.activeSelectRect.displayHeight = this.activeSelection.displayHeight + activeSelectMargin;
    this.activeSelectRect.displayWidth = this.activeSelection.displayWidth + activeSelectMargin;

    this.setAttribute(this.activeSelection, 'width', this.activeSelection.displayWidth);
    this.setAttribute(this.activeSelection, 'height', this.activeSelection.displayHeight);
  }

  private setActiveSelection(gameObject: Phaser.GameObjects.Image) {
    if (!this.activeSelectRect) {
      return;
    }
    this.activeSelection = gameObject;
    this.activeSelectRect.x = gameObject.x;
    this.activeSelectRect.y = gameObject.y;
    this.activeSelectRect.displayHeight = gameObject.displayHeight + activeSelectMargin;
    this.activeSelectRect.displayWidth = gameObject.displayWidth + activeSelectMargin;
  }

  private setAttribute(gameObject: Phaser.GameObjects.Image, attribute: string, value: number) {
    const itemId = gameObject.data.get('itemId');
    const objectDetail = this.objectDetailMap.get(itemId);
    if (!objectDetail) return;
    objectDetail[attribute] = value;
  }
}
