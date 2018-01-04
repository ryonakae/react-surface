import axios from 'axios';
import {StreamStore} from './StreamStore';
import {ChatMessage, ChatStore} from './ChatStore';
import {ToastyStore} from './ToastyStore';
import {HostToasty, ResubToasty, SubToasty} from './Toasty';

const tmi = require('tmi.js');

type TwitchClientOptions = {
  clientID: string;
  channel: string;
};

export class TwitchClient {
  private messageClient: any;
  private krakenClient: KrakenClient;
  private streamPollInterval: number = 10 * 1000;

  constructor (
    private options: TwitchClientOptions
  ) {
    this.krakenClient = new KrakenClient(options.clientID);
    this.messageClient = new tmi.client({
      options: {debug: true},
      connection: {reconnect: true},
      identity: {client_id: options.clientID},
      channels: ['#' + options.channel]
    });
  }

  private async fetchStream (store: StreamStore) {
    const channel = await this.krakenClient.getUser(this.options.channel);
    const stream = await this.krakenClient.getStream(channel._id);

    if (stream) {
      store.setIsOnline(true);
      store.update(
        new Date(stream['created_at']),
        stream.viewers,
        stream.game,
        stream.channel.status,
        stream.channel.viewers,
        stream.channel.followers
      );
    } else {
      store.setIsOnline(false);
    }
  }

  initialize (store: StreamStore, chatbox: ChatStore, toasties: ToastyStore) {
    // Kraken binding
    this.fetchStream(store);
    const streamPollIntervalId = setInterval(
      () => this.fetchStream(store),
      this.streamPollInterval
    );

    // TMI binding
    this.messageClient.connect();
    this.messageClient.on('chat', (...args: any[]) =>
      chatbox.addMessage(new ChatMessage(args[1]['display-name'], args[2]))
    );
    this.messageClient.on('subscription', (...args: any[]) =>
      toasties.addToasty(new SubToasty(args[1], args[2], args[3]))
    );
    this.messageClient.on('resub', (...args: any[]) =>
      toasties.addToasty(new ResubToasty(args[1], args[5], args[3], args[2]))
    );
    this.messageClient.on('hosted', (...args: any[]) =>
      toasties.addToasty(new HostToasty(args[1], args[2], args[3]))
    );

    return () => {
      clearInterval(streamPollIntervalId);
      this.messageClient.removeAllListeners();
      this.messageClient.disconnect();
    };
  }
}

class KrakenClient {
  constructor (
    private clientID: string
  ) {}

  async getUser (username: string) {
    const {users} = await this.request('users?login=' + username);
    return users[0];
  }

  async getStream (channelID: string) {
    const {stream} = await this.request('streams/' + channelID);
    return stream;
  }

  private async request (query: string) {
    const response = await axios.get('https://api.twitch.tv/kraken/' + query, {
      headers: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': this.clientID
      }
    });

    return response.data;
  }
}
