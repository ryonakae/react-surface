import {observable, action} from 'mobx';

let messageIdCounter = 0;

export class ChatStore {
  @observable messages: ChatMessage[] = [];

  @action
  addMessage (message: ChatMessage) {
    this.messages.push(message);
  }

  generateMessage () {
    this.addMessage(
      new ChatMessage(
        '1337haxx',
        'What a lovely message, look at it overflow, Kappa'
      )
    );
  }
}

export type ChatMessageEmotes = {[key: string]: string};

export class ChatMessage {
  id: number = messageIdCounter += 1;
  createdAt: Date = new Date();

  constructor (
    public username: string,
    public text: string,
    public emotes: ChatMessageEmotes = {}
  ) {}

  static compare (a: ChatMessage, b: ChatMessage) {
    if (a.createdAt === b.createdAt) {
      return 0;
    }
    return a.createdAt < b.createdAt ? -1 : 1;
  }
}
