import classNames from 'classnames';
import React from 'react';
/** Gradient that appears in the background of the UI. */
const BackgroundShapes = ({
  position = 'fixed'
}) => <div className={classNames(position, 'top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none')}>
    <div className='w-screen h-screen bg-gradient-sm lg:bg-gradient-lg' />
  </div>;
export default BackgroundShapes;