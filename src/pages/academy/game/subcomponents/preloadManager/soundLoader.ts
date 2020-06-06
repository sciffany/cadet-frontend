import Constants from '../constants/constants';

// export function playAsyncSound(name: string) {
//   _.get(soundAssets, 'name').play();
// }

export function playSound(name: string) {
  const sound = new Audio(Constants.soundPath + name + '.mp3');
  sound && sound.play();
}
