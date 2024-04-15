import React from 'react';
import ModalAddPoint from './ModalAddPoint';


export default{
  title: 'Common/addPoint',
  component : ModalAddPoint,
};

const Template = (args) => <ModalAddPoint {...args} />;

const AddPoiTemplate = (args) => <ModalAddPoint{...args} />; 

export const Default = Template.bind({});
Default.args = {
  mode: 'AddPOIFlat',
  text: 'Punto',
  openModal : true
};

export const AddPoi = AddPoiTemplate.bind({});
AddPoi.args = {
  mode: 'ADD_POI',
  text: 'Punto',
  openModal : true
};

