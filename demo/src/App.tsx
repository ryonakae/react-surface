import * as React from 'react';
import {fonts} from './assets/fonts';
import * as Color from 'color';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {SurfaceStyleSheet} from '../../src/lib/SurfaceStyleSheet';
import {ToastyList} from './ui/ToastyList';
import {Toasty} from './state/Toasty';
import {Button} from './ui/Button';

@observer
export class App extends React.Component {
  @observable toasties: Toasty[] = [];

  @action
  spawnToasty () {
    this.toasties.push(new Toasty());
  }

  render () {
    return (
      <surface {...styles.app}>
        <surface {...styles.content}>
          <Button label="Spawn Toasty" onClick={() => this.spawnToasty()}/>
        </surface>
        <ToastyList toasties={this.toasties}/>
      </surface>
    );
  }
}

const styles = SurfaceStyleSheet.create({
  app: {
    flexGrow: 1,
    backgroundColor: Color.rgb('#000000'),
    flexWrap: 'wrap',
    flexDirection: 'row',
    color: Color.rgb('#ffffff'),
    fontSize: 14,
    fontFamily: fonts.Default
  },

  content: {
    position: 'absolute'
  }
});
