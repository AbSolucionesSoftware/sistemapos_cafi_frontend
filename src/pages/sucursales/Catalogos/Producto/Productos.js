import React, { useContext, useState } from 'react';
import ProductosIcon from '../../../../icons/productos.svg';
import { Slide, Typography, Toolbar, AppBar, Dialog, Button, makeStyles } from '@material-ui/core';
import { Box, CircularProgress, FormControl, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';
import CrearProducto from './crearProducto';
import ListaProductos from './ListaProductos';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';
import { useQuery } from '@apollo/client';
import { OBTENER_PRODUCTOS } from '../../../../gql/Catalogos/productos';
import ErrorPage from '../../../../components/ErrorPage';
import { Search, Close, ArrowBack } from '@material-ui/icons';
import ProductosEliminados from './ProductosEliminados';
import SnackBarMessages from '../../../../components/SnackBarMessages';

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
	const { alert, setAlert } = useContext(RegProductoContext);

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
						<img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/productos.svg' alt="icono ropa" className={classes.iconSvg} />
					</Box>
					Productos
				</Box>
			</Button>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Productos
						</Typography>
						<Button
							autoFocus
							color="inherit"
							size="large"
							onClick={() => handleClose()}
							startIcon={<Close />}
						>
							Cerrar
						</Button>
					</Toolbar>
				</AppBar>
				<RegistroComponent />
			</Dialog>
		</div>
	);
}

const RegistroComponent = () => {
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [ filtro, setFiltro ] = useState('');
	const [ busqueda, setBusqueda ] = useState('');

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_PRODUCTOS, {
		variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id, filtro }
	});

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}

	const { obtenerProductos } = data;

	const filtrarProductos = (event) => {
		event.preventDefault();
		if (busqueda === '') {
			setFiltro('');
			refetch({ filtro: '' });
			return;
		}
		setFiltro(busqueda);
	};

	const reload = () => {
		setBusqueda('');
		setFiltro('');
		refetch({ filtro: '' });
	};

	return (
		<div>
			<Box mx={4} my={3} display="flex" justifyContent="space-between">
				<Box style={{ width: '50%' }}>
					<form onSubmit={filtrarProductos} style={{ display: 'flex', alignItems: 'center' }}>
						<FormControl variant="outlined" fullWidth size="small">
							<OutlinedInput
								id="search-producto"
								type="text"
								value={busqueda}
								onChange={(e) => setBusqueda(e.target.value)}
								endAdornment={
									<InputAdornment position="start">
										<IconButton type="submit" aria-label="search producto" edge="end">
											<Search />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
						{filtro !== '' ? (
							<IconButton color="primary" onClick={() => reload()}>
								<ArrowBack />
							</IconButton>
						) : null}
					</form>
				</Box>
				<Box display="flex">
					<ProductosEliminados productosActivosRefetch={refetch} />
					<Box mx={1} />
					<CrearProducto accion={false} productosRefetch={refetch} />
				</Box>
			</Box>
			<Box mx={4}>
				<ListaProductos obtenerProductos={obtenerProductos} productosRefetch={refetch} />
			</Box>
		</div>
	);
};
