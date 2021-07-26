import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Box, FormControl, MenuItem, Select, TextField, Typography, Grid } from '@material-ui/core';
import 'date-fns';
import local from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function RegistroAlmacenInicial({ obtenerConsultasProducto }) {
	const classes = useStyles();
	const [selectedDate, setSelectedDate] = useState(null);
	const { precios, setPrecios, almacen_inicial, setAlmacenInicial } = useContext(RegProductoContext);
	const { almacenes } = obtenerConsultasProducto;

	/*ARMAR OBJETO DE INVENTARIO  */
	const obtenerInventario = (e) => {
		if (e.target.name === "unidad_de_inventario") {
			setPrecios({
				...precios,
				inventario: { ...precios.inventario, [e.target.name]: e.target.value }
			});
			return
		}
		setPrecios({
			...precios,
			inventario: { ...precios.inventario, [e.target.name]: parseFloat(e.target.value) }
		});
	};

	const obtenerAlmacenInicial = (e) => {
		if (e.target.name === "almacen") {
			setAlmacenInicial({
				...almacen_inicial,
				[e.target.name]: e.target.value
			});
			return
		}
		setAlmacenInicial({
			...almacen_inicial,
			[e.target.name]: parseFloat(e.target.value)
		});
	};

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id,
		});
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setAlmacenInicial({
			...almacen_inicial,
			fecha_de_expiracion: date
		});
	};

	return (
		<Fragment>
			<Box mt={3}>
				<Typography>
					<b>Inventario</b>
				</Typography>
				<Divider />
			</Box>
			<Box className={classes.formInputFlex}>
				<Box width="150px">
					<Typography>Inventario mínimo</Typography>
					<TextField
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						name="inventario_minimo"
						id="form-producto-inventario_minimo"
						variant="outlined"
						value={precios.inventario.inventario_minimo}
						onChange={obtenerInventario}
					/>
				</Box>
				<Box width="150px">
					<Typography>Inventario máximo</Typography>
					<TextField
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						name="inventario_maximo"
						id="form-producto-inventario_maximo"
						variant="outlined"
						value={precios.inventario.inventario_maximo}
						onChange={obtenerInventario}
					/>
				</Box>
				<Box width="150px">
					<Typography>Unidad de inventario</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small" name="unidad_de_inventario">
							{!precios.granel ? (
								<Select
									name="unidad" value={precios.unidad_de_compra.unidad}
									onChange={obtenerInventario}>
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
									name="unidad" value={precios.unidad_de_compra.unidad}
									onChange={obtenerInventario}>
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
			</Box>
			<Box mt={3}>
				<Typography>
					<b>Almacen incial</b>
				</Typography>
				<Divider />
			</Box>
			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Cantidad inicial en <b>{precios.unidad_de_compra.unidad}</b></Typography>
					<Box display="flex">
						<TextField
							fullWidth
							type="number"
							InputProps={{ inputProps: { min: 0 } }}
							size="small"
							name="cantidad"
							variant="outlined"
							value={almacen_inicial.cantidad}
							onChange={obtenerAlmacenInicial}
						/>
					</Box>
				</Box>
				<Box width="100%">
					<Typography>Almacen</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small" name="almacen">
							<Select name="almacen" value={almacen_inicial.almacen} onChange={obtenerAlmacenes}>
								<MenuItem value="">
									<em>Seleccione uno</em>
								</MenuItem>
								{almacenes ? almacenes.map((res) => {
									return (
										<MenuItem
											name="id_almacen"
											key={res._id}
											value={res.nombre_almacen}
											id={res._id}
										>
											{res.nombre_almacen}
										</MenuItem>
									);
								}) : <MenuItem value="" />}
							</Select >
						</FormControl>
					</Box>
				</Box>
				<Box width="100%">
					<Typography>Fecha de expiración</Typography>
					<MuiPickersUtilsProvider utils={DateFnsUtils} locale={local}>
						<Grid container justify="space-around">
							<KeyboardDatePicker
								margin="dense"
								id="date-picker-dialog"
								placeholder="ex: DD/MM/AAAA"
        						format="dd/MM/yyyy"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
				</Box>
			</div>
		</Fragment>
	);
}
