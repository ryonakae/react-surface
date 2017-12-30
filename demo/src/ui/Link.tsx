import * as React from 'react';
import {grid} from './UISettings';
import * as Color from 'color';

type RichLinkProps = {
  name: string,
  icon: string,
  url: string
};

export const RichLink = (props: RichLinkProps) => (
  <surface flexDirection="row" alignItems="center">
    <surface {...styles.richLinkIcon(props.icon)}/>
    <Link url={props.url}>{props.name}</Link>
  </surface>
);

export const Link = ({children, url}: any) => (
  <surface onClick={() => window.open(url, '_blank')}>
    {children}
  </surface>
);

const styles = {
  richLinkIcon (url: string) {
    const size = grid.ySpan(0.75);
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: Color.rgb('#ffffff'),
      backgroundImage: url,
      marginRight: grid.gutter,
      marginLeft: grid.gutter
    };
  }
};
