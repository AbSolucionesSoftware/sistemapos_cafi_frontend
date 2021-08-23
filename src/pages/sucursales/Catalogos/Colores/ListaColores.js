import React, { useEffect, useState } from 'react';
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
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useMutation } from '@apollo/client';
import { ELIMINAR_COLOR, OBTENER_COLORES } from '../../../../gql/Catalogos/colores';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	color: {
		display: 'flex',
		alignItems: 'center'
	}
}));

export default function TablaColores({ datos, toUpdate, setToUpdate, setValues, refetch }) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(8);
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
					return datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
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
								<TableCell width={150}>Color</TableCell>
								<TableCell>Nombre</TableCell>
								<TableCell padding="default">Editar</TableCell>
								<TableCell padding="default">Eliminar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{productosFiltrados
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									return (
										<RowsRender
											key={index}
											row={row}
											setAlert={setAlert}
											toUpdate={toUpdate}
											setToUpdate={setToUpdate}
											setValues={setValues}
											refetch={refetch}
										/>
									);
								})}
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

const RowsRender = ({ row, setAlert, toUpdate, setToUpdate, setValues, refetch }) => {
	const classes = useStyles();
	const [ openModal, setOpenModal ] = useState(false);

	const handleModal = () => setOpenModal(!openModal);

	const [ eliminarColor ] = useMutation(ELIMINAR_COLOR, {
		update(cache, { data: { eliminarColor } }) {
			try {
				const { obtenerColores } = cache.readQuery({
					query: OBTENER_COLORES,
					variables: { empresa: row.empresa._id }
				});

				cache.writeQuery({
					query: OBTENER_COLORES,
					variables: { empresa: row.empresa._id },
					data: {
						obtenerColores: {
							...obtenerColores,
							eliminarColor
						}
					}
				});
			} catch (error) {
				console.log(error);
			}
		}
	});

	const handleDelete = async () => {
		try {
			await eliminarColor({
				variables: {
					id: row._id
				}
			});
			refetch(refetch);
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			handleModal();
		} catch (error) {
			setAlert({ message: error.message, status: 'error', open: true });
		}
	};

	const onUpdate = (row) => {
		if (!row) {
			setToUpdate('');
			setValues({ nombre: '', hex: '' });
			return;
		}
		setToUpdate(row._id);
		setValues({ nombre: row.nombre, hex: row.hex });
	};

	return (
		<TableRow hover role="checkbox" tabIndex={-1} selected={toUpdate === row._id ? true : false}>
			<TableCell className={classes.color}>
				<Box mr={1} width={30} height={25} bgcolor={row.hex} borderRadius="10%" />
				<Typography>
					<b>{row.hex}</b>
				</Typography>
			</TableCell>
			<TableCell>
				<Typography>
					<b>{row.nombre}</b>
				</Typography>
			</TableCell>
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
			<TableCell padding="checkbox">
				<Modal handleModal={handleModal} openModal={openModal} handleDelete={handleDelete} />
			</TableCell>
		</TableRow>
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
