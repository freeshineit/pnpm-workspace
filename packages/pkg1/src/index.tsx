import React, { type FC } from 'react';

const PKG1: FC<{ title: string }> = (props) => {
  console.log('12341234');
  return <h4>{props.title}</h4>;
};

export default PKG1;
