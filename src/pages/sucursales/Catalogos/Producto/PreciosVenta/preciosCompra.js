import React, { Fragment, useContext, useState } from 'react';
import { IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Box, TextField, Typography, Table, Checkbox, Select, MenuItem, Button } from '@material-ui/core';
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { Add, DeleteOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `5px 5px`
		}
	},
	table: {
		width: 400
	}
}));

export default function PreciosDeCompra() {
	const classes = useStyles();
	const { precios, unidadesVenta, setUnidadesVenta } = useContext(RegProductoContext);
	const [ unidades, setUnidades ] = useState({
		unidad_de_venta: 'PIEZAS',
		unidad_principal: false
	});

	const obtenerUnidadesVentas = (e) => {
		if(e.target.name === "cantidad" || e.target.name === "precio"){
			setUnidades({
				...unidades,
				[e.target.name]: parseFloat(e.target.value)
			});
			return
		}
		setUnidades({
			...unidades,
			[e.target.name]: e.target.value
		});
	};

	const agregarNuevaUnidad = () => {
		if (!unidades.unidad_de_venta || !unidades.precio || !unidades.cantidad) return;
		setUnidadesVenta([ ...unidadesVenta, unidades ]);
		setUnidades({
			unidad_de_venta: 'PIEZAS',
			unidad_principal: false
		});
	};

	return (
		<Fragment>
			<Box my={1} />
			<Typography align="center">
				<b>Unidades de venta</b>
				
			</Typography>
			<Box className={classes.formInputFlex}>
				<Box width="130px">
					<Typography>Unidad</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small" name="unidad_de_venta">
							{!precios.granel ? (
								<Select
									name="unidad_de_venta"
									value={unidades.unidad_de_venta}
									onChange={obtenerUnidadesVentas}
								>
									<MenuItem value="">
										<em>NINGUNA</em>
									</MenuItem>
									<MenuItem value="LITROS">LITROS</MenuItem>
									<MenuItem value="CAJAS">CAJAS</MenuItem>
									<MenuItem value="PIEZAS">PIEZAS</MenuItem>
									<MenuItem value="TARIMAS">TARIMAS</MenuItem>
								</Select>
							) : (
								<Select
									name="unidad_de_venta"
									value={precios.unidad_de_compra.unidad}
									onChange={obtenerUnidadesVentas}
								>
									<MenuItem value="">
										<em>NINGUNA</em>
									</MenuItem>
									<MenuItem value="KILOGRAMOS">KILOGRAMOS</MenuItem>
									<MenuItem value="COSTALES">COSTALES</MenuItem>
								</Select>
							)}
						</FormControl>
					</Box>
				</Box>
				<Box width="80px">
					<Typography>Cantidad</Typography>
					<TextField
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						name="cantidad"
						variant="outlined"
						onChange={obtenerUnidadesVentas}
						value={unidades.cantidad ? unidades.cantidad : ''}
					/>
				</Box>
				<Box width="80px">
					<Typography>Precio</Typography>
					<TextField
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						name="precio"
						variant="outlined"
						onChange={obtenerUnidadesVentas}
						value={unidades.precio ? unidades.precio : ''}
					/>
				</Box>
				<Box pt={1}>
					<IconButton color="primary" onClick={agregarNuevaUnidad}>
						<Add fontSize="large" />
					</IconButton>
				</Box>
			</Box>
			<Box>
				<TableContainer>
					<Table className={classes.table} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>Unidad</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell>Cantidad</TableCell>
								<TableCell>Unidad Principal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{unidadesVenta.map((unidades, index) => (
								<RenderUnidadesRows key={index} unidades={unidades} index={index} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Fragment>
	);
}

const RenderUnidadesRows = ({ unidades, index }) => {
	const { unidadesVenta, setUnidadesVenta } = useContext(RegProductoContext);

	useEffect(() => {}, []);

	const checkUnidadPrincipal = () => {
		let nuevo_array = [];
		for (let i = 0; i < unidadesVenta.length; i++) {
			const element = unidadesVenta[i];
			let new_element = {
				unidad_de_venta: element.unidad_de_venta,
				precio: parseFloat(element.precio),
				cantidad: parseFloat(element.cantidad),
				unidad_principal: i === index ? true : false
			};
			nuevo_array.push(new_element);
		}
		setUnidadesVenta([ ...nuevo_array ]);
	};

	return (
		<TableRow>
			<TableCell>{unidades.unidad_de_venta}</TableCell>
			<TableCell>{unidades.precio}</TableCell>
			<TableCell>{unidades.cantidad}</TableCell>
			<TableCell>
				<Checkbox
					checked={unidades.unidad_principal}
					onChange={(e) => checkUnidadPrincipal(e.target.checked)}
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
			</TableCell>
			<TableCell>
				<ModalDelete unidades={unidades} index={index} />
			</TableCell>
		</TableRow>
	);
};

const ModalDelete = ({ index }) => {
	const [ open, setOpen ] = useState(false);
	const { unidadesVenta, setUnidadesVenta } = useContext(RegProductoContext);

	const toggleModal = () => {
		setOpen(!open);
	};

	const eliminarUnidad = () => {
		unidadesVenta.splice(index, 1);
		setUnidadesVenta([ ...unidadesVenta ]);
		toggleModal();
	};

	return (
		<div>
			<IconButton color="primary" onClick={toggleModal}>
				<DeleteOutline color="primary" />
			</IconButton>
			<Dialog open={open} onClose={toggleModal}>
				<DialogTitle>{'se eliminará esta unidad de venta'}</DialogTitle>
				<DialogActions>
					<Button onClick={toggleModal} color="primary">
						Cancelar
					</Button>
					<Button onClick={eliminarUnidad} color="secondary" autoFocus>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
