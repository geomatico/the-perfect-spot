import React from 'react';
import {HashRouter, Route, Routes, useParams} from 'react-router-dom';
import i18n from 'i18next';
import {Outlet, Navigate} from 'react-router-dom';
import MapView from '../views/Map';

const LangSetter = () => {
  const {lang} = useParams();
  if (i18n.resolvedLanguage !== lang) {
    i18n.changeLanguage(lang);
  }
  return <Outlet/>;
};

const AppRoutes = () =>
  <HashRouter>
    <Routes>
      <Route path=":lang" element={<LangSetter/>}>
        <Route exact path="" element={<Navigate to="map"/>}/>
        <Route exact path="map" element={<MapView/>}/>
        {/*
         <Route exact path="detail" element={<Layout mainContent={<MapView/>} miniSidePanelSelectedActionId='detail'/>}/>
        */}
        <Route path="*" element={<>404</>}/>
      </Route>
      <Route path="*" element={<Navigate to={i18n.resolvedLanguage}/>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;

