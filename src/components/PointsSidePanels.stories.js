import React from 'react';
import PointsSidePanels from './PointsSidePanels';

export default {
  title: 'PointsSidePanels',
  decorators: [(Story) => <div style={{width:'40%'}}><Story/></div>],
  component: PointsSidePanels,

};

const Template = (args) => <PointsSidePanels {...args} />;

export const Default = Template.bind({});
Default.args = {};

