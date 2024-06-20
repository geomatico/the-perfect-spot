import React from 'react';
import DeletePointsModal from './DeletePointsModal';

export default {
  title: 'ModalDeletePoints',
  component: DeletePointsModal,
};

const Template = (args) => <DeletePointsModal {...args} />;

export const Default = Template.bind({});
Default.args = {};