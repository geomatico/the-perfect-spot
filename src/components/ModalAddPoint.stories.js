import React from 'react';
import ModalAddPoint from './ModalAddPoint';


export default{
  title: 'Common/addPoint',
  component : ModalAddPoint,
  argTypes: {
    poiType: {
      control: 'inline-radio',
      options: ['ADD_POI','AddPOIFlat'] 
    }
  }
};

const Template = (args) => <ModalAddPoint {...args} />;



export const Default = Template.bind({});
Default.args = {
  poiType: 'ADD_POI',
  poiName: 'Punto',
};

