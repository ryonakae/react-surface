import * as React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react/custom';
import * as PropTypes from 'prop-types';
import * as Color from 'color';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';

@observer
export class Box extends React.Component<{
  size?: RenderProps['backgroundSize'],
  position?: RenderProps['backgroundPosition']
}> {
  @observable isAlternate = true;
  @observable isHovered = false;
  private keyUpEventHandler: any;

  static contextTypes = {
    foo: PropTypes.string
  };

  shouldComponentUpdate () {
    return true;
  }

  componentWillMount () {
    this.keyUpEventHandler = this.onKeyUp.bind(this);
    window.addEventListener('keyup', this.keyUpEventHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.keyUpEventHandler);
  }

  @action
  setHovered (isHovered: boolean) {
    this.isHovered = isHovered;
  }

  render () {
    const mergedStyle = Object.assign({}, ...[
      styles.box,
      this.isAlternate && styles.boxAlternate,
      this.isHovered && styles.boxHovered,
      {
        backgroundSize: this.props.size,
        backgroundPosition: this.props.position
      }
    ]);

    const message = JSON.stringify(
      {
        position: this.props.position,
        size: this.props.size
      },
      null,
      2
    );

    return (
      <surface
        style={mergedStyle}
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
      >
        <surface style={styles.inner}>
          <text value={message}/>
        </surface>
      </surface>
    );
  }

  @action
  onKeyUp (e: KeyboardEvent) {
    if (e.key === ' ') {
      this.isAlternate = !this.isAlternate;
    }
  }
}

const styles = SurfaceStyleSheet.create({
  box: {
    padding: 25,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Color.rgb('#44b944'),
    backgroundImage: require('./assets/hat.png'),
    backgroundOpacity: 0.5,
    borderRadius: 10,
    border: 15,
    borderColor: Color.rgb('#aa0003').alpha(0.5),
    borderColorRight: Color.rgb('#2e8eaf').alpha(0.8),
    borderColorBottom: Color.rgb('#24b213').alpha(0.5),
    borderColorLeft: Color.rgb('#7522c8').alpha(0.2),
    marginBottom: 10,
    text: {
      wordWrap: true
    }
  },

  inner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Color.rgb('#0000ff').alpha(0.5)
  },

  boxAlternate: {
    backgroundColor: Color.rgb('#d5518d')
  },

  boxHovered: {
    backgroundColor: Color.rgb('#999222')
  }
});
