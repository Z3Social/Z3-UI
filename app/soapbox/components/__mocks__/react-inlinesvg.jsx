const InlineSVG = ({
  loader
}) => {
  if (loader) {
    return loader;
  } else {
    throw 'You used react-inlinesvg without a loader! This will cause jumpy loading during render.';
  }
};
export default InlineSVG;