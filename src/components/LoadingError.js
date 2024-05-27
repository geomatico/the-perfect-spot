import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import  Alert  from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import Typography  from '@mui/material/Typography';
function LoadingError() {
  const [progress, setProgress] = useState(0);
  const [count,setCount] = useState(70);

  const {t} = useTranslation();   
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + 1.42,100);
      });
      setCount(prevState => prevState-1);
      
    }, 1000);
  
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(()=>{
    if (count===0) {
      window.location.reload();
    }
  },[count]);

 
  return (
    <Box sx={{ width: '100%' }}>
      <Alert variant="outlined" severity="warning">
        <Typography marginBottom={2}>{`${t('requestLimit')} ${count} ${t('seconds')}`}</Typography>
        <LinearProgress  sx={{'.MuiLinearProgress-bar1Determinate':{backgroundColor :  theme => theme.palette.grey[500]},'&.MuiLinearProgress-determinate' :{backgroundColor: theme => theme.palette.grey[200]}}} variant='determinate' value={progress}  />
      </Alert>
    </Box>
  );
}

export default LoadingError;
