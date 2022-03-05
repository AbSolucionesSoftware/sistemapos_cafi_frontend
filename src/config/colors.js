import { blue, grey } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
	palette: {
		navbar: grey[50],
		primary: {
			main: blue[500]
		},
		secondary: {
			main: '#f50057'
		},
	}
});

export default theme;
