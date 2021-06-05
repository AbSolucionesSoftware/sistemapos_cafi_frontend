import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 130;

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: theme.palette.navbar
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
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
	navigationTop: {
		height: theme.spacing(11)
	},
	iconSize: {
		fontSize: 40,
        color: theme.palette.info.main
	},
    iconSizeSecond: {
		width: 40,
	},
	avatar: {
		width: theme.spacing(4),
		height: theme.spacing(4),
		marginRight: theme.spacing(1)
	}
}));

export default useStyles