import React from 'react';
import ModalInfo from './ModalInfo';

export default {
  title: 'ModalInfo',
  componente: ModalInfo
};

const Template = (args) => <ModalInfo {...args} />;

export const Default = Template.bind({});
Default.args = {};