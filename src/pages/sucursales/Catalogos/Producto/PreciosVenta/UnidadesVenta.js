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
}));

export default function PreciosDeCompra() {
	const classes = useStyles();
	const { datos_generales, precios, unidadesVenta, setUnidadesVenta, unidadVentaXDefecto, setUnidadVentaXDefecto } = useContext(RegProductoContext);
	const [unidades, setUnidades] = useState({
		unidad: precios.granel ? 'KILOGRAMOS' : 'PIEZAS',
		unidad_principal: false
	});

	const obtenerUnidadesVentas = (e) => {
		if (e.target.name === "cantidad" || e.target.name === "precio") {
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
		if (!unidades.unidad || !unidades.precio || !unidades.cantidad) return;
		setUnidadesVenta([...unidadesVenta, unidades]);
		setUnidades({
			unidad: 'PIEZAS',
			unidad_principal: false
		});
	};

	const checkUnidadDefault = (checked) => {
		setUnidadVentaXDefecto({
			...unidadVentaXDefecto,
			unidad_principal: checked
		})
		if (checked) {
			let nuevo_array = [];
			for (let i = 0; i < unidadesVenta.length; i++) {
				const element = unidadesVenta[i];
				let new_element = {
					unidad: element.unidad,
					precio: parseFloat(element.precio),
					cantidad: parseFloat(element.cantidad),
					unidad_principal: false
				};
				nuevo_array.push(new_element);
			}
			setUnidadesVenta([...nuevo_array]);
		}
	};

	return (
		<Fragment>
			<Box className={classes.formInputFlex} justifyContent="center">
				<Box>
					<Typography>Unidad</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small" name="unidad">
							{!precios.granel ? (
								<Select
									name="unidad" value={unidades.unidad}
									onChange={obtenerUnidadesVentas}>
									<MenuItem value="LITROS">LITROS</MenuItem>
									<MenuItem value="CAJAS">CAJAS</MenuItem>
									<MenuItem value="PIEZAS">PIEZAS</MenuItem>
									<MenuItem value="TARIMAS">TARIMAS</MenuItem>
								</Select>
							) : (
								<Select
									name="unidad" value={unidades.unidad}
									onChange={obtenerUnidadesVentas}>
									<MenuItem value="KILOGRAMOS">KILOGRAMOS</MenuItem>
									<MenuItem value="COSTALES">COSTALES</MenuItem>
								</Select>
							)}
						</FormControl>
					</Box>
				</Box>
				<Box>
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
				<Box>
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
				<Box>
					<Typography>Código de barras</Typography>
					<TextField
						disabled={unidades.unidad !== "CAJAS"}
						size="small"
						name="codigo_barras"
						variant="outlined"
						onChange={obtenerUnidadesVentas}
						value={unidades.codigo_barras ? unidades.codigo_barras : ''}
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
					<Table size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>Código de barras</TableCell>
								<TableCell>Unidad</TableCell>
								<TableCell>Precio</TableCell>
								<TableCell>Cantidad</TableCell>
								<TableCell>Unidad Principal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>{datos_generales.codigo_barras}</TableCell>
								<TableCell>{unidadVentaXDefecto.unidad}</TableCell>
								<TableCell>{unidadVentaXDefecto.precio}</TableCell>
								<TableCell>{unidadVentaXDefecto.cantidad}</TableCell>
								<TableCell>
									<Checkbox
										checked={unidadVentaXDefecto.unidad_principal}
										onChange={(e) => checkUnidadDefault(e.target.checked)}
										inputProps={{ 'aria-label': 'primary checkbox' }}
										disabled={unidadesVenta.length === 0}
									/>
								</TableCell>
							</TableRow>
							{unidadesVenta.map((unidades, index) => {
								if(!unidades.default) return (
									<RenderUnidadesRows key={index} unidades={unidades} index={index} />
								)
								return null
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Fragment>
	);
}

const RenderUnidadesRows = ({ unidades, index }) => {
	const { unidadesVenta, setUnidadesVenta, unidadVentaXDefecto, setUnidadVentaXDefecto } = useContext(RegProductoContext);

	useEffect(() => { }, []);

	const checkUnidadPrincipal = () => {
		let nuevo_array = [];
		for (let i = 0; i < unidadesVenta.length; i++) {
			const element = unidadesVenta[i];
			let new_element = {
				unidad: element.unidad,
				precio: parseFloat(element.precio),
				cantidad: parseFloat(element.cantidad),
				unidad_principal: i === index ? true : false
			};
			nuevo_array.push(new_element);
		}
		setUnidadesVenta([...nuevo_array]);
		setUnidadVentaXDefecto({
			...unidadVentaXDefecto,
			unidad_principal: false
		})
	};

	return (
		<TableRow>
			<TableCell>{unidades.codigo_barras}</TableCell>
			<TableCell>{unidades.unidad}</TableCell>
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

const ModalDelete = ({ unidades, index }) => {
	const [open, setOpen] = useState(false);
	const { unidadesVenta, setUnidadesVenta, unidadVentaXDefecto, setUnidadVentaXDefecto } = useContext(RegProductoContext);

	const toggleModal = () => {
		setOpen(!open);
	};

	const eliminarUnidad = () => {
		unidadesVenta.splice(index, 1);
		if (unidadesVenta.length === 0 || unidades.unidad_principal) {
			setUnidadVentaXDefecto({
				...unidadVentaXDefecto,
				unidad_principal: true
			})
		}
		setUnidadesVenta([...unidadesVenta]);
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
