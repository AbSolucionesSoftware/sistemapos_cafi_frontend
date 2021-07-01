import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Box, Button, CircularProgress, Dialog, DialogActions, Divider, Grid } from '@material-ui/core';
import { DialogContent, DialogTitle, IconButton, Typography, Avatar, Switch } from '@material-ui/core';
import CrearUsario from './CrearUsuario';
import ErrorPage from '../../../../components/ErrorPage';
import { Dehaze, Delete } from '@material-ui/icons';
import { UsuarioContext } from '../../../../context/Catalogos/usuarioContext';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_USUARIOS, ACTUALIZAR_USUARIO } from '../../../../gql/Catalogos/usuarios';

const columns = [
	{ id: 1, label: 'No. Usuario', minWidth: 100 },
	{ id: 3, label: 'Nombre', minWidth: 150 },
	{ id: 5, label: 'Correo', minWidth: 150 },
	{ id: 7, label: 'Estado', minWidth: 100 },
	{ id: 8, label: 'Detalles', minWidth: 50, align: 'right' },
	{ id: 9, label: 'Editar', minWidth: 50, align: 'right' },
	{ id: 10, label: 'Eliminar', minWidth: 50, align: 'right' }
];

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

export default function ListaUsuarios({ sucursal, filtro }) {
	const classes = useStyles();
	const { update } = useContext(UsuarioContext);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_USUARIOS, {
		variables: { sucursal, filtro }
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
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}

	const { obtenerUsuarios } = data;

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerUsuarios
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => {
								return <RowsRender key={index} datos={row} />;
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={obtenerUsuarios.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const RowsRender = ({ datos }) => {
	const [ openDetalles, setOpenDetalles ] = useState(false);
	const { update, setUpdate } = useContext(UsuarioContext);
	const [ loading, setLoading ] = useState(false);

	const handleDetalles = () => setOpenDetalles(!openDetalles);

	const [ actualizarUsuario ] = useMutation(ACTUALIZAR_USUARIO);

	const cambiarEstado = async (e) => {
		setLoading(true);

		try {
			await actualizarUsuario({
				variables: {
					input: {
						estado_usuario: e.target.checked
					},
					id: datos._id
				}
			});
			setUpdate(!update);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>
				<Typography>{datos.numero_usuario}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.nombre}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.email}</Typography>
			</TableCell>
			<TableCell>
				{loading ? (
					<CircularProgress size={30} />
				) : (
					<Switch
						checked={datos.estado_usuario}
						onChange={cambiarEstado}
						color="primary"
					/>
				)}
			</TableCell>
			<TableCell width={50}>
				<ModalDetalles openDetalles={openDetalles} handleDetalles={handleDetalles} datos={datos} />
			</TableCell>
			<TableCell width={50}>
				<CrearUsario accion="actualizar" datos={datos} />
			</TableCell>
			<TableCell width={50}>
				<IconButton color="secondary">
					<Delete />
				</IconButton>
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
			<Dialog open={openDetalles} onClose={handleDetalles} fullWidth maxWidth="md">
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
								<b>Número de usuario: </b>
								{datos.numero_usuario}
							</Typography>
							<Typography>
								<b>Nombre: </b>
								{datos.nombre}
							</Typography>
							<Typography>
								<b>Correo: </b>
								{datos.email ? datos.email : ' -'}
							</Typography>
						</ul>
						<ul>
							<Typography>
								<b>Telefono: </b>
								{datos.telefono ? datos.telefono : ' -'}
							</Typography>
							<Typography>
								<b>Celular: </b>
								{datos.celular ? datos.celular : ' -'}
							</Typography>
							<Typography>
								<b>Estado del usuario: </b>
								{datos.estado_usuario ? 'Activo' : 'Inactivo'}
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
										{datos.direccion.calle ? datos.direccion.calle : ' -'}
									</Typography>
									<Typography>
										<b>No. Exterior: </b>
										{datos.direccion.no_ext ? datos.direccion.no_ext : ' -'}
									</Typography>
									<Typography>
										<b>No. Interior: </b>
										{datos.direccion.no_int ? datos.direccion.no_int : ' -'}
									</Typography>
									<Typography>
										<b>Código postal: </b>
										{datos.direccion.codigo_postal ? datos.direccion.codigo_postal : ' -'}
									</Typography>
									<Typography>
										<b>Colonia: </b>
										{datos.direccion.colonia ? datos.direccion.colonia : ' -'}
									</Typography>
								</ul>
								<ul>
									<Typography>
										<b>Municipio: </b>
										{datos.direccion.municipio ? datos.direccion.municipio : ' -'}
									</Typography>
									<Typography>
										<b>Localidad: </b>
										{datos.direccion.localidad ? datos.direccion.localidad : ' -'}
									</Typography>
									<Typography>
										<b>Estado: </b>
										{datos.direccion.estado ? datos.direccion.estado : ' -'}
									</Typography>
									<Typography>
										<b>Pais: </b>
										{datos.direccion.pais ? datos.direccion.pais : ' -'}
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
