import {interaction} from 'pixi.js';
const yoga = require('yoga-layout');

type YogaValueTransformerFn = (value: any) => any[];
type YogaValueTransformer = {transform: YogaValueTransformerFn, functionName: string};

const mixedYogaValueTransformers: {[key: string]: YogaValueTransformerFn | YogaValueTransformer} = {
  display (value: string) {
    switch (value) {
      case 'flex': return yoga.DISPLAY_FLEX;
      case 'none': return yoga.DISPLAY_NONE;
    }
  },

  top: {
    functionName: 'setPosition',
    transform: (value: number) => [yoga.EDGE_TOP, value]
  },

  right: {
    functionName: 'setPosition',
    transform: (value: number) => [yoga.EDGE_RIGHT, value]
  },

  bottom: {
    functionName: 'setPosition',
    transform: (value: number) => [yoga.EDGE_BOTTOM, value]
  },

  left: {
    functionName: 'setPosition',
    transform: (value: number) => [yoga.EDGE_LEFT, value]
  },

  position: {
    functionName: 'setPositionType',
    transform (value: string) {
      switch (value) {
        case 'relative': return [yoga.POSITION_TYPE_RELATIVE];
        case 'absolute': return [yoga.POSITION_TYPE_ABSOLUTE];
      }
    }
  },

  overflow (value: string) {
    switch (value) {
      case 'visible': return yoga.OVERFLOW_VISIBLE;
      case 'hidden': return yoga.OVERFLOW_HIDDEN;
      case 'scroll': return yoga.OVERFLOW_SCROLL;
    }
  },

  alignItems (value: string) {
    switch (value) {
      case 'auto': return yoga.ALIGN_AUTO;
      case 'flex-start': return yoga.ALIGN_FLEX_START;
      case 'center': return yoga.ALIGN_CENTER;
      case 'flex-end': return yoga.ALIGN_FLEX_END;
      case 'stretch': return yoga.ALIGN_STRETCH;
      case 'baseline': return yoga.ALIGN_BASELINE;
      case 'space-between': return yoga.ALIGN_SPACE_BETWEEN;
      case 'space-around': return yoga.ALIGN_SPACE_AROUND;
    }
  },

  justifyContent (value: string) {
    switch (value) {
      case 'flex-start': return yoga.JUSTIFY_FLEX_START;
      case 'center': return yoga.JUSTIFY_CENTER;
      case 'flex-end': return yoga.JUSTIFY_FLEX_END;
      case 'space-between': return yoga.JUSTIFY_SPACE_BETWEEN;
      case 'space-around': return yoga.JUSTIFY_SPACE_AROUND;
      case 'space-evenly': return yoga.JUSTIFY_SPACE_EVENLY;
    }
  },

  flexDirection (value: string) {
    switch (value) {
      case 'column': return yoga.FLEX_DIRECTION_COLUMN;
      case 'row': return yoga.FLEX_DIRECTION_ROW;
    }
  },

  flexWrap (value: string) {
    switch (value) {
      case 'wrap': return yoga.WRAP_WRAP;
      case 'nowrap': return yoga.WRAP_NO_WRAP;
      case 'wrap-reverse': return yoga.WRAP_REVERSE;
    }
  }
};

export function getYogaValueTransformer (propertyName: string): YogaValueTransformer {
  const transformer = mixedYogaValueTransformers[propertyName];
  if (!transformer) {
    return {
      transform: (value: any) => [value],
      functionName: getYogaNodeSetFunctionName(propertyName)
    };
  }

  if (typeof transformer === 'function') {
    return {
      transform: (value) => [transformer(value)],
      functionName: getYogaNodeSetFunctionName(propertyName)
    };
  }

  return transformer;
}

export function getYogaNodeSetFunctionName (propertyName: string) {
  return 'set' + propertyName[0].toUpperCase() + propertyName.substr(1);
}

export const yogaEventNameMap: {[key: string]: interaction.InteractionEventTypes} = {
  onClick: 'click',
  onRightClick: 'rightclick',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseEnter: 'mouseover',
  onMouseLeave: 'mouseout'
};

const edgeNames = ['Top', 'Right', 'Bottom', 'Left'];
const edgeValues = [yoga.EDGE_TOP, yoga.EDGE_RIGHT, yoga.EDGE_BOTTOM, yoga.EDGE_LEFT];
export function takeYogaEdgeValues (props: any, propertyNameBase: string): number[] {
  const baseValues: number[] | number = props[propertyNameBase];

  let initialValues;
  if (baseValues === undefined) {
    initialValues = [0, 0, 0, 0];
  } else if (typeof baseValues === 'number') {
    initialValues = [baseValues, baseValues, baseValues, baseValues];
  } else {
    initialValues = baseValues;
  }

  return edgeNames.reduce(
    (values, cornerName, index) => {
      const propertyName = propertyNameBase + cornerName;
      if (props.hasOwnProperty(propertyName)) {
        const value = props[propertyName];
        delete props[propertyName];
        values[edgeValues[index]] = value;
      }
      return values;
    },
    initialValues
  );
}
