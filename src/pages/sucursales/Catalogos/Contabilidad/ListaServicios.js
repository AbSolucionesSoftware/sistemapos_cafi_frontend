import React, { useState, useEffect } from 'react';
import { 
	Box,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Paper,
	makeStyles,
	Dialog,
	DialogTitle,
	DialogActions,
	Button
} from '@material-ui/core';

import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CONTABILIDAD, ELIMINAR_CONTABILIDAD } from '../../../../gql/Catalogos/contabilidad';
import ErrorPage from '../../../../components/ErrorPage';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function TablaServicios({setData, setIdService, idService, setAccion, updateData, setAlert}) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [ openModal, setOpenModal ] = useState(false);
	const handleModal = () => setOpenModal(!openModal);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	let obtenerContabilidad= [];

	const { loading, data, error, refetch } = useQuery(OBTENER_CONTABILIDAD,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});
	const [ EliminarContabilidad ] = useMutation(ELIMINAR_CONTABILIDAD);

	useEffect(
		() => {
			refetch();
		},
		[ updateData, refetch ]
	);

	if(data){
		obtenerContabilidad = data.obtenerContabilidad;
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleDelete = async () => {
		try {
			console.log("Eliminado");
			await EliminarContabilidad({
				variables: {
					id: idService
				}
			});
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			handleModal();
			setIdService("");
		} catch (error) {
			setAlert({ message: error.message, status: 'error', open: true });
		}
	};

	if (error) {
		return <ErrorPage error={error} />;
	}

	if (loading){
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	}
		

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell>Servicios</TableCell>
								{sesion.accesos.catalogos.contabilidad.editar === false ? (null):(
									<TableCell padding="default">Editar</TableCell>
								)}
								{sesion.accesos.catalogos.contabilidad.eliminar === false ? (null):(
									<TableCell padding="default">Eliminar</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{obtenerContabilidad?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
										<TableCell>{row.nombre_servicio}</TableCell>
										{sesion.accesos.catalogos.contabilidad.editar === false ? (null):(
											<TableCell padding="checkbox">
												<IconButton onClick={() => {
													console.log("editar");
													console.log(row);
													setAccion(false)
													setIdService(row._id)
													setData({
														nombre_servicio: row.nombre_servicio
													});
												}}>
													<Edit />
												</IconButton>
											</TableCell>
										)}
										{sesion.accesos.catalogos.contabilidad.eliminar === false ? (null):(
											<TableCell padding="checkbox">
												<IconButton onClick={() => {
													setIdService(row._id);
													handleModal();
												}}>
													<Delete />
												</IconButton>
											</TableCell>
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={obtenerContabilidad.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<Modal handleModal={handleModal} openModal={openModal} handleDelete={handleDelete} />
		</div>
	);
}

const Modal = ({ handleModal, openModal, handleDelete }) => {
	return (
		<div>
			<Dialog open={openModal} onClose={handleModal}>
				<DialogTitle>{'¿Seguro que quieres eliminar esto?'}</DialogTitle>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button color="secondary" autoFocus variant="contained" onClick={handleDelete}>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
