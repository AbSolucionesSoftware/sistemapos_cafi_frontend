import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = '30%';

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		// backgroundColor: theme.palette.navbar,
		backgroundColor: 'white',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		backgroundColor: 'white',
	},
	drawerColor:{
		height: '50%',
		backgroundColor: 'white',
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: theme.palette.navbar
	},
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%'
	},
	navigationTop:{
		height: theme.spacing(9)
	},
	iconSizeSuperior: {
		fontSize: 30,
        color: theme.palette.info.main
	},
    iconSizeSecondSuperior: {
		width: 20,
	},
	iconSizeInferior: {
		fontSize: 50,
        color: theme.palette.info.main
	},
    iconSizeSecondInferior: {
		width: 40,
	},
	iconSizeSecondInferiorGrande: {
		width: 100
	},
	iconSizeInferiorGrande:{
		fontSize: 110,
        color: theme.palette.info.main
	},

	avatar: {
		width: theme.spacing(4),
		height: theme.spacing(4),
		marginRight: theme.spacing(1)
	},
	borderBoton:{
		minWidth: '100%',
		height: '50%',
        border: '.6px solid #DBDBDB'
    },
	borderBotonChico:{
		minWidth: '100%',
		height: '35%',
        border: '.6px solid #DBDBDB'
    }
}));

export default useStyles;