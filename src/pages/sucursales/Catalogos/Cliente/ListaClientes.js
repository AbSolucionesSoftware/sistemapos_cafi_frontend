import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CrearCliente from './CrearCliente';
import ErrorPage from '../../../../components/ErrorPage';
import { Box, Button, CircularProgress, Dialog, DialogActions, Divider, Grid } from '@material-ui/core';
import { DialogContent, DialogTitle, IconButton, Typography, Avatar, Switch } from '@material-ui/core';
import { Dehaze, Delete } from '@material-ui/icons';
import { ClienteCtx } from '../../../../context/Catalogos/crearClienteCtx';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CLIENTES, ACTUALIZAR_CLIENTE } from '../../../../gql/Catalogos/clientes';

// const columns = [
// 	{ id: 1, label: 'No. Cliente', minWidth: 100 },
// 	{ id: 2, label: 'Clave', minWidth: 100 },
// 	{ id: 3, label: 'Nombre', minWidth: 150 },
// 	{ id: 4, label: 'Razon Social', minWidth: 150 },
// 	{ id: 5, label: 'Correo', minWidth: 150 },
// 	{ id: 6, label: 'Tipo de Cliente', minWidth: 100 },
// 	{ id: 7, label: 'Estado', minWidth: 100 },
// 	{ id: 8, label: 'Detalles', minWidth: 50, align: 'right' },
// 	{ id: 9, label: 'Editar', minWidth: 50, align: 'right' },
// 	{ id: 10, label: 'Eliminar', minWidth: 50, align: 'right' }
// ];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '70vh'
	},
	avatar: {
		width: 130,
		height: 130
	}
});


export default function ListaClientes({user, tipo, filtro }) {

	const classes = useStyles();
	const { update } = useContext(ClienteCtx);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const [value] = useDebounce(filtro, 1000);
	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES, {
		variables: { tipo, filtro: value }
	});

	useEffect(
		() => {
			refetch();
		},
		[ update, refetch ]
	);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="50vh" width='120vh'>
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}

	const { obtenerClientes } = data;

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							<TableCell minwidth='100'>
								No. Cliente
							</TableCell>
							<TableCell minwidth='100'>
								Clave
							</TableCell>
							<TableCell minwidth='150'>
								Nombre
							</TableCell>
							<TableCell minwidth='150'>
								Razon Social
							</TableCell>
							<TableCell minwidth='150'>
								Correo
							</TableCell>
							<TableCell minwidth='100'>
								Tipo de Cliente
							</TableCell>
							{user === 'EMPLEADO' ? (null) :(
								<TableCell minwidth='100'>
									Estado
								</TableCell>
							)}
							<TableCell minwidth='50'>
								Detalles
							</TableCell>
							<TableCell minwidth='50'>
								Editar
							</TableCell>
							{user === 'EMPLEADO' ? (null) :(
								<TableCell minwidth='50'>
									Eliminar	
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerClientes
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => {
								return <RowsRender user={user} key={index} datos={row} />;
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={obtenerClientes.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const RowsRender = ({ datos, user }) => {
	const permisosUsuario = JSON.parse(localStorage.getItem('sesionCafi'));

	const [ openDetalles, setOpenDetalles ] = useState(false);
	const { update, setUpdate } = useContext(ClienteCtx);
	const [ loading, setLoading ] = useState(false);

	const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE);

	const handleDetalles = () => setOpenDetalles(!openDetalles);

	const cambiarEstado = async (e) => {
		setLoading(true);

		try {
			await actualizarCliente({
				variables: {
					input: {
						estado_cliente: e.target.checked
					},
					id: datos._id
				}
			});
			setUpdate(!update);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	return (
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>
				<Typography>{datos.numero_cliente}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.clave_cliente}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.nombre_cliente}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.razon_social}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.email}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.tipo_cliente}</Typography>
			</TableCell>
			{user === 'EMPLEADO' ? (null) :(
				<TableCell>
					{loading ? (
						<CircularProgress size={30} />
					) : (
						<Switch
							checked={datos.estado_cliente}
							onChange={cambiarEstado}
							color="primary"
						/>
					)}
				</TableCell>
			)}
			<TableCell width={50}>
				<ModalDetalles openDetalles={openDetalles} handleDetalles={handleDetalles} datos={datos} />
			</TableCell>
			<TableCell width={50}>
				{permisosUsuario.accesos.catalogos.clientes.editar === false ? (null):(
					<CrearCliente tipo="CLIENTE" accion="actualizar" datos={datos} />
				)
				}
			</TableCell>
			<TableCell width={50}>
				{permisosUsuario.accesos.catalogos.clientes.editar === false ? (null):(
					<IconButton color="secondary">
						<Delete />
					</IconButton>
				)}
			</TableCell>
		</TableRow>
	);
};

const ModalDetalles = ({ handleDetalles, openDetalles, datos }) => {


	const classes = useStyles();
	return (
		<div>
			<IconButton onClick={handleDetalles}>
				<Dehaze />
			</IconButton>
			<Dialog open={openDetalles} onClose={handleDetalles} fullwidth maxWidth="md">
				<DialogTitle>{'Información completa del cliente'}</DialogTitle>
				<DialogContent>
					<Box mt={3}>
						<Typography variant="h6">Información básica</Typography>
						<Divider />
					</Box>
					<Box display="flex">
						<Box mt={3} height={120} width={120} display="flex" justifyContent="center" alignItems="center">
							<Avatar className={classes.avatar} src={datos.imagen} />
						</Box>
						<ul>
							<Typography>
								<b>Número de cliente: </b>
								{datos.numero_cliente}
							</Typography>
							<Typography>
								<b>Clave: </b>
								{datos.clave_cliente}
							</Typography>
							<Typography>
								<b>Representante: </b>
								{datos.representante}
							</Typography>
							<Typography>
								<b>Nombre cliente/empresa: </b>
								{datos.nombre_cliente}
							</Typography>
							<Typography>
								<b>Razon social: </b>
								{datos.razon_social}
							</Typography>
							<Typography>
								<b>RFC: </b>
								{datos.rfc ? datos.rfc : ' -'}
							</Typography>
						</ul>
						<ul>
							<Typography>
								<b>CURP: </b>
								{datos.curp ? datos.curp : ' -'}
							</Typography>
							<Typography>
								<b>Telefono: </b>
								{datos.telefono ? datos.telefono : ' -'}
							</Typography>
							<Typography>
								<b>Celular: </b>
								{datos.celular ? datos.celular : ' -'}
							</Typography>
							<Typography>
								<b>Correo: </b>
								{datos.email ? datos.email : ' -'}
							</Typography>
							<Typography>
								<b>Estado del cliente: </b>
								{datos.estado_cliente ? 'Activo' : 'Inactivo'}
							</Typography>
							<Typography>
								<b>Tipo: </b>
								{datos.tipo_cliente}
							</Typography>
						</ul>
					</Box>
					<Grid container spacing={2}>
						<Grid item md={6}>
							<Box mt={3}>
								<Typography>
									<b>Dirección</b>
								</Typography>
								<Divider />
							</Box>
							<Box display="flex">
								<ul>
									<Typography>
										<b>Calle: </b>
										{datos.direccion.calle}
									</Typography>
									<Typography>
										<b>No. Exterior: </b>
										{datos.direccion.no_ext}
									</Typography>
									<Typography>
										<b>No. Interior: </b>
										{datos.direccion.no_int ? datos.direccion.no_int : ' -'}
									</Typography>
									<Typography>
										<b>Código postal: </b>
										{datos.direccion.codigo_postal}
									</Typography>
									<Typography>
										<b>Colonia: </b>
										{datos.direccion.colonia}
									</Typography>
								</ul>
								<ul>
									<Typography>
										<b>Municipio: </b>
										{datos.direccion.municipio}
									</Typography>
									<Typography>
										<b>Localidad: </b>
										{datos.direccion.localidad ? datos.direccion.localidad : ' -'}
									</Typography>
									<Typography>
										<b>Estado: </b>
										{datos.direccion.estado}
									</Typography>
									<Typography>
										<b>Pais: </b>
										{datos.direccion.pais}
									</Typography>
								</ul>
							</Box>
						</Grid>
						<Grid item md={6}>
							<Box mt={3}>
								<Typography>
									<b>Información crediticia</b>
								</Typography>
								<Divider />
							</Box>
							<Box display="flex">
								<ul>
									<Typography>
										<b>Descuento: </b>
										{datos.numero_credito ? datos.numero_credito : ' -'}
									</Typography>
									<Typography>
										<b>Limite de crédito: </b>
										{datos.limite_credito ? datos.limite_credito : ' -'}
									</Typography>
									<Typography>
										<b>Días de crédito: </b>
										{datos.dias_credito ? datos.dias_credito : ' -'}
									</Typography>
								</ul>
							</Box>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDetalles} color="primary" variant="contained" size="large">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
