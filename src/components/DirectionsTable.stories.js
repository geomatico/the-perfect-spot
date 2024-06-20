import React from 'react';
import DirectionsTable from './DirectionsTable';

export default {
  title: 'DirectionsTable',
  decorators: [(Story) => <div style={{ width: '40%' }}><Story /></div>],
  component: DirectionsTable,
};

const Template = (args) => <DirectionsTable {...args} />;
const calculatedRoutes = [{
  name: 'Camp nou',
  data: [['2.7', '32.4']]
},
{

  name: 'el Gornal',
  data: [['3.4', '40.1']]
}
];
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

const editedPointsName = allPoints;
export const Default = Template.bind({});
Default.args = {

  calculatedRoutes: calculatedRoutes,
  allPoints: allPoints,
  editMode: false,
  openButtonSheet: false,
  shortestRouteIndex: 0,
  editedPointsName: editedPointsName,
};

export const mobileMode = Template.bind({});
mobileMode.args = {
  ...Default.args,
  openButtonSheet: true,
  widescreen: false
};

export const editMode = Template.bind({});
editMode.args = {
  ...Default.args,
  editMode: true,
};

