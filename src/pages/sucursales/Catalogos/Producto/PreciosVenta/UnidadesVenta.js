import React, { Fragment, useContext, useState } from 'react';
import {
	IconButton,
	InputAdornment,
	OutlinedInput,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@material-ui/core';
import { Box, TextField, Typography, Table, Checkbox, Select, MenuItem, Button } from '@material-ui/core';
import { Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { Add, Close, DeleteOutline, EditOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { useEffect } from 'react';
import Done from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `5px 5px`
		}
	}
}));

export default function PreciosDeCompra() {
	const classes = useStyles();
	const {
		datos_generales,
		precios,
		unidadesVenta,
		setUnidadesVenta,
		unidadVentaXDefecto,
		setUnidadVentaXDefecto,
		setDatosGenerales, 
		update
	} = useContext(RegProductoContext);
	const [ unidades, setUnidades ] = useState({
		unidad: precios.granel ? 'Kg' : 'Pz',
		unidad_principal: false
	});
	const [ actualizarUnidad, setActualizarUnidad ] = useState(false);

	const obtenerUnidadesVentas = (e) => {
		if (e.target.name === 'cantidad' || e.target.name === 'precio') {
			setUnidades({
				...unidades,
				[e.target.name]: parseFloat(e.target.value)
			});
			return;
		}
		setUnidades({
			...unidades,
			[e.target.name]: e.target.value
		});
	};

	const agregarNuevaUnidad = () => {
		if (!unidades.unidad || !unidades.precio || !unidades.cantidad) return;

		if (actualizarUnidad) {
			setUnidadVentaXDefecto(unidades);
			setDatosGenerales({
				...datos_generales,
				codigo_barras: unidades.codigo_barras
			});
			setActualizarUnidad(false);
		} else {
			setUnidadesVenta([ ...unidadesVenta, unidades ]);
		}
		setUnidades({
			unidad: 'Pz',
			unidad_principal: false
		});
	};

	const checkUnidadDefault = (checked) => {
		setUnidadVentaXDefecto({
			...unidadVentaXDefecto,
			unidad_principal: checked
		});
		if (checked) {
			let nuevo_array = [];
			for (let i = 0; i < unidadesVenta.length; i++) {
				const element = unidadesVenta[i];
				let new_element = {
					codigo_barras: element.codigo_barras,
					unidad: element.unidad,
					precio: parseFloat(element.precio),
					cantidad: parseFloat(element.cantidad),
					unidad_principal: false
				};
				nuevo_array.push(new_element);
			}
			setUnidadesVenta([ ...nuevo_array ]);
		}
	};

	const updateUnidadPrincipal = () => {
		setActualizarUnidad(true);
		setUnidades({
			codigo_barras: unidadVentaXDefecto.codigo_barras,
			unidad: unidadVentaXDefecto.unidad,
			cantidad: unidadVentaXDefecto.cantidad,
			precio: unidadVentaXDefecto.precio,
			unidad_principal: unidadVentaXDefecto.unidad_principal,
			default: true
		});
	};

	const cancelarUpdate = () => {
		setActualizarUnidad(false);
		setUnidades({
			unidad: 'Pz',
			unidad_principal: false
		});
	};

	const GenCodigoBarras = () => {
		const max = 999999999999;
		const min = 100000000000;
		const codigo_barras = Math.floor(Math.random() * (max - min + 1) + min).toString();
		setUnidades({
			...unidades,
			codigo_barras
		});
	};

	useEffect(() => {
		
	}, [])

	return (
		<Fragment>
			<Box className={classes.formInputFlex} justifyContent="center">
				<Box>
					<Typography>Unidad</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small" name="unidad">
							{precios.granel ? (
								<Select name="unidad" value={unidades.unidad} onChange={obtenerUnidadesVentas}>
									<MenuItem value="Kg">Kg</MenuItem>
									<MenuItem value="Costal">Costal</MenuItem>
									<MenuItem value="Lt">Lt</MenuItem>
								</Select>
							) : (
								<Select name="unidad" value={unidades.unidad} onChange={obtenerUnidadesVentas}>
									<MenuItem value="Caja">Caja</MenuItem>
									<MenuItem value="Pz">Pz</MenuItem>
								</Select>
							)}
						</FormControl>
					</Box>
				</Box>
				<Box>
					<Typography>
						Cantidad{' '}
						<b>
							{unidades.unidad === 'Caja' ? (
								'(pz por caja)'
							) : unidades.unidad === 'Costal' ? (
								'(kg por costal)'
							) : (
								''
							)}
						</b>
					</Typography>
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
					<Typography>
						Precio por <b>{unidades.unidad}</b>
					</Typography>
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
					<FormControl variant="outlined" size="small" name="codigo_barras">
						<Typography>Código de barras</Typography>
						<OutlinedInput
							disabled={update}
							id="input-codigo-barras"
							name="codigo_barras"
							value={unidades.codigo_barras ? unidades.codigo_barras : ''}
							onChange={obtenerUnidadesVentas}
							endAdornment={
								<InputAdornment position="end">
									<Button onClick={() => GenCodigoBarras()} edge="end" color="primary" disabled={update}>
										Generar
									</Button>
								</InputAdornment>
							}
						/>
					</FormControl>
				</Box>
				<Box display="flex" alignItems="flex-end">
					<Button
						color="primary"
						onClick={() => agregarNuevaUnidad()}
						startIcon={actualizarUnidad ? <Done fontSize="large" /> : <Add fontSize="large" />}
						variant="outlined"
						size="large"
					>
						Guardar
					</Button>
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
								<TableCell>Acciones</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow selected={actualizarUnidad ? true : false}>
								<TableCell>{datos_generales.codigo_barras}</TableCell>
								<TableCell>
									{unidadVentaXDefecto.unidad}
								</TableCell>
								<TableCell>$ {unidadVentaXDefecto.precio}</TableCell>
								<TableCell>{unidadVentaXDefecto.cantidad}</TableCell>
								<TableCell>
									<Checkbox
										checked={unidadVentaXDefecto.unidad_principal}
										onChange={(e) => checkUnidadDefault(e.target.checked)}
										inputProps={{ 'aria-label': 'primary checkbox' }}
										disabled={unidadesVenta.length === 0}
									/>
								</TableCell>
								<TableCell>
									{actualizarUnidad ? (
										<IconButton color="primary" onClick={() => cancelarUpdate()}>
											<Close color="primary" />
										</IconButton>
									) : (
										<IconButton color="primary" onClick={() => updateUnidadPrincipal()}>
											<EditOutlined color="primary" />
										</IconButton>
									)}
								</TableCell>
							</TableRow>
							{unidadesVenta.map((unidades, index) => {
								if (!unidades.default)
									return <RenderUnidadesRows key={index} unidades={unidades} index={index} />;
								return null;
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Fragment>
	);
}

const RenderUnidadesRows = ({ unidades, index }) => {
	const { unidadesVenta, setUnidadesVenta, unidadVentaXDefecto, setUnidadVentaXDefecto } = useContext(
		RegProductoContext
	);

	useEffect(() => {}, []);

	const checkUnidadPrincipal = () => {
		let nuevo_array = [];
		for (let i = 0; i < unidadesVenta.length; i++) {
			const element = unidadesVenta[i];
			let new_element = {
				codigo_barras: element.codigo_barras,
				unidad: element.unidad,
				precio: parseFloat(element.precio),
				cantidad: parseFloat(element.cantidad),
				unidad_principal: i === index ? true : false,
				default: element.default
			};
			nuevo_array.push(new_element);
		}
		setUnidadesVenta([ ...nuevo_array ]);
		setUnidadVentaXDefecto({
			...unidadVentaXDefecto,
			unidad_principal: false
		});
	};

	return (
		<TableRow>
			<TableCell>{unidades.codigo_barras}</TableCell>
			<TableCell>{unidades.unidad}</TableCell>
			<TableCell>$ {unidades.precio}</TableCell>
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
	const [ open, setOpen ] = useState(false);
	const { unidadesVenta, setUnidadesVenta, unidadVentaXDefecto, setUnidadVentaXDefecto } = useContext(
		RegProductoContext
	);

	const toggleModal = () => {
		setOpen(!open);
	};

	const eliminarUnidad = () => {
		unidadesVenta.splice(index, 1);
		if (unidadesVenta.length === 0 || unidades.unidad_principal) {
			setUnidadVentaXDefecto({
				...unidadVentaXDefecto,
				unidad_principal: true
			});
		}
		setUnidadesVenta([ ...unidadesVenta ]);
		toggleModal();
	};

	return (
		<div>
			<IconButton color="primary" onClick={() => toggleModal()}>
				<DeleteOutline color="primary" />
			</IconButton>
			<Dialog open={open} onClose={toggleModal}>
				<DialogTitle>{'se eliminará esta unidad de venta'}</DialogTitle>
				<DialogActions>
					<Button onClick={() => toggleModal()} color="primary">
						Cancelar
					</Button>
					<Button onClick={() => eliminarUnidad()} color="secondary" autoFocus>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
