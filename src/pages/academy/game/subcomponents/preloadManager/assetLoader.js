function preloadAssets(assetsToLoadTable) {
  var assets = Object.keys(assetsToLoadTable);
  assets.forEach(asset => PIXI.loader.add(assets[i], assets[i]));
}

function markAssetsToLoad(story, assetsToLoadTable) {
  var node;
  var resName;
  var i;
  var nodes = story.getElementsByTagName('LOCATION');
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    var name = node.getAttribute('name');
    var skin = node.getAttribute('skin') || 'normal';
    resName = Constants.locationPath + name + '/' + skin + '.png';
    if (!PIXI.utils.TextureCache[resName]) {
      assetsToLoadTable[resName] = true;
    }
  }
  nodes = story.getElementsByTagName('OBJECT');
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    var name = node.getAttribute('name');
    var skin = node.getAttribute('skin') || 'normal';
    resName = Constants.objectPath + name + '/' + skin + '.png';
    if (!PIXI.utils.TextureCache[resName]) {
      assetsToLoadTable[resName] = true;
    }
  }
  nodes = story.getElementsByTagName('TEMP_OBJECT');
  // same as normal object
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    var name = node.getAttribute('name');
    var skin = node.getAttribute('skin') || 'normal';
    resName = Constants.objectPath + name + '/' + skin + '.png';
    if (!PIXI.utils.TextureCache[resName]) {
      assetsToLoadTable[resName] = true;
    }
  }
  nodes = story.getElementsByTagName('IMAGE');
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    resName = Constants.imgPath + node.textContent;
    if (!PIXI.utils.TextureCache[resName]) {
      assetsToLoadTable[resName] = true;
    }
  }
  nodes = story.getElementsByTagName('SPEECH');
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    var speaker = node.getAttribute('speaker');
    var audience = node.getAttribute('audience');
    resName = Constants.avatarPath + speaker + '/sprites.json';
    if (speaker != 'you' && !PIXI.utils.TextureCache[resName]) {
      assetsToLoadTable[resName] = true;
    }
    if (audience && audience != 'you') {
      resName = Constants.avatarPath + audience + '/sprites.json';
      if (!PIXI.utils.TextureCache[resName]) {
        assetsToLoadTable[resName] = true;
      }
    }
  }
}
