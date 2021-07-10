import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Checkbox, FormControlLabel, TextField, MenuItem, Container } from '@material-ui/core';
import { Typography, Divider, FormControl, Select } from '@material-ui/core';

import RegistroUtilidades from './utilidades';
import MostrarPrecioVenta from './precioVenta';
import RegistroPrecioNeto from './precioNeto';
import RegistroPrecioMayoreo from './precioMayoreo';
import { Grid } from '@material-ui/core';
import PreciosDeCompra from './preciosCompra';

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
				<Box display="flex">
					<Box>
						<Typography>
							<b>Impuestos</b>
						</Typography>
						<FormControlLabel
							control={
								<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
							}
							label="IVA"
						/>
						<FormControlLabel
							control={
								<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
							}
							label="IEPS"
						/>
					</Box>
					<Box className={classes.formInputFlex}>
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
						<Box width="150px">
							<Typography>Unidad de inventario</Typography>
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
						<FormControlLabel
							control={
								<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="granel" />
							}
							label="Vender a granel"
						/>
					</Box>
				</Box>
				<Box>
					<Box width="230px">
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
				</Box>
			</Box>
			<Divider />
			<Container maxWidth="lg">
				<Grid container spacing={3}>
					<Grid item lg={8}>
						<Box>
							<div className={classes.formInputFlex}>
								<Box width="140px">
									<FormControlLabel
										control={
											<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
										}
										label="Precio neto"
									/>
								</Box>

								<Box width="150px">
									<Typography>Unidad de compra</Typography>
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
									<Typography>Precio de compra</Typography>
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
									<Typography>Cantidad</Typography>
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
								<Box width="150px">
									<Typography align="center">Precio unitario</Typography>
									<Typography align="center">
										<b> 0.0</b>
									</Typography>
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
					</Grid>
					<Grid item lg={4}>
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
