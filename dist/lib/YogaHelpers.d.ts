declare type YogaValueTransformerFn = (value: any) => any[];
declare type YogaValueTransformer = {
    transform: YogaValueTransformerFn;
    functionName: string;
};
export declare function getYogaValueTransformer(propertyName: string): YogaValueTransformer;
export declare function getYogaNodeSetFunctionName(propertyName: string): string;
declare type ValueTaker = (name: string, fallbackValue: any) => any;
export declare function takeYogaEdgeValues(source: any | ValueTaker, propertyNameBase: string, getArray?: boolean, fallbackBaseValue?: any): any[] | {
    [x: number]: any;
};
export {};
