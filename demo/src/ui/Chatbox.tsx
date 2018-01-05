import * as React from 'react';
import {commonColors, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {computed} from 'mobx';
import {ChatMessage, ChatMessageEmotes} from '../state/ChatStore';
import {Link} from './Link';

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
          <surface {...styles.message}>
            {msg.username}: {formatChatboxMessage(msg.text, msg.emotes)}
          </surface>
        ))}
      </surface>
    );
  }
}

function formatChatboxMessage (text: string, availableEmotes: {[key: string]: string}) {
  const words = text.split(/\s+/);
  const formatted = words.map((word, i) => {
    const res = /@(\w+)/.exec(word);
    if (res) {
      return <Link key={i} url={`https://twitch.tv/${res[1]}`}>{word} </Link>;
    }
    if (availableEmotes.hasOwnProperty(word)) {
      return <surface {...styles.emote} backgroundImage={availableEmotes[word]}/>;
    }
    return word + ' ';
  });
  return formatted;
}

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
  } as SurfaceStyle,

  emote: {
    width: 25,
    height: 28,
    marginRight: 5
  }
};
