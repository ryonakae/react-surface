import * as React from 'react';
import {Interactive} from './Interactive';

export const Link = ({children, url, ...rest}: any) => (
  <Interactive onClick={() => window.open(url, '_blank')} {...rest}>
    {children}
  </Interactive>
);
