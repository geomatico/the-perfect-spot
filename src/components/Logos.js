import React from 'react';
import Link from '@mui/material/Link';

import logo_aleo from '../img/logo_aleo.png';
import logo_ccosona from '../img/logo_ccosona.png';
import Logo_geomatico from '../img/Logo_geomatico.png';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Love from '@mui/icons-material/Favorite';

const Logos = () => {
  return <Box sx={{display: 'flex', alignItems: 'flex-end', flexGrow: 2, padding: '8px'}}>
    <Box sx={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap'}}>
      <Link href="https://www.ccosona.cat/serveis/serveis-ccosona/agencia-local-de-l-energia" target="_blank" sx={{display: 'flex', alignItems: 'flex-end'}}>
        <img src={logo_aleo} width={140} alt="Agència Local de l'Energia d'Osona"/>
      </Link>
      <Link href="https://www.ccosona.cat" target="_blank" sx={{display: 'flex'}}>
        <img src={logo_ccosona} width={100} alt="Consell Comarcal d'Osona"/>
      </Link>
      <div sx={{display: 'flex'}}>
        <Typography variant='caption'>Coded with <Love fontSize='inherit'/> by</Typography>
      </div>
      <Link href="https://geomatico.es" target="_blank" sx={{display: 'flex'}}>
        <img src={Logo_geomatico} width={120} alt="geomatico.es"/>
      </Link>
    </Box>
  </Box>;
};

export default Logos;
