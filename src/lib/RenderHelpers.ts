import {Sprite, Graphics, Container} from 'pixi.js';
import * as Color from 'color';
import {commonColors} from './constants';

export function createBorderGraphics (
  size: Size,
  widths: number[],
  radius: number,
  colors: Color[]
) {
  // Draw borders
  const gfx = new Graphics();
  let angle = 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < 4; i += 1) {
    const nextAngle = angle + Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const isHorizontal = Math.abs(cos) === 1 || Math.abs(sin) === 1;
    const width = widths[i];
    const color = colors[i];
    const prevWidth = widths[i === 0 ? 3 : i - 1];

    // Compensate position for drawing outside container due to border width expanding outwards
    x += (width / 2) * Math.cos(nextAngle);
    y += (width / 2) * Math.sin(nextAngle);

    // Start the brush with an offset to avoid overlapping borders
    const offset = i === 0 ? prevWidth : 0;
    x += offset * cos;
    y += offset * sin;

    // Remove the previous width from the border length to avoid overlapping borders
    const length = (isHorizontal ? size.width : size.height) - prevWidth;

    // Set brush origin and style
    gfx.moveTo(x, y);
    gfx.lineStyle(width, color.rgbNumber(), color.alpha());

    // Move to the end of the current border
    x += length * cos;
    y += length * sin;

    // Draw the current border
    gfx.lineTo(x, y);

    // Turn 90 degrees to prepare the next border
    x += (width / 2) * Math.cos(nextAngle);
    y += (width / 2) * Math.sin(nextAngle);
    angle = nextAngle;
  }
  gfx.endFill();

  // Apply border radius
  const mask = createRectGraphics(size, commonColors.transparent, radius);
  const container = new Container();
  container.addChild(gfx);
  container.addChild(mask);
  container.mask = mask;

  return container;
}

export function createRectGraphics (size: Size, color: Color, borderRadius: number = 0) {
  const gfx = new Graphics();
  gfx.beginFill(color.rgbNumber(), color.alpha());
  gfx.drawRoundedRect(0, 0, size.width, size.height, borderRadius);
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
