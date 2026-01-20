import { createTheme } from "@mui/material";

export const sdgPalette = {
  g1: '#E5243B', g2: '#DDA63A', g3: '#4C9F38', g4: '#C5192D',
  g5: '#FF3A21', g6: '#26BDE2', g7: '#FCC30B', g8: '#A21942',
  g9: '#FD6925', g10: '#DD1367', g11: '#FD9D24', g12: '#BF8B2E',
  g13: '#3F7E44', g14: '#0A97D9', g15: '#56C02B', g16: '#00689D',
  g17: '#19486A',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#015792'
    },
    background: {
      default: '#F1F1F1',
    },
    sdg: sdgPalette,
  },
   typography: {
    fontFamily: '"Public Sans", sans-serif',
  },
  status: {
    goalAchieved: '#4C9F38',
    challengeOngoing: '#FCC30B',
    yetToStart: '#E5243B',   
  }
});

export default theme;