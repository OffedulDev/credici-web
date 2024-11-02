import { createTheme, Theme } from '@mui/material/styles';

const theme: Theme = createTheme({
    colorSchemes: {
        dark: true,
        light: true
    },
    palette: {
        mode: 'dark',
    }
})

export default theme