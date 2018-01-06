import * as React from 'react';
import {RichLink} from '../ui/Link';

export const infoToasties = [
  <RichLink
    icon={require('../assets/codenjoy-icon.jpg')}
    name="Visit codenjoy.tv for an even better streaming experience!"
    url="http://codenjoy.tv"
  />,
  <RichLink
    icon={require('../assets/discord-icon.png')}
    name="Do you also enjoy code?\nMove your butt over to discord! https://discord.gg/Y2t9C2s"
    url="http://discord.gg/Y2t9C2s"
  />,
  <RichLink
    icon={require('../assets/instagram-icon.png')}
    name="I have instagram: instagram.com/codenjoy"
    url="http://instagram.com/codenjoy"
  />
];
