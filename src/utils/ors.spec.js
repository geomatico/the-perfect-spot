import {expect} from 'chai';
import fetchMock from 'fetch-mock';
import foot from '../test/fixtures/foot-walking.json';

import {getIsochrones, ors_modes} from './ors';


describe('OpenRouteService helper', () => {
  const url = 'https://ors.com/api/';
  const mode = ors_modes['foot-walking'];
  fetchMock.post(url + mode, foot);
  
  it('Get Valid geojson from ORS', (done) => {
    getIsochrones(-3.700105, 40.240990, {url, mode: ors_modes['foot-walking']})
      .then(geojson => {
        expect(geojson.type).to.equal('FeatureCollection');
        expect(geojson.features.length).to.equal(3);
        done();
      });
  });
});