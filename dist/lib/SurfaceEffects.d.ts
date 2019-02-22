import { Sprite, Graphics } from 'pixi.js';
import { TweenableProps } from './helpers';
import { IColor, Size, SurfaceProps, RenderProps } from 'global';
export declare class SurfaceBackground extends Graphics {
    private currentColor;
    color: IColor;
}
export declare class SurfaceImage extends Sprite {
    update(containerSize: Size, props: TweenableProps<SurfaceProps>): void;
    resize(container: Size, position?: RenderProps['backgroundPosition'], size?: RenderProps['backgroundSize']): void;
    private getPercentage;
}
export declare class SurfaceBorder extends Graphics {
    static getWidths(props: TweenableProps<SurfaceProps>): any[];
    update(size: Size, props: TweenableProps<SurfaceProps>): void;
    drawSquare(size: Size, widths: number[], colors: IColor[]): void;
    drawRadius(size: Size, width: number, color: IColor, radius: number): void;
}
