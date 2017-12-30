import * as React from 'react';
import {SurfaceStyleSheet} from '../../../src/lib/SurfaceStyleSheet';

export const RichLink = ({name, url}: any) => (
  <surface {...styles.richLink}>
    <surface {...styles.richLinkIcon}/>
    <surface {...styles.richLinkName}>
      Official {name}
    </surface>
    <Link url={url}>{url}</Link>
  </surface>
);

export const Link = ({children, url}: any) => (
  <surface onClick={url ? () => window.open(url, '_blank') : undefined}>
    {children}
  </surface>
);

const styles = SurfaceStyleSheet.create({
  richLink: {
  },

  link: {
  },
});
