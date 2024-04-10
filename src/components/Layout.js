import React, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';

import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';
import RouteIcon from '@mui/icons-material/Route';
import ModalReload from './ModalReload';
import {
  DRAWER_WIDTH,
  MINI_SIDE_PANEL_DENSE_WIDTH,
  MINI_SIDE_PANEL_WIDTH,
  SM_BREAKPOINT,
} from '../config';

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isLeftDrawerOpen'
})(({widescreen, isLeftDrawerOpen}) => ({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 56,
  '@media (min-width: 0px) and (orientation: landscape)': {
    top: 48
  },
  ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
    top: 64
  },
  bottom: 0,
  right: 0,
  left: widescreen ? (isLeftDrawerOpen && DRAWER_WIDTH) + MINI_SIDE_PANEL_WIDTH : MINI_SIDE_PANEL_DENSE_WIDTH
}));

const Layout = ({mainContent, sidePanelContent}) => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleClose = () => setIsSidePanelOpen(!isSidePanelOpen);

  //This state is created to turn the modal on or off
  const [showReloadModal,setReloadModal] = useState(false);
  //the effect is used to assign an event to icon , selecting it for the class.


  useEffect(()=>{
    const handleIcon = document.querySelector('.ResponsiveHeader-logo');
    const openModal = ()=>{
      setReloadModal(true);
    };
  
    handleIcon.addEventListener('click',openModal);
  },[]);
  const closeModal = ()=>{
    setReloadModal(false);
  };
  return <>
    <ResponsiveHeader
      logo={<RouteIcon fontSize='large' sx={{mt: 1}}/>}
      title='The perfect Spot'
      onStartIconClick={widescreen ? undefined : handleClose}
      isStartIconCloseable={isSidePanelOpen}
      sx={{'&.MuiAppBar-root': {zIndex: 1500}}}
    >
      <ModalReload open={showReloadModal} onClose={closeModal}/>
    </ResponsiveHeader>
    {
      sidePanelContent && isSidePanelOpen && <SidePanel
        drawerWidth={DRAWER_WIDTH + 'px'}
        anchor="left"
        isOpen={isSidePanelOpen}
        onClose={handleClose}
        widescreen={widescreen}
        sx={{'& .MuiPaper-root': {left: widescreen ? MINI_SIDE_PANEL_WIDTH : MINI_SIDE_PANEL_DENSE_WIDTH}}}
      >
        {sidePanelContent}
      </SidePanel>
    }
    <Main widescreen={widescreen} isLeftDrawerOpen={sidePanelContent && isSidePanelOpen}>
      {mainContent}
    </Main>
  </>;
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired,
  miniSidePanelSelectedActionId: PropTypes.string.isRequired,
};

Layout.defaultProps = {
  miniSidePanelSelectedActionId: 'mapView',
};

export default Layout;
