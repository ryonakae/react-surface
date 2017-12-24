import * as React from 'react';
import {observable} from 'mobx';
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
        onMouseEnter={() => this.isHovered = true}
        onMouseLeave={() => this.isHovered = false}
      >
        <text value={message}/>
      </surface>
    );
  }

  onKeyUp (e: KeyboardEvent) {
    if (e.key === ' ') {
      this.isAlternate = !this.isAlternate;
    }
  }
}

const styles = SurfaceStyleSheet.create({
  box: {
    padding: 25,
    paddingTop: 100,
    paddingBottom: 100,
    flexDirection: 'column',
    backgroundColor: Color.rgb('#123012'),
    backgroundImage: require('./assets/hat.png'),
    backgroundOpacity: 0.5,
    borderRadius: 5,
    marginBottom: 10,
    text: {
      wordWrap: true
    }
  },

  boxAlternate: {
    backgroundColor: Color.rgb('#321321')
  },

  boxHovered: {
    backgroundColor: Color.rgb('#999222')
  }
});
