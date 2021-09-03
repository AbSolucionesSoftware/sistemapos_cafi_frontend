import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Switch } from '@material-ui/core';

import {  DESACTIVAR_DESCUENTOS, ELIMINAR_DESCUENTOS } from '../../../../../gql/Catalogos/descuentos';
import { useMutation } from '@apollo/client';
import SnackBarMessages from '../../../../../components/SnackBarMessages';

const headCells = [
	{ id: 'cantidad',  label: 'Cantidad' },
	{ id: 'tipo',  label: 'Tipo' },
	{ id: 'precio',  label: 'Precio U.' },
	{ id: 'precioDes',  label: 'Precio Desc.' },
	{ id: 'descuento',  label: '% Desc.' },
	{ id: 'eliminar',  label: 'Eliminar'},
	{ id: 'activo',  label: 'Activo'}
];

function EnhancedTableHead(props) {
	const { onSelectAllClick, numSelected, rowCount } = props;

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all desserts' }}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		height: 300
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	}
}));

export default function TablaPreciosDescuentos(
	{ 
		value,
		setCleanList, 
		cleanList, 
		verificarDatos, 
		setPrecioPrueba,
		productosRefetch,
		setPreciosProductos, 
		precios,
		setLoading
	}
	) {

	const classes = useStyles();
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	var porcentaje  =  parseFloat((100 - value).toFixed(2));

	const [ selected, setSelected ] = useState([]);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(5);

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = precios.map((n) => n);
			setSelected(newSelecteds); 
			verificarDatos(newSelecteds);
			setPreciosProductos(newSelecteds);
			return;
		};
		setPreciosProductos([]); 
		setSelected([]);
	};

	const handleClick = (event, _id) => {
		const selectedIndex = selected.indexOf(_id);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, _id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setPrecioPrueba(newSelected.length === 0 ? 0 : newSelected);
		setPreciosProductos(newSelected);
		verificarDatos(newSelected);
		setSelected(newSelected);
	};
	
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		setSelected([]);
		setCleanList(false);
	}, [cleanList]);

	const isSelected = (_id) => selected.indexOf(_id) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, precios.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Paper className={classes.paper}>
				<TableContainer className={classes.table}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small" 
						aria-label="a dense table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={precios.length}
						/>
						<TableBody>
							{precios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
								const isItemSelected = isSelected(row);
								const labelId = `enhanced-table-checkbox-${index}`;
								return (
									<RowsRender
									    setLoading={setLoading}
										key={index}
										productosRefetch={productosRefetch}
										handleClick={handleClick} 
										selected={selected} 
										row={row}
										setAlert={setAlert}
										porcentaje={porcentaje}
										value={value}
										isItemSelected={isItemSelected} 
										labelId={labelId} 
									/>
								);
							})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
                    rowsPerPageOptions={[]}
					component="div"
					count={precios.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}

function RowsRender({row, value, isItemSelected, setLoading, labelId,setAlert, porcentaje, productosRefetch, handleClick, selected}) {

	const [openModal, setOpenModal] = useState(false);

	const [ DesactivarDescuentoUnidad ] = useMutation(DESACTIVAR_DESCUENTOS);
	const [ ELiminarDescuentoUnidad ] = useMutation(ELIMINAR_DESCUENTOS);

	const handleChangeActivo = async () => {
		setLoading(true);
		try {
			await DesactivarDescuentoUnidad({
				variables: {
					input: {
						descuento_activo: !row.descuento_activo,
					},
					id: row._id
				}
			});
			setLoading(false);
			productosRefetch();
			setAlert({ message: 'Estado de descuento actualizado', status: 'success', open: true });
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Ocurrio un problema en el servidor' , status: 'error', open: true });
		}
	};

	const handleModal =()=>{
		setOpenModal(!openModal);
	}

	const handleDelete = async () => {
		setLoading(true);
		try {
			const resultado = await ELiminarDescuentoUnidad({
				variables: {
					id: row._id,
				}
			});
			setLoading(false);
			productosRefetch();
			handleModal();
			setAlert({ message: resultado.data.eliminarDescuentoUnidad.message, status: 'success', open: true });
		} catch (error) {
			console.log(error);
			setAlert({ message: error.message, status: 'error', open: true });
		}
	}

	

	return(
		<TableRow
			hover
			// onClick={(event) => handleClick(event, row)}
			role="checkbox"
			aria-checked={isItemSelected}
			tabIndex={-1}
			key={row._id}
			selected={isItemSelected}
		>
			<TableCell padding="checkbox">
				<Checkbox
					onClick={(event) => handleClick(event, row)}
					checked={isItemSelected}
					inputProps={{ 'aria-labelledby': labelId }}
				/>
			</TableCell>
			<TableCell align="center">{row.cantidad}</TableCell>
			<TableCell align="center">{row.cantidad > 1 ? "Cajas" : "Pieza"}</TableCell>
			<TableCell align="center">{row.precio}</TableCell>

			<TableCell align="center">
				{selected.length  <= 1 ? (
					!row.descuento ? 0 : <b style={{color: 'green'}}>{row.descuento.precio_con_descuento}</b>
				):
					<b style={{color: 'green'}}>{parseFloat((row.precio * porcentaje / 100).toFixed(2))}</b>
				}
			</TableCell>
			<TableCell align="center">
				{console.log(porcentaje)}
				{selected.length  <= 1 ? (
					!row.descuento ? 0 : <b style={{color: 'red'}}>{row.descuento.porciento}%</b>
				):
					<b style={{color: 'red'}}>{value}%</b>
				}
				{/* {!row.descuento ? 
					<b style={{color: 'black'}}>0%</b>
					: <b style={{color: 'red'}}>{row.descuento.porciento}%</b>
				} */}
			</TableCell>
			<TableCell align="center">
				<Modal row={row} handleModal={handleModal} openModal={openModal} handleDelete={handleDelete} />
			</TableCell>
			<TableCell key={row._id} align="center">
				<Switch
					key={row._id}
					onChange={handleChangeActivo}
					color="primary"
					disabled={ !row.descuento ? true 
						 : ( row.descuento.porciento === 0 ? true : false ) }
					defaultChecked={row.descuento_activo ? row.descuento_activo : false}
					name="descuento_activo"
					inputProps={{ 'aria-label': 'secondary checkbox' }}
				/>
			</TableCell>
		</TableRow>
	)
};

const Modal = ({row, handleModal, openModal, handleDelete }) => {
	return (
		<div>
			<IconButton 
				color="secondary" 
				onClick={handleModal}
				disabled={ !row.descuento ? true 
					: ( row.descuento.porciento === 0 ? true : false ) }
			>
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
