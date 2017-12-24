import {Sprite, Graphics} from 'pixi.js';
import * as Color from 'color';

export function createRectGraphics (size: Size, color: Color, borderRadius: number) {
  const gfx = new Graphics();
  gfx.beginFill(color.rgbNumber(), color.alpha());
  if (borderRadius !== undefined) {
    gfx.drawRoundedRect(0, 0, size.width, size.height, borderRadius);
  } else {
    gfx.drawRect(0, 0, size.width, size.height);
  }
  gfx.endFill();
  return gfx;
}

export function resizeAndPositionSprite (
  sprite: Sprite,
  container: Size,
  position: RenderProps['backgroundPosition'] = ['50%', '50%'],
  size: RenderProps['backgroundSize']
) {
  const containerRatio = container.width / container.height;
  const spriteRatio = sprite.width / sprite.height;

  let scaleX = 1;
  let scaleY = 1;

  // Determine scale
  let percentage: {x: number, y: number};
  if (typeof size === 'string') {
    const p = getPercentage(size, -1);
    if (p !== -1) {
      percentage = {x: p, y: p};
    } else if (size === 'cover' ? (containerRatio > spriteRatio) : (containerRatio < spriteRatio)) {
      scaleX = scaleY = container.width / sprite.width;
    } else {
      scaleX = scaleY = container.height / sprite.height;
    }
  } else if (Array.isArray(size)) {
    percentage = {
      x: getPercentage(size[0]),
      y: getPercentage(size[1])
    };
  } else {
    const p = getPercentage(size);
    percentage = {x: p, y: p};
  }

  if (percentage !== undefined) {
    scaleX = percentage.x * container.width / sprite.width;
    scaleY = percentage.y * container.height / sprite.height;
  }

  // Determine position
  const xPositionPercentage = getPercentage(position[0], -1);
  const yPositionPercentage = getPercentage(position[1], -1);
  sprite.position.set(
    xPositionPercentage !== -1 ?
      -(sprite.width * scaleX - container.width) * xPositionPercentage :
      position[0] as number,
    yPositionPercentage !== -1 ?
      -(sprite.height * scaleY - container.height) * yPositionPercentage :
      position[1] as number
  );

  sprite.scale.set(scaleX, scaleY);
}

function getPercentage (value: SurfaceValueP, fallbackValue?: number) {
  if (typeof value === 'string') {
    const percentageMatch = /(.*?)%$/.exec(value);
    if (percentageMatch) {
      return parseFloat(percentageMatch[1]) / 100;
    }
  }
  if (fallbackValue === undefined) {
    throw new Error('Could not get percentage');
  }
  return fallbackValue;
}
