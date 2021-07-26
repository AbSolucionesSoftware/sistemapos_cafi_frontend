import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Checkbox, FormControlLabel, TextField, MenuItem, Container, FormHelperText, InputAdornment } from '@material-ui/core';
import { Typography, Divider, FormControl, Select } from '@material-ui/core';

import { Grid } from '@material-ui/core';
import PreciosDeCompra from './preciosCompra';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import Precio1 from './Precios';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& .obligatorio': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
	},
	precioTitle: {
		width: theme.spacing(20),
		display: 'flex',
		alignItems: 'center'
	}
}));

export default function RegistroInfoAdidional() {
	const classes = useStyles();
	const { precios, setPrecios, validacion, preciosP } = useContext(RegProductoContext);

	/* CHECKBOX IVA */
	const obtenerIva = (e) => {
		let precio_con_impuesto = 0;
		let precio_sin_impuesto = 0;
		let iva = 0;
		let ieps = 0;
		let precio_unitario_sin_impuesto = 0;
		let precio_unitario_con_impuesto = 0;

		if (e.target.name === "iva_activo") {
			if (e.target.checked) {
				precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
				iva = parseFloat(precio_sin_impuesto) * .16;
				ieps = parseFloat(precio_sin_impuesto) * parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
				precio_con_impuesto = precio_sin_impuesto + iva + ieps;
				precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			} else {
				precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
				iva = 0;
				ieps = parseFloat(precio_sin_impuesto) * parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
				precio_con_impuesto = precio_sin_impuesto + iva + ieps;
				precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
				if (!precios.ieps_activo) {
					precio_con_impuesto = 0;
					precio_unitario_con_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				}
			}
		} else {
			precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
			iva = parseFloat(precio_sin_impuesto) * parseFloat(e.target.value < 10 ? ".0" + e.target.value : "." + e.target.value);
			ieps = parseFloat(precio_sin_impuesto) * parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
			precio_con_impuesto = precio_sin_impuesto + iva + ieps;
			precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
		}
		setPrecios({
			...precios,
			iva_activo: e.target.name === "iva_activo" ? e.target.checked : precios.iva_activo,
			iva: e.target.name === "iva" ? parseFloat(e.target.value) : e.target.checked ? 16 : 0,
			precio_de_compra: {
				...precios.precio_de_compra,
				precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(2)),
				iva: parseFloat(iva.toFixed(2)),
				ieps: parseFloat(ieps.toFixed(2)),
				precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(2)),
			},
			unidad_de_compra: {
				...precios.unidad_de_compra,
				precio_unitario_sin_impuesto: parseFloat(precio_unitario_sin_impuesto.toFixed(2)),
				precio_unitario_con_impuesto: parseFloat(precio_unitario_con_impuesto.toFixed(2))
			}
		});

	};

	/* CHECKBOX IEPS
	si el checkbox esta true se agrega al precio de venta */
	const obtenerIeps = (e) => {
		let precio_con_impuesto = 0;
		let precio_sin_impuesto = 0;
		let iva = 0;
		let ieps = 0;
		let precio_unitario_sin_impuesto = 0;
		let precio_unitario_con_impuesto = 0;

		if (e.target.name === "ieps_activo") {
			if (e.target.checked) {
				precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
				iva = parseFloat(precio_sin_impuesto) * parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
				ieps = parseFloat(precio_sin_impuesto) * precios.ieps;
				precio_con_impuesto = precio_sin_impuesto + iva + ieps;
				precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			} else {
				precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
				ieps = 0;
				iva = parseFloat(precio_sin_impuesto) * parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
				precio_con_impuesto = precio_sin_impuesto + iva + ieps;
				precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
				if (!precios.iva_activo) {
					precio_con_impuesto = 0;
					precio_unitario_con_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
				}
			}
		} else {
			precio_sin_impuesto = parseFloat(precios.precio_de_compra.precio_sin_impuesto);
			iva = parseFloat(precio_sin_impuesto) * parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
			ieps = parseFloat(precio_sin_impuesto) * parseFloat(e.target.value < 10 ? ".0" + e.target.value : "." + e.target.value);
			precio_con_impuesto = precio_sin_impuesto + iva + ieps;
			precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
		}
		setPrecios({
			...precios,
			ieps_activo: e.target.name === "ieps_activo" ? e.target.checked : precios.ieps_activo,
			ieps: e.target.name === "ieps" ? parseFloat(e.target.value) : e.target.checked ? precios.ieps : 0,
			precio_de_compra: {
				...precios.precio_de_compra,
				precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(2)),
				iva: parseFloat(iva.toFixed(2)),
				ieps: parseFloat(ieps.toFixed(2)),
				precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(2)),
			},
			unidad_de_compra: {
				...precios.unidad_de_compra,
				precio_unitario_sin_impuesto: parseFloat(precio_unitario_sin_impuesto.toFixed(2)),
				precio_unitario_con_impuesto: parseFloat(precio_unitario_con_impuesto.toFixed(2))
			}
		});
	};

	/* ARMAR OBJETO DE PRECIOS DE COMPRA */
	const obtenerPreciosCompra = (e) => {
		let precio_con_impuesto = 0;
		let total_impuesto = 0
		let precio_sin_impuesto = 0;
		let iva = 0;
		let ieps = 0;
		let precio_unitario_sin_impuesto = 0;
		let precio_unitario_con_impuesto = 0;

		if (e.target.name === "precio_sin_impuesto") {
			/* Precio sin impuesto */
			precio_sin_impuesto = parseFloat(e.target.value);
			iva = parseFloat(e.target.value) * parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
			ieps = parseFloat(e.target.value) * parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
			precio_con_impuesto = precio_sin_impuesto + iva + ieps;
			precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
			precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			if (!precios.iva_activo && !precios.ieps_activo) {
				precio_con_impuesto = 0;
				precio_unitario_con_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
			}
		} else {
			/* Precio con impuesto */
			precio_con_impuesto = parseFloat(e.target.value);
			total_impuesto = parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva) + parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps)
			precio_sin_impuesto = parseFloat(e.target.value) / parseFloat(total_impuesto + 1);
			iva = precio_sin_impuesto * parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
			ieps = precio_sin_impuesto * parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
			precio_unitario_con_impuesto = precio_con_impuesto / precios.unidad_de_compra.cantidad;
			precio_unitario_sin_impuesto = precio_sin_impuesto / precios.unidad_de_compra.cantidad;
		}

		if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
		if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;
		if (isNaN(iva)) iva = 0;
		if (isNaN(ieps)) ieps = 0;
		/* if (isNaN(precio_con_impuesto)) precio_con_impuesto = 0;
		if (isNaN(precio_sin_impuesto)) precio_sin_impuesto = 0; */

		setPrecios({
			...precios,
			precio_de_compra: {
				...precios.precio_de_compra,
				precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(2)),
				iva: parseFloat(iva.toFixed(2)),
				ieps: parseFloat(ieps.toFixed(2)),
				precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(2)),
			},
			unidad_de_compra: {
				...precios.unidad_de_compra,
				precio_unitario_sin_impuesto: parseFloat(precio_unitario_sin_impuesto.toFixed(2)),
				precio_unitario_con_impuesto: parseFloat(precio_unitario_con_impuesto.toFixed(2))
			}
		});
	};

	/* ARMAR OBJETO DE UNIDAD DE COMPRA */
	const obtenerUnidadCompra = (e) => {
		if (e.target.name === "unidad") {
			setPrecios({
				...precios,
				unidad_de_compra: { ...precios.unidad_de_compra, [e.target.name]: e.target.value }
			});
			return
		}
		if (!precios.iva_activo && !precios.ieps_activo) {
			setPrecios({
				...precios,
				unidad_de_compra: {
					...precios.unidad_de_compra, [e.target.name]: parseFloat(e.target.value),
					precio_unitario_sin_impuesto: Math.round(precios.precio_de_compra.precio_sin_impuesto / parseFloat(e.target.value)),
					precio_unitario_con_impuesto: Math.round(precios.precio_de_compra.precio_sin_impuesto / parseFloat(e.target.value))
				}
			});
			return
		}
		setPrecios({
			...precios,
			unidad_de_compra: {
				...precios.unidad_de_compra, [e.target.name]: parseFloat(e.target.value),
				precio_unitario_sin_impuesto: Math.round(precios.precio_de_compra.precio_sin_impuesto / parseFloat(e.target.value)),
				precio_unitario_con_impuesto: Math.round(precios.precio_de_compra.precio_con_impuesto / parseFloat(e.target.value))
			}
		});
	};

	return (
		<Fragment>
			<Box>
				<Typography>
					<b>Impuestos</b>
				</Typography>
			</Box>
			<Divider />
			<Box display="flex" alignItems="center" my={1}>
				<FormControlLabel
					control={
						<Checkbox checked={precios.iva_activo} onChange={obtenerIva} name="iva_activo" />
					}
					label="IVA"
				/>
				<Box width={120}>
					<TextField
						disabled={!precios.iva_activo}
						label="porcentaje IVA"
						type="number"
						InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
						size="small"
						name="iva"
						id="form-producto-iva"
						variant="outlined"
						value={precios.iva}
						onChange={obtenerIva}
					/>
				</Box>
				<Box mx={5} />
				<FormControlLabel
					control={
						<Checkbox checked={precios.ieps_activo} onChange={obtenerIeps} name="ieps_activo" />
					}
					label="IEPS"
				/>
				<Box width={120}>
					<TextField
						disabled={!precios.ieps_activo}
						label="porcentaje IEPS"
						type="number"
						InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
						size="small"
						name="ieps"
						id="form-producto-ieps"
						variant="outlined"
						value={precios.ieps}
						onChange={obtenerIeps}
					/>
				</Box>
				<Box display="flex" alignItems="center" ml={1}>
					<Alert severity="info">Selecciona los impuestos aplicables</Alert>
				</Box>
			</Box>
			<Grid container>
				<Grid item lg={7}>
					<Box>
						<Typography>
							<b>Precios de compra</b>
						</Typography>
					</Box>
					<Divider />
					<Box className={classes.formInputFlex} >
						<Box>
							<Typography><span className="obligatorio">* </span>Precio sin impuestos</Typography>
							<TextField
								type="number"
								InputProps={{ inputProps: { min: 0 } }}
								size="small"
								error={validacion.error && !precios.precio_de_compra.precio_sin_impuesto}
								name="precio_sin_impuesto"
								id="form-producto-precio_sin_impuesto"
								variant="outlined"
								value={precios.precio_de_compra.precio_sin_impuesto}
								helperText={validacion.message}
								onChange={obtenerPreciosCompra}
							/>
						</Box>
						<Box width="120px">
							<Typography align="center">IVA</Typography>
							<Typography align="center" variant="h6">
								<b>$ {precios.precio_de_compra.iva}</b>
							</Typography>
						</Box>
						<Box width="120px">
							<Typography align="center">IEPS</Typography>
							<Typography align="center" variant="h6">
								<b>$ {precios.precio_de_compra.ieps}</b>
							</Typography>
						</Box>
						<Box >
							<Typography><span className="obligatorio">* </span>Precio con impuestos</Typography>
							<TextField
								disabled={!precios.iva_activo && !precios.ieps_activo}
								type="number"
								InputProps={{ inputProps: { min: 0 } }}
								size="small"
								error={validacion.error && !precios.precio_de_compra.precio_con_impuesto}
								name="precio_con_impuesto"
								id="form-producto-precio_con_impuesto"
								variant="outlined"
								value={precios.precio_de_compra.precio_con_impuesto}
								helperText={validacion.message}
								onChange={obtenerPreciosCompra}
							/>
						</Box>
					</Box>
				</Grid>
				<Grid item lg={5}>
					<Box>
						<Typography>
							<b>Unidades de compra</b>
						</Typography>
					</Box>
					<Divider />
					<Box className={classes.formInputFlex} >
						<Box width="130px">
							<Typography><span className="obligatorio">* </span>Unidad de compra</Typography>
							<Box display="flex">
								<FormControl variant="outlined" fullWidth size="small" error={validacion.error && !precios.unidad_de_compra.unidad}>
									{!precios.granel ? (
										<Select id="form-producto-categoria"
											name="unidad" value={precios.unidad_de_compra.unidad}
											onChange={obtenerUnidadCompra}>
											<MenuItem value="">
												<em>NINGUNA</em>
											</MenuItem>
											<MenuItem value="LITROS">LITROS</MenuItem>
											<MenuItem value="CAJAS">CAJAS</MenuItem>
											<MenuItem value="PIEZAS">PIEZAS</MenuItem>
											<MenuItem value="TARIMAS">TARIMAS</MenuItem>
										</Select>
									) : (
										<Select id="form-producto-categoria"
											name="unidad" value={precios.unidad_de_compra.unidad}
											onChange={obtenerUnidadCompra}>
											<MenuItem value="">
												<em>NINGUNA</em>
											</MenuItem>
											<MenuItem value="KILOGRAMOS">KILOGRAMOS</MenuItem>
											<MenuItem value="COSTALES">COSTALES</MenuItem>
										</Select>
									)}
									<FormHelperText>{validacion.message}</FormHelperText>
								</FormControl>
							</Box>
						</Box>
						<Box width="120px">
							<Typography><span className="obligatorio">* </span>Factor por Unidad</Typography>
							<TextField
								type="number"
								InputProps={{ inputProps: { min: 0 } }}
								size="small"
								error={validacion.error && !precios.unidad_de_compra.cantidad}
								name="cantidad"
								id="form-producto-cantidad"
								variant="outlined"
								value={precios.unidad_de_compra.cantidad}
								helperText={validacion.message}
								onChange={obtenerUnidadCompra}
							/>
						</Box>
						<Box width="160px">
							<Typography align="center">Precio unitario sin impuestos</Typography>
							<Typography align="center">
								<b>$ {precios.unidad_de_compra.precio_unitario_sin_impuesto}</b>
							</Typography>
						</Box>
						<Box width="160px">
							<Typography align="center">Precio unitario con impuestos</Typography>
							<Typography align="center">
								<b>$ {precios.unidad_de_compra.precio_unitario_con_impuesto}</b>
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
			<Box>
				<Typography>
					<b>Precios de venta</b>
				</Typography>
			</Box>
			<Divider />
			<Container maxWidth="xl">
				<Grid container>
					<Grid item md={12} lg={8}>
						<Box display="flex">
							{preciosP.map((res, index) => (<Precio1 key={index} data={res} />))}
						</Box>
					</Grid>
					<Grid item md={12} lg={4}>
						<Box display="flex">
							<Divider orientation="vertical" style={{ height: 300 }} />
							<Box>
								<PreciosDeCompra />
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Fragment>
	);
}
