import React, { useEffect, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, TextField, Typography } from '@material-ui/core';
import { Close, Delete, Edit } from '@material-ui/icons';

import { useMutation } from '@apollo/client';
import { ELIMINAR_TALLA } from '../../../../gql/Catalogos/tallas';
import SnackBarMessages from '../../../../components/SnackBarMessages';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function TablaTallas({ tipo, datos, toUpdate, setToUpdate, setValue, refetch }) {
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(7);
	const [ busqueda, setBusqueda ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ alert, setAlert ] = useState({
		status: '',
		message: '',
		open: false
	});

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(
		() => {
			setProductosFiltrados(
				datos.filter((datos) => {
					return datos.talla.toLowerCase().includes(busqueda.toLowerCase());
				})
			);
		},
		[ busqueda, datos ]
	);

	return (
		<div className={classes.root}>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Paper className={classes.paper}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<TextField
						fullWidth
						placeholder="Buscar..."
						variant="outlined"
						onChange={(e) => setBusqueda(e.target.value)}
					/>
				</Box>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell>{tipo === 'ROPA' ? 'Talla' : 'Número'}</TableCell>
								{sesion.accesos.catalogos.tallas_numeros.editar === false ? (null) : (
									<TableCell padding="default">Editar</TableCell>
								)}
								{sesion.accesos.catalogos.tallas_numeros.eliminar === false ? (null) : (
									<TableCell padding="default">Eliminar</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{productosFiltrados
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<RowsRender key={index} row={row} setAlert={setAlert} tipo={tipo} toUpdate={toUpdate} setToUpdate={setToUpdate} setValue={setValue} refetch={refetch} />
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={datos.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

const RowsRender = ({ row, setAlert, tipo, toUpdate, setToUpdate, setValue, refetch }) => {
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const [ openModal, setOpenModal ] = useState(false);
	const handleModal = () => setOpenModal(!openModal);
	const [ eliminarTalla ] = useMutation(ELIMINAR_TALLA);

 
	const handleDelete = async () => {
		try {
			const resp = await eliminarTalla({
				variables: {
					id: row._id,
					input:{
						tipo:tipo,
						talla:''
					}
				}
			});
		
			let msgAlert = { message: resp.data.eliminarTalla.message, status: 'success', open: true }
			setAlert(msgAlert);
			refetch();
			handleModal();
		} catch (error) {
				handleModal();
			setAlert({ message: error.message, status: 'error', open: true });
		}
	};

	const onUpdate = (dato) => {
		if(!dato){
			setToUpdate('');
			setValue('');
			return
		}
		setToUpdate(dato._id);
		setValue(dato.talla);
	};

	return (
		<Fragment>
			<TableRow hover role="checkbox" tabIndex={-1} selected={toUpdate === row._id ? true : false}>
				<TableCell>
					<Typography>
						<b>{row.talla}</b>
					</Typography>
				</TableCell>
				{sesion.accesos.catalogos.tallas_numeros.editar === false ? (null) : (
					<TableCell padding="checkbox">
						{toUpdate === row._id ? (
							<IconButton onClick={() => onUpdate()}>
								<Close />
							</IconButton>
						) : (
							<IconButton onClick={() => onUpdate(row)}>
								<Edit />
							</IconButton>
						)}
					</TableCell>
				)}
				{sesion.accesos.catalogos.tallas_numeros.eliminar === false ? (null) : (
					<TableCell padding="checkbox">
						<Modal handleModal={handleModal} openModal={openModal} handleDelete={handleDelete} />
					</TableCell>
				)}
			</TableRow>
		</Fragment>
	);
};

const Modal = ({ handleModal, openModal, handleDelete }) => {
	return (
		<div>
			<IconButton color="secondary" onClick={handleModal}>
				<Delete />
			</IconButton>
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
