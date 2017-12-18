export function isDirectTextChildProps (props: SurfaceProps) {
  const childrenType = typeof props.children;
  return childrenType === 'string' || childrenType === 'number';
}
