import {interaction} from 'pixi.js';
import {SurfaceProps, } from 'global';

type SurfaceEventInfo = {
  pixiName: any;
  isInteractive: boolean;
};

// HACK needs to match event types in global.d.ts
export const surfaceEvents: {[key: string]: SurfaceEventInfo} = {
  onClick: {pixiName: 'click', isInteractive: true},
  onRightClick: {pixiName: 'rightclick', isInteractive: true},
  onMouseDown: {pixiName: 'mousedown', isInteractive: true},
  onMouseUp: {pixiName: 'mouseup', isInteractive: true},
  onMouseEnter: {pixiName: 'mouseover', isInteractive: true},
  onMouseLeave: {pixiName: 'mouseout', isInteractive: true},
  onSizeChanged: {pixiName: 'resize', isInteractive: false}
};

export const pixiEvents: {[key: string]: SurfaceEventInfo} = {};
for (const surfaceEventName in surfaceEvents) {
  const info = surfaceEvents[surfaceEventName];
  pixiEvents[info.pixiName] = info;
}

export function diffEventProps (prevProps: SurfaceProps, nextProps: SurfaceProps) {
  const removed: {[key: string]: (e: interaction.InteractionEvent) => any} = {};
  const added: {[key: string]: (e: interaction.InteractionEvent) => any} = {};
  const changed: {[key: string]: [
    (e: interaction.InteractionEvent) => any,
    (e: interaction.InteractionEvent) => any
  ]} = {};

  for (const name in surfaceEvents) {
    const prev = (prevProps as any)[name];
    const next = (nextProps as any)[name];
    if (prev && next) {
      if (prev !== next) {
        changed[name] = [prev, next];
      }
    } else if (prev && !next) {
      removed[name] = prev;
    } else if (!prev && next) {
      added[name] = next;
    }
  }

  return {removed, added, changed};
}
