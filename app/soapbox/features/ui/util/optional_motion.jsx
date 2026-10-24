import React from 'react';
import { Motion } from 'react-motion';
import { useSettings } from 'soapbox/hooks';
import ReducedMotion from './reduced_motion';
const OptionalMotion = props => {
  const reduceMotion = useSettings().get('reduceMotion');
  return reduceMotion ? <ReducedMotion {...props} /> : <Motion {...props} />;
};
export default OptionalMotion;