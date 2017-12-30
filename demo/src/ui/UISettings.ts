import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';
import {Grid} from './Grid';
import * as Color from 'color';

const screenWidth = 1920;
const screenHeight = 1080;
const commonMargin = screenHeight * 0.05;
const pTop = commonMargin;
const pBottom = commonMargin / 2;
const pHorizontal = commonMargin;

export const grid: Grid = new Grid(
  screenWidth, screenHeight, 16, 16, 10, 10, 2,
  pTop, pHorizontal, pBottom, pHorizontal
);

export const commonColors = {
  lightBlue: Color.rgb('#4573ae')
};

export const commonStyles = SurfaceStyleSheet.create({
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  blueLine: {
    backgroundColor: commonColors.lightBlue,
    padding: grid.gutter / 2
  }
});
