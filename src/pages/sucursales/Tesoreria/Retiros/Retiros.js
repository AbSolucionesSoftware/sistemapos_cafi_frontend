import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box } from '@material-ui/core';
import retiroIcon from '../../../../icons/retiro-de-dinero.svg'

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		width: 100
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Retiros() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={retiroIcon} alt="icono retiro" className={classes.icon} />
					</Box>
					Retiros
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Retiros
						</Typography>
						<Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClickOpen}>
                                save
                            </Button>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				Toda la info de Retiros
			</Dialog>
		</div>
	);
}