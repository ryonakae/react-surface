import {observable, action} from 'mobx';

let messageIdCounter = 0;

export class ChatStore {
  @observable messages: ChatMessage[] = [];
  @observable badges: BadgeSets = {};

  @action
  addMessage (message: ChatMessage) {
    this.messages.push(message);
  }

  @action
  updateBadges (badgeSets: BadgeSets) {
    this.badges = badgeSets;
  }

  generateMessage () {
    this.addMessage(
      new ChatMessage(
        '1337haxx',
        'What a lovely message, look at it overflow, Kappa'
      )
    );
  }

  getBadgeUrls (references: BadgeReferences) {
    const badgeUrls: {[key: string]: string} = {};
    for (const badgeName in references) {
      const badgeVersion = references[badgeName];
      badgeUrls[badgeName] = this.badges[badgeName].versions[badgeVersion].image_url_1x;
    }
    return badgeUrls;
  }
}

export type ChatMessageEmotes = {[key: string]: string};

export class ChatMessage {
  id: number = messageIdCounter += 1;
  createdAt: Date = new Date();

  constructor (
    public username: string,
    public text: string,
    public emotes: ChatMessageEmotes = {},
    public badges: BadgeReferences = {}
  ) {}

  static compare (a: ChatMessage, b: ChatMessage) {
    if (a.createdAt === b.createdAt) {
      return 0;
    }
    return a.createdAt < b.createdAt ? -1 : 1;
  }
}

export type BadgeReferences = {[key: string]: string};
export type BadgeSets = {[key: string]: BadgeSet};
export type BadgeSet = {versions: {[key: string]: BadgeUrls}};
export type BadgeUrls = {
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  description: string;
  title: string;
  click_action: string;
  click_url: string;
};
