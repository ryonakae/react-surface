import * as React from 'react';
import {commonColors, grid} from './UISettings';
import {observer} from 'mobx-react/custom';
import {computed} from 'mobx';
import {ChatMessage, ChatStore} from '../state/ChatStore';
import {Link} from './Link';
import * as Color from 'color';

@observer
export class Chatbox extends React.Component<{
  chatStore: ChatStore,
  style: SurfaceStyle
}> {
  @computed get visibleMessages () {
    const max = 35;
    const sorted = this.props.chatStore.messages.slice().sort(ChatMessage.compare);
    return sorted.slice(sorted.length > max ? sorted.length - max : 0);
  }

  render () {
    const style = {
      ...styles.chatbox,
      ...this.props.style
    };

    return (
      <surface {...style}>
        {this.visibleMessages.map((message) =>
          <ChatboxMessage key={message.id} store={this.props.chatStore} message={message} />
        )}
      </surface>
    );
  }
}

class ChatboxMessage extends React.Component<{
  store: ChatStore,
  message: ChatMessage
}> {
  renderBadges (): any[] {
    const urls = Object.values(this.props.store.getBadgeUrls(this.props.message.badges));
    return urls.map((url) => <Badge key={url} url={url}/>);
  }

  render () {
    const {message} = this.props;
    return (
      <surface {...styles.message}>
        {this.renderBadges()}
        <Username color={message.color} name={message.username}/>
        {formatChatboxMessage(message.text, message.emotes)}
      </surface>
    );
  }
}

function formatChatboxMessage (text: string, emotes: {[key: string]: string}) {
  const words = text.split(/\s+/);
  const formatted = words.map((word, i) => {
    if (/(https?:\/\/\S+)/.test(word)) {
      return <Link key={i} url={word}>{word} </Link>;
    }
    const mention = /@(\w+)/.exec(word);
    if (mention) {
      return <Link key={i} url={`https://twitch.tv/${mention[1]}`}>{word} </Link>;
    }
    if (emotes.hasOwnProperty(word)) {
      return <Emote key={`emote_${word}_${i}`} url={emotes[word]}/>;
    }
    return word + ' ';
  });
  return formatted;
}

const Emote = ({url}: {url: string}) => <surface {...styles.emote} backgroundImage={url}/>;
const Badge = ({url}: {url: string}) => <surface {...styles.badge} backgroundImage={url}/>;
const Username = ({color, name}: any) => (
  <surface {...styles.username(color)}>
    {name}:
  </surface>
);

const pixelsForASpace = 5;
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

  username (color: Color) {
    return {
      color,
      flexDirection: 'row',
      fontWeight: 'bold',
      marginRight: pixelsForASpace
    } as SurfaceStyle;
  },

  emote: {
    width: 25,
    height: 28,
    marginRight: pixelsForASpace
  },

  badge: {
    width: 18,
    height: 18,
    marginRight: pixelsForASpace
  }
};
