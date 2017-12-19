import {uniq} from 'lodash';

export function diffEventProps (prevProps: SurfaceProps, nextProps: SurfaceProps) {
  const removed: {[key: string]: (e: Event) => any} = {};
  const added: {[key: string]: (e: Event) => any} = {};
  const changed: {[key: string]: [(e: Event) => any, (e: Event) => any]} = {};

  // HACK suboptimal, should get list of known event names from a registry
  const eventNames = uniq(Object.keys(prevProps).concat(Object.keys(nextProps)))
    .filter((key: string) => /^on[A-Z]/.test(key));

  for (const name of eventNames) {
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
