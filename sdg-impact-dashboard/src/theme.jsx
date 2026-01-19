import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            'Geist Sans',
            'sans-serif'
        ].join(','),
    },
    components: {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'Geist Sans';
        src: url('/fonts/GeistSans.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
    `,
  },
},
    palette: {
    primary: {
      main: '#0070f3', 
      light: '#3291ff',
      dark: '#0d2280',
      contrastText: '#fff', 
      grey: '#9c9c9c',
    },
    secondary: {
      main: '#ff0080',
    },
    background: {
      default: '#fafafa', 
      paper: '#ffffff',  
    },
    status: {
      error: '#ff1a1a',
      warning: '#ffb700',
      success: '#05ff2f',
    },
    }
});

export default theme;