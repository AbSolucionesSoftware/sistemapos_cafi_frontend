import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ProductosIcon from '../../../../icons/productos.svg';
import { Box } from '@material-ui/core';
import CrearProducto from './crearProducto';
import ListaProductos from './ListaProductos';
import { RegProductoProvider } from '../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		fontSize: 100
	},
	iconSvg: {
		width: 100
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Productos() {
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
			<Button fullWidth onClick={() => handleClickOpen()}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src={ProductosIcon} alt="icono ropa" className={classes.iconSvg} />
					</Box>
					Productos
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Productos
						</Typography>
						<Button autoFocus color="inherit" size="large" onClick={() => handleClose()} startIcon={<CloseIcon />}>
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				<RegProductoProvider>
					<Box m={3} display="flex" justifyContent="flex-end">
						<CrearProducto accion={true} />
					</Box>
					<Box mx={4}>
						<ListaProductos />
					</Box>
				</RegProductoProvider>
			</Dialog>
		</div>
	);
}
