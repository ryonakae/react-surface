import * as React from 'react';
import {commonColors, grid} from './UISettings';

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

export const Link = ({children, url, ...rest}: any) => (
  <surface onClick={() => window.open(url, '_blank')} {...rest}>
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
      backgroundColor: commonColors.white,
      backgroundImage: url,
      marginRight: grid.gutter,
      marginLeft: grid.gutter
    };
  }
};
