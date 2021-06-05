import { blue, grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
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
