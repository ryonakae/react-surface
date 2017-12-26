import * as React from 'react';
import * as Color from 'color';
import {Tween} from '../../src';
import {observer} from 'mobx-react/custom';
import {observable, action} from 'mobx';

@observer
export class Box extends React.Component<{
  properties: Array<{name: string, off: any, on: any}>
}> {
  @observable isOn = false;
  private intervalId: any;

  componentWillMount () {
    this.intervalId = setInterval(this.toggle.bind(this), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  @action
  toggle () {
    this.isOn = !this.isOn;
  }

  render () {
    const label = this.props.properties.map(({name}) => name).join(', ');
    const style = this.props.properties.reduce(
      (style, {name, off, on}) => {
        const steps = name.split('.');
        const last = steps.splice(steps.length - 1, 1)[0];
        let obj: any = style;
        for (const step of steps) {
          obj = obj[step] = (obj[step] || (obj[step] = {}));
        }
        obj[last] = Tween.toggle(on, off, this.isOn);
        return style;
      },
      {}
    );

    return (
      <surface {...Object.assign({}, styles.box, style)}>
        <surface {...styles.inner}>
          <text value={label}/>
        </surface>
      </surface>
    );
  }
}

const styles = {
  box: {
    padding: 25,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.rgb('#999222'),
    backgroundImage: require('./assets/hat.png'),
    backgroundOpacity: 0.5,
    backgroundSize: 'contain',
    border: 10,
    borderColor: Color.rgb('#ff0000').alpha(0.5),
    overflow: 'hidden'
  } as SurfaceStyle,

  inner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Color.rgb('#0000ff').alpha(0.5)
  } as SurfaceStyle
};
