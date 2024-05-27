import React from 'react';
import ModalEditPoint from './ModalEditPoint';
import { v4 as uuid } from 'uuid';
export default {
  title: 'editPoint',
  component: ModalEditPoint,
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['blue', 'red'],
    },
  },
};

const Template = (args) => <ModalEditPoint {...args} />;

export const Default = Template.bind({});
Default.args = {
  mode: 'blue',
  allPoints: {
    blue: [
      {
        id: uuid(),
        lat: 41.36775,
        lng: 2.14297,
        name: 'punto',
      },
    ],
    red: [
      {
        id: uuid(),
        lat: 41.36775,
        lng: 2.14297,
        name: 'punto',
      },
    ],
  },
  indexPointSelect: 0,
};
