import { interaction } from 'pixi.js';
import { SurfaceProps } from 'global';
declare type SurfaceEventInfo = {
    pixiName: any;
    isInteractive: boolean;
};
export declare const surfaceEvents: {
    [key: string]: SurfaceEventInfo;
};
export declare const pixiEvents: {
    [key: string]: SurfaceEventInfo;
};
export declare function diffEventProps(prevProps: SurfaceProps, nextProps: SurfaceProps): {
    removed: {
        [key: string]: (e: interaction.InteractionEvent) => any;
    };
    added: {
        [key: string]: (e: interaction.InteractionEvent) => any;
    };
    changed: {
        [key: string]: [(e: interaction.InteractionEvent) => any, (e: interaction.InteractionEvent) => any];
    };
};
export {};
