import { screenCenter, screenSize } from '../commons/CommonConstants';

export const popUpImgXOffset = 20;
export const popUpImgYOffset = 20;

const popUpXOffset = 350;
const popUpYPos = screenCenter.y / 2;

export const popUpPos = {
  x: { Left: popUpXOffset, Middle: screenCenter.x, Right: screenSize.x - popUpXOffset },
  y: popUpYPos
};