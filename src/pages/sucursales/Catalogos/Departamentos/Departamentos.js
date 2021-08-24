import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Container } from '@material-ui/core';
import departamentosIcon from '../../../../icons/departamentos.svg';
import RegistroDepartamentos from './RegistroDepartamento';
import { DepartamentosProvider } from '../../../../context/Catalogos/Departamentos';

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

export default function Departamentos() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<DepartamentosProvider>
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<img src={departamentosIcon} alt="icono numero calzado" className={classes.icon} />
						</Box>
						Departamentos
					</Box>
				</Button>
				<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								Departamentos
							</Typography>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClose} size="large">
									<CloseIcon style={{fontSize: 30}} />
								</Button>
							</Box>
						</Toolbar>
					</AppBar>
					<Box mt={3}>
						<Container maxWidth="sm">
							<RegistroDepartamentos accion="registrar" />
						</Container>
					</Box>
				</Dialog>
			</DepartamentosProvider>
		</div>
	);
}
