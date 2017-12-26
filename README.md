# surface
A custom react renderer utilizing [yoga-layout](https://facebook.github.io/yoga/) 
targeting [pixi.js](http://www.pixijs.com/). Tweens and colors are first class 
citizens in an experiment to find a better workflow for working with animations.

## Examples

### Rendering
```typescript
// main.tsx
import * as React from 'react';
import {render} from 'react-surface';
import {Button} from './Button';

const renderMemory = {}; 
const domNode = document.createElement('div');
document.body.appendChild(domNode);
render(<Button />, domNode, renderMemory);
```

### Surfaces, tweening and coloring
```typescript
// Button.tsx
import * as React from 'react';
import {observer} from 'mobx-react/custom';
import {observable} from 'mobx';
import {Tween} from 'react-surface';
import * as Color from 'color';

@observer
class Button extends React.Component<{
  label: string
}> {
  @observable isHovered = false;
  render () {
    return (
      <surface
        {...styles.button(this.isHovered)}
        onMouseEnter={() => this.isHovered = true}
        onMouseLeave={() => this.isHovered = false}
      >
        <text value={this.props.label} />
      </surface>
    );
  }
}

const styles = {
  button (isHovered: boolean) {
    return {
      scale: Tween.to(isHovered ? 1.2 : 1),
      backgroundColor: Tween.to(
        Color.rgb(isHovered ? '#123123' : '#909090')
      )
    };
  }
};
```