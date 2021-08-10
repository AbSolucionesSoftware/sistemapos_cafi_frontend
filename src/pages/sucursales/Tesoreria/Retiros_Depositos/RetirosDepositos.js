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
import { Box, DialogActions, Paper } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import FormRetiroDeposito from  './FormRetiroDeposito'
import retiroIcon from '../../../../icons/retiro-de-dinero.svg';

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
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	buttons: {
		'& > *': {
			margin: `0px ${theme.spacing(1)}px`
		}
	}

}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RetirosDepositos() {
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
					Retiros y Depositos
				</Box>
			</Button>
			<Dialog open={open} TransitionComponent={Transition} maxWidth="xs">
				<Box m={1} display="flex" justifyContent="flex-end">
					<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
						<CloseIcon />
					</Button>
				</Box>
				<Paper elevation={3} >
					<Box p={2}>
						<Typography variant="h6" className={classes.title}>
                        	Nuevo Retiro o Deposito
						</Typography>
					</Box>
					<FormRetiroDeposito />
					<DialogActions>
						<Box className={classes.buttons}>
							<Button
								variant="contained"	
								color="primary"
								onClick={handleClickOpen}
								size="large"
								startIcon={<DoneIcon />}
								disableElevation
							>
								Guardar
							</Button>
						</Box>
					</DialogActions>
				</Paper>
			</Dialog>
		</div>
	);
}
