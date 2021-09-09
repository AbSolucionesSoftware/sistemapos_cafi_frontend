import React, { useState, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ToggleOff, Publish } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, IconButton, CircularProgress, Typography } from '@material-ui/core';
import { Fragment } from 'react';
import ErrorPage from '../../../../components/ErrorPage';
import { ACTIVAR_PRODUCTOS, PRODUCTOS_ELIMINADOS } from '../../../../gql/Catalogos/productos';
import { useMutation, useQuery } from '@apollo/client';
import SnackBarMessages from '../../../../components/SnackBarMessages';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProdcutosEliminados({productosActivosRefetch}) {
	const [ open, setOpen ] = useState(false);

	const handleModalToggle = () => setOpen(!open);

	return (
		<div>
			<Button disableElevation color="inherit" onClick={handleModalToggle} size="large" startIcon={<ToggleOff />}>
				Productos inactivos
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleModalToggle}
				aria-labelledby="dialog-productos-eliminados"
				maxWidth="md"
				fullWidth
			>
				<DialogTitle id="dialog-productos-eliminados">{'Productos inactivos'}</DialogTitle>
				<DialogContent>
					<TablaProductosEliminados productosActivosRefetch={productosActivosRefetch} />
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={handleModalToggle} color="primary" size="large">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const TablaProductosEliminados = ({productosActivosRefetch}) => {
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	/* Queries */
	const { loading, data, error, refetch } = useQuery(PRODUCTOS_ELIMINADOS, {
		variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id }
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

	if (!loading && !error && !data) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<Typography variant="h6">No hay productos inactivos</Typography>
			</Box>
		);
	}

	const { obtenerProductosInactivos } = data;

	return (
		<Box height="60vh">
			<TableContainer>
				<Table aria-label="simple table" size="small">
					<TableHead>
						<TableRow>
							<TableCell align="left">Código de barras</TableCell>
							<TableCell align="left">Clave alterna</TableCell>
							<TableCell>Nombre comercial</TableCell>
							<TableCell align="right">Reactivar</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerProductosInactivos.map((producto, index) => (
							<RenderProductosTabla key={index} producto={producto} refetch={refetch} productosActivosRefetch={productosActivosRefetch} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

const RenderProductosTabla = ({ producto, refetch, productosActivosRefetch }) => {
	const [ open, setOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const { datos_generales } = producto;
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

    const [ activarProducto ] = useMutation(ACTIVAR_PRODUCTOS);

	const handleDeleteToggle = () => setOpen(!open);

	const reactivarProducto = async () => {
		setLoading(true);
		try {
			await activarProducto({
				variables: {
					id: producto._id
				}
			});
            refetch();
			productosActivosRefetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
			handleDeleteToggle();
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

	return (
		<Fragment>
			<TableRow>
				<TableCell align="left">{datos_generales.codigo_barras}</TableCell>
				<TableCell align="left">{datos_generales.clave_alterna}</TableCell>
				<TableCell>{datos_generales.nombre_comercial}</TableCell>
				<TableCell align="right">
					{loading ? (
						<IconButton color="primary" disabled onClick={handleDeleteToggle}>
							<CircularProgress size={26} />
						</IconButton>
					) : (
						<IconButton color="primary" onClick={handleDeleteToggle}>
							<Publish />
						</IconButton>
					)}
				</TableCell>
			</TableRow>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
			<Dialog open={open} onClose={handleDeleteToggle} aria-labelledby="reactivar-producto-dialog">
				<DialogTitle id="reactivar-producto-dialog">{'Se reactivará este producto'}</DialogTitle>

				<DialogActions>
					<Button onClick={handleDeleteToggle} color="inherit">
						Cancelar
					</Button>
					<Button onClick={() => reactivarProducto()} color="primary" autoFocus>
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
