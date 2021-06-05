import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Checkbox, FormControlLabel, TextField, MenuItem, Container } from '@material-ui/core';
import { Typography, Button, Divider, FormControl, Select } from '@material-ui/core';

import { Add } from '@material-ui/icons';
import RegistroUtilidades from './PreciosVenta/utilidades';
import MostrarPrecioVenta from './PreciosVenta/precioVenta';
import RegistroPrecioNeto from './PreciosVenta/precioNeto';
import RegistroPrecioMayoreo from './PreciosVenta/precioMayoreo';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
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

	return (
		<Fragment>
			<Box className={classes.formInputFlex} justifyContent="space-between">
				<Box>
					<Typography>
						<b>Impuestos</b>
					</Typography>
					<FormControlLabel
						control={<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />}
						label="IVA"
					/>
					<FormControlLabel
						control={<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />}
						label="IEPS"
					/>
				</Box>
				<Box>
					<Typography>Producto</Typography>
					<Typography>
						<b>Cocacola</b>
					</Typography>
				</Box>
				<Box>
					<Typography>Clave alterna</Typography>
					<Typography>
						<b>05</b>
					</Typography>
				</Box>
				<Box>
					<Typography>Clave de producto SAT</Typography>
					<Box display="flex">
						<TextField
							size="small"
							/* error */
							name="precio_neto"
							id="form-producto-nombre-comercial"
							variant="outlined"
							/* value="" */
							/* helperText="Incorrect entry." */
							/* onChange={obtenerCampos} */
						/>
						<Button color="primary">
							<Add />
						</Button>
					</Box>
				</Box>
			</Box>
			<Divider />
			<Container maxWidth="md">
				<div className={classes.formInputFlex}>
					<Box>
						<div className={classes.formInputFlex}>
							<FormControlLabel
								control={
									<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
								}
								label="Precio neto"
							/>
							<Box width="150px">
								<Typography>Unidad de venta</Typography>
								<Box display="flex">
									<FormControl variant="outlined" fullWidth size="small">
										<Select id="form-producto-categoria" /* value={age} */ /* onChange={handleChange} */>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											<MenuItem value={10}>Ten</MenuItem>
											<MenuItem value={20}>Twenty</MenuItem>
											<MenuItem value={30}>Thirty</MenuItem>
										</Select>
									</FormControl>
								</Box>
							</Box>
							<Box width="150px">
								<Typography>Inventario mínimo</Typography>
								<TextField
									type="number"
									InputProps={{ inputProps: { min: 0 } }}
									size="small"
									/* error */
									name="inventario_minimo"
									id="form-producto-inventario_minimo"
									variant="outlined"
									/* value="" */
									/* helperText="Incorrect entry." */
									/* onChange={obtenerCampos} */
								/>
							</Box>
							<Box width="150px">
								<Typography>Inventario máximo</Typography>
								<TextField
									type="number"
									InputProps={{ inputProps: { min: 0 } }}
									size="small"
									/* error */
									name="inventario_maximo"
									id="form-producto-inventario_maximo"
									variant="outlined"
									/* value="" */
									/* helperText="Incorrect entry." */
									/* onChange={obtenerCampos} */
								/>
							</Box>
							<Box width="230px" boxShadow={1} p={1} borderRadius={5}>
								<FormControlLabel
									control={
										<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
									}
									label="Monedero electrónico"
								/>
								<TextField
									type="number"
									InputProps={{ inputProps: { min: 0 } }}
									size="small"
									label="Valor por punto"
									/* error */
									name="monedero_electronico"
									id="form-producto-monedero_electronico"
									variant="outlined"
									/* value="" */
									/* helperText="Incorrect entry." */
									/* onChange={obtenerCampos} */
								/>
							</Box>
						</div>
						<Box className={classes.formInputFlex}>
							<Typography className={classes.precioTitle}>
								<b>% Utilidad</b>
							</Typography>
							<RegistroUtilidades />
						</Box>
						<Box className={classes.formInputFlex}>
							<Typography className={classes.precioTitle}>
								<b>Precio venta neto</b>
							</Typography>
							<RegistroPrecioNeto />
						</Box>
						<Box className={classes.formInputFlex}>
							<Typography className={classes.precioTitle}>
								<b>Unidades por Mayoreo</b>
							</Typography>
							<RegistroPrecioMayoreo />
						</Box>
						<Box className={classes.formInputFlex}>
							<Typography className={classes.precioTitle}>
								<b>Precio venta</b>
							</Typography>
							<MostrarPrecioVenta />
						</Box>
					</Box>
				</div>
			</Container>
		</Fragment>
	);
}
