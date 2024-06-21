import React from 'react';
import PointsSidePanels from './PointsSidePanels';

export default {
  title: 'PointsSidePanels',
  decorators: [(Story) => <div style={{ width: '40%' }}><Story /></div>],
  component: PointsSidePanels,

};

const Template = (args) => <PointsSidePanels {...args} />;
const allPoints = {
  'red': [
    { 'id': 'c6027857-1780-408c-ba16-d36e8561cd44', 'lng': 2.1658, 'lat': 41.38376, 'name': 'Rojo' },
    { id: '2', lng: 2.174007, lat: 41.400205, name: 'Rojo 2' }
  ],
  'blue': [
    { 'id': '63cc8534-5fce-4097-a702-331af24ef7f9', 'lng': 2.14177, 'lat': 41.3721, 'name': 'Azul' },
    { id: '2', lng: 2.174007, lat: 41.400205, name: 'AZUL 2' }
  ]
};

export const Default = Template.bind({});
Default.args = {
  allPoints: allPoints,
  mode: 'ADD_BLUE',
  selectedMode : 'ADD_BLUE',
  lastModePoint: 'ADD_BLUE'
};

export const editMode = Template.bind({});
editMode.args = {
  ...Default.args,
  editMode: true
};
