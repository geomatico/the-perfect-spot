import React from 'react';
import LoadingError from './LoadingError';

export default{
  title : 'LoadingError',
  component: LoadingError,  
};

const Template = (args) => <LoadingError{...args} />;

export const Default = Template.bind({});
