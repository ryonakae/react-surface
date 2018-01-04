import * as React from 'react';
import {commonColors, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {computed} from 'mobx';
import {ChatMessage} from '../state/ChatStore';

@observer
export class Chatbox extends React.Component<{
  messages: ChatMessage[],
  style: SurfaceStyle
}> {
  @computed get visibleMessages () {
    const max = 35;
    const sorted = this.props.messages.slice().sort(ChatMessage.compare);
    return sorted.slice(sorted.length > max ? sorted.length - max : 0);
  }

  render () {
    const style = {
      ...styles.chatbox,
      ...this.props.style
    };

    return (
      <surface {...style}>
        {this.visibleMessages.map((msg) => (
          <ChatboxMessage key={msg.id} message={msg}/>
        ))}
      </surface>
    );
  }
}

const ChatboxMessage = ({message}: {message: ChatMessage}) => {
  return (
    <surface {...styles.message}>
      {message.username + ': ' + message.text}
    </surface>
  );
};

const styles = {
  chatbox: {
    backgroundColor: commonColors.darkBlue,
    dropShadowColor: commonColors.nightBlue,
    dropShadowSize: grid.gutter / 2,
    padding: grid.gutter,
    marginTop: grid.gutter,
    borderRadius: grid.gutter / 2,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  } as SurfaceStyle,

  message: {
    flexDirection: 'row',
    wordWrap: true,
    flexWrap: 'wrap',
    marginTop: grid.gutter / 2
  } as SurfaceStyle
};
