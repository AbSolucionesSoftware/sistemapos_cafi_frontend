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
import proveedoresIcon from '../../../../icons/distribution.svg';
import TablaProovedores from './ListaProveedores';
import CrearCliente from '../Cliente/CrearCliente';
import { ClienteProvider } from '../../../../context/Catalogos/crearClienteCtx';

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

export default function Proveedores() {
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
			<ClienteProvider>
				<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src={proveedoresIcon} alt="icono numero calzado" className={classes.icon} />
					</Box>
					Proveedores
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Proveedores
						</Typography>
						<Button autoFocus color="inherit" size="large" onClick={handleClose} startIcon={<CloseIcon />}>
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				<Container maxWidth="xl">
					<Box display="flex" justifyContent="flex-end" my={2}>
						<CrearCliente tipo="proveedor" />
					</Box>
					<TablaProovedores />
				</Container>
			</Dialog>
			</ClienteProvider>
			
		</div>
	);
}
