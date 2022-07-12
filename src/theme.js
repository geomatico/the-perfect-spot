import createTheme from '@mui/material/styles/createTheme';
import {lighten} from '@mui/material';

const primaryColor = '#973572';

const theme = mode => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: primaryColor,
      contrastText: '#fff',
    },
    secondary: {
      main: '#73cad3',
    },
    text: {
      primary: '#000000',
      secondary: '#746F81',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        /* Firefox Scrollbar */
        'body': {
          scrollbarColor: `${lighten(primaryColor, 0.5)} transparent`, /* scroll thumb and track */
          scrollbarWidth: '2px'
        },
        /* Chrome Scrollbar */
        '*::-webkit-scrollbar': {
          width: '0.2em'
        },
        '*::-webkit-scrollbar-track': {
          WebkitBoxShadow: 'inset 0 0 2px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: lighten(primaryColor, 0.5),
          opacity: 0.2,
          outline: '0px solid slategrey'
        }
      }
    }
  }
});

export default theme;
