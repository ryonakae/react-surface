"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// HACK needs to match event types in global.d.ts
exports.surfaceEvents = {
    onClick: { pixiName: 'click', isInteractive: true },
    onRightClick: { pixiName: 'rightclick', isInteractive: true },
    onMouseDown: { pixiName: 'mousedown', isInteractive: true },
    onMouseUp: { pixiName: 'mouseup', isInteractive: true },
    onMouseEnter: { pixiName: 'mouseover', isInteractive: true },
    onMouseLeave: { pixiName: 'mouseout', isInteractive: true },
    onSizeChanged: { pixiName: 'resize', isInteractive: false }
};
exports.pixiEvents = {};
for (const surfaceEventName in exports.surfaceEvents) {
    const info = exports.surfaceEvents[surfaceEventName];
    exports.pixiEvents[info.pixiName] = info;
}
function diffEventProps(prevProps, nextProps) {
    const removed = {};
    const added = {};
    const changed = {};
    for (const name in exports.surfaceEvents) {
        const prev = prevProps[name];
        const next = nextProps[name];
        if (prev && next) {
            if (prev !== next) {
                changed[name] = [prev, next];
            }
        }
        else if (prev && !next) {
            removed[name] = prev;
        }
        else if (!prev && next) {
            added[name] = next;
        }
    }
    return { removed, added, changed };
}
exports.diffEventProps = diffEventProps;
