import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Map from '@geomatico/geocomponents/Map';

import {
  ADD_ORIGIN_MODE,
  ADD_POI_MODE,
  INITIAL_VIEWPORT,
  MAPSTYLES,
  REMOVE_ORIGIN_MODE,
  REMOVE_POI_MODE
} from '../../config';
import {useNavigate, useParams} from 'react-router-dom';
import NominatimSearchBox from '@geomatico/geocomponents/NominatimSearchBox';
import {useTranslation} from 'react-i18next';

const MainContent = ({mapStyle, mode}) => {

  const {t, i18n} = useTranslation();

  const mapRef = useRef();
  const flyTo = bbox => mapRef.current?.fitBounds(bbox, {duration: 1000});
  const handleSearchResult = ({bbox}) => flyTo(bbox);

  const {points: strPoints, originPoints: strOriginPoints} = useParams();


  const points = strPoints ? JSON.parse(strPoints) : [];
  const originPoints = strOriginPoints ? JSON.parse(strOriginPoints) : [];

  const navigate = useNavigate();

  const setPoints = points => {
    let strPoints = JSON.stringify(points);
    navigate(`../map/${strPoints}/${strOriginPoints || '[]'}`);
  };

  const setOriginPoints = originPoints => {
    let strOriginPoints = JSON.stringify(originPoints);
    navigate(`../map/${strPoints || '[]'}/${strOriginPoints}`);
  };

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  const COLOR = MAPSTYLES.find(ms => ms.id === mapStyle)?.overlayColor;

  const sources = useMemo(() => {

    /*    const empty = {
          type: 'FeatureCollection',
          features: []
        };*/

    const centers = {
      type: 'FeatureCollection',
      features: points.map((p, i) => ({
        type: 'Feature',
        id: i,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: p
        }
      }))
    };

    const centersOrigin = {
      type: 'FeatureCollection',
      features: originPoints.map((p, i) => ({
        type: 'Feature',
        id: i,
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: p
        }
      }))
    };

    /*
        const prueba = {
          "type": "FeatureCollection",
          "features": [
            {
              "bbox": [
                2.137308,
                41.386913,
                2.147915,
                41.396376
              ],
              "type": "Feature",
              "properties": {
                "segments": [
                  {
                    "distance": 1930.1,
                    "duration": 222.3,
                    "steps": [
                      {
                        "distance": 519,
                        "duration": 48.1,
                        "type": 11,
                        "instruction": "Head northwest on Carrer d'Entença",
                        "name": "Carrer d'Entença",
                        "way_points": [
                          0,
                          17
                        ]
                      },
                      {
                        "distance": 609.8,
                        "duration": 54.9,
                        "type": 3,
                        "instruction": "Turn sharp right onto Avinguda Diagonal (lateral mar)",
                        "name": "Avinguda Diagonal (lateral mar)",
                        "way_points": [
                          17,
                          28
                        ]
                      },
                      {
                        "distance": 370.1,
                        "duration": 69,
                        "type": 7,
                        "instruction": "Enter the roundabout and take the 4th exit onto Avinguda Diagonal",
                        "name": "Avinguda Diagonal",
                        "exit_number": 4,
                        "way_points": [
                          28,
                          52
                        ]
                      },
                      {
                        "distance": 125.7,
                        "duration": 16.9,
                        "type": 2,
                        "instruction": "Turn sharp left onto Carrer de Casanova",
                        "name": "Carrer de Casanova",
                        "way_points": [
                          52,
                          57
                        ]
                      },
                      {
                        "distance": 28.7,
                        "duration": 6.9,
                        "type": 1,
                        "instruction": "Turn right onto Travessera de Gràcia",
                        "name": "Travessera de Gràcia",
                        "way_points": [
                          57,
                          58
                        ]
                      },
                      {
                        "distance": 276.7,
                        "duration": 26.5,
                        "type": 0,
                        "instruction": "Turn left onto Carrer de Santaló",
                        "name": "Carrer de Santaló",
                        "way_points": [
                          58,
                          71
                        ]
                      },
                      {
                        "distance": 0,
                        "duration": 0,
                        "type": 10,
                        "instruction": "Arrive at Carrer de Santaló, on the right",
                        "name": "-",
                        "way_points": [
                          71,
                          71
                        ]
                      }
                    ]
                  }
                ],
                "summary": {
                  "distance": 1930.1,
                  "duration": 222.3
                },
                "way_points": [
                  0,
                  71
                ]
              },
              "geometry": {
                "coordinates": [
                  [
                    2.141105,
                    41.386913
                  ],
                  [
                    2.14104,
                    41.386968
                  ],
                  [
                    2.140963,
                    41.387033
                  ],
                  [
                    2.140917,
                    41.387066
                  ],
                  [
                    2.140857,
                    41.387134
                  ],
                  [
                    2.139796,
                    41.388112
                  ],
                  [
                    2.139689,
                    41.388211
                  ],
                  [
                    2.139587,
                    41.388316
                  ],
                  [
                    2.13899,
                    41.388935
                  ],
                  [
                    2.13889,
                    41.389034
                  ],
                  [
                    2.138815,
                    41.389116
                  ],
                  [
                    2.138458,
                    41.389502
                  ],
                  [
                    2.138424,
                    41.389548
                  ],
                  [
                    2.138212,
                    41.389757
                  ],
                  [
                    2.138143,
                    41.389826
                  ],
                  [
                    2.137621,
                    41.390317
                  ],
                  [
                    2.137377,
                    41.390547
                  ],
                  [
                    2.137308,
                    41.390606
                  ],
                  [
                    2.137542,
                    41.390666
                  ],
                  [
                    2.138204,
                    41.390836
                  ],
                  [
                    2.139429,
                    41.39115
                  ],
                  [
                    2.13984,
                    41.391256
                  ],
                  [
                    2.140661,
                    41.391465
                  ],
                  [
                    2.141136,
                    41.391586
                  ],
                  [
                    2.142464,
                    41.391929
                  ],
                  [
                    2.142787,
                    41.392012
                  ],
                  [
                    2.143804,
                    41.392264
                  ],
                  [
                    2.144061,
                    41.392376
                  ],
                  [
                    2.144151,
                    41.392467
                  ],
                  [
                    2.144193,
                    41.392442
                  ],
                  [
                    2.144326,
                    41.392385
                  ],
                  [
                    2.144483,
                    41.392364
                  ],
                  [
                    2.144577,
                    41.392367
                  ],
                  [
                    2.14469,
                    41.39239
                  ],
                  [
                    2.144748,
                    41.39241
                  ],
                  [
                    2.144804,
                    41.392441
                  ],
                  [
                    2.144854,
                    41.392474
                  ],
                  [
                    2.144897,
                    41.392512
                  ],
                  [
                    2.144933,
                    41.392554
                  ],
                  [
                    2.144951,
                    41.392587
                  ],
                  [
                    2.144979,
                    41.392682
                  ],
                  [
                    2.144986,
                    41.392754
                  ],
                  [
                    2.144961,
                    41.392854
                  ],
                  [
                    2.145107,
                    41.392893
                  ],
                  [
                    2.145147,
                    41.392906
                  ],
                  [
                    2.145639,
                    41.393027
                  ],
                  [
                    2.145752,
                    41.393055
                  ],
                  [
                    2.145929,
                    41.393099
                  ],
                  [
                    2.146077,
                    41.393137
                  ],
                  [
                    2.146267,
                    41.393185
                  ],
                  [
                    2.146393,
                    41.393217
                  ],
                  [
                    2.147717,
                    41.39355
                  ],
                  [
                    2.147915,
                    41.3936
                  ],
                  [
                    2.147804,
                    41.393677
                  ],
                  [
                    2.14778,
                    41.393693
                  ],
                  [
                    2.147696,
                    41.39376
                  ],
                  [
                    2.14697,
                    41.394334
                  ],
                  [
                    2.146869,
                    41.394413
                  ],
                  [
                    2.14714,
                    41.394573
                  ],
                  [
                    2.147072,
                    41.394629
                  ],
                  [
                    2.146151,
                    41.395357
                  ],
                  [
                    2.146098,
                    41.395399
                  ],
                  [
                    2.146042,
                    41.395444
                  ],
                  [
                    2.145626,
                    41.39578
                  ],
                  [
                    2.145616,
                    41.395788
                  ],
                  [
                    2.145576,
                    41.39582
                  ],
                  [
                    2.145553,
                    41.395838
                  ],
                  [
                    2.145509,
                    41.395871
                  ],
                  [
                    2.145057,
                    41.396216
                  ],
                  [
                    2.145006,
                    41.396255
                  ],
                  [
                    2.144952,
                    41.396296
                  ],
                  [
                    2.144855,
                    41.396376
                  ]
                ],
                "type": "LineString"
              }
            }
          ],
          "bbox": [
            2.137308,
            41.386913,
            2.147915,
            41.396376
          ],
          "metadata": {
            "attribution": "openrouteservice.org | OpenStreetMap contributors",
            "service": "routing",
            "timestamp": 1657641281580,
            "query": {
              "coordinates": [
                [
                  2.14119,
                  41.38697
                ],
                [
                  2.14502,
                  41.39649
                ]
              ],
              "profile": "driving-car",
              "format": "geojson"
            },
            "engine": {
              "version": "6.7.0",
              "build_date": "2022-02-18T19:37:41Z",
              "graph_date": "2022-07-03T15:06:23Z"
            }
          }
        };
    */

    return {
      centers: {
        type: 'geojson',
        data: centers
      },
      centersOrigin: {
        type: 'geojson',
        data: centersOrigin
      },
      /*   directions: {
           type: 'geojson',
           data: prueba
         },*/
    };
  }, [points, originPoints]);

  const layers = useMemo(() => {
    return [
      /*      {
              'id': 'directions',
              'type': 'line',
              'source': 'directions',
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#888',
                'line-width': 3
              }
            },*/
      {
        id: 'centers',
        source: 'centers',
        type: 'circle',
        paint: {
          'circle-color': COLOR,
          'circle-radius': 15,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },
      {
        id: 'centersOrigin',
        source: 'centersOrigin',
        type: 'circle',
        paint: {
          'circle-color': 'red',
          'circle-radius': 15,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2
        }
      },

    ];
  }, [mapStyle]);

  const handleClick = e => {

    if (mode === ADD_POI_MODE) {
      setPoints([...points, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_POI_MODE) {
      setPoints(points.filter((p, i) => i !== e.features[0].id));
    } else if (mode === ADD_ORIGIN_MODE) {
      setOriginPoints([...originPoints, [+e.lngLat.lng.toFixed(5), +e.lngLat.lat.toFixed(5)]]);
    } else if (mode === REMOVE_ORIGIN_MODE) {
      setOriginPoints(originPoints.filter((p, i) => i !== e.features[0].id));
    }
  };

  const [cursor, setCursor] = useState('pointer');

  useEffect(() => {
    setCursor(mode === ADD_POI_MODE ? 'pointer' : 'auto');
  }, [mode]);

  const onMouseEnter = useCallback(() => setCursor('no-drop'), []);
  const onMouseLeave = useCallback(() => setCursor('auto'), []);


  // habilita capas segun el modo seleccionado
  const calculateInteractiveLayers = () => {
    if (mode === REMOVE_POI_MODE) {
      return ['centers'];
    } else if (mode === REMOVE_ORIGIN_MODE) {
      return ['centersOrigin'];
    } else {
      return undefined;
    }
  };

  return <>
    <Map
      ref={mapRef}
      mapStyle={mapStyle}
      viewport={viewport}
      sources={sources}
      layers={layers}
      onViewportChange={setViewport}
      interactiveLayerIds={calculateInteractiveLayers()}
      cursor={cursor}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    />
    <div style={{
      position: 'absolute',
      top: 18,
      left: 18,
      width: 250
    }}>
      <NominatimSearchBox
        placeholder={t('search')}
        country='ES'
        lang={i18n.language}
        onResultClick={handleSearchResult}/>
    </div>
  </>;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired
};

export default MainContent;
