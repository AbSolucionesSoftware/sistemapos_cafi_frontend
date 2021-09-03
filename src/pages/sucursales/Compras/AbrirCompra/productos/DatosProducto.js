
import React from 'react';
import { Grid, Box, Container, Button, TextField, Typography, makeStyles, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RegistroProvedor from '../proveedor/RegistroProvedor';

import PreciosProductos from './PreciosProductos';
import RegistroProducto from './RegistroProducto';
import { Search } from '@material-ui/icons';
import { Divider } from '@material-ui/core';

import { top100Films } from './peliculastest'

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		paddingTop: 3,
		alignItems: 'center',
		justifyItems: 'center'
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		width: '100%'
	},
	rootBusqueda: {
		padding: '0px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		height: 40
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
}));

export default function DatosProducto() {
	const classes = useStyles();

	return (
		<Container maxWidth="xl">
			<Grid container>
				<Grid item lg={12}>
					<div className={classes.root}>
						<div className={classes.formInputFlex}>
							<Paper
								component="form"
								variant="outlined"
								className={classes.rootBusqueda}
								onSubmit={(e) => e.preventDefault()}
							>
								<Autocomplete
									id="combo-box-demo"
									size="small"
									options={top100Films}
									getOptionLabel={(option) => option.title}
									className={classes.input}
									renderInput={(params) => (
										<TextField {...params} label="Combo box" variant="outlined" />
									)}
								/>
								<Divider className={classes.divider} orientation="vertical" />
								<RegistroProducto />
							</Paper>

							<RegistroProvedor />
						</div>
					</div>
				</Grid>
			</Grid>

			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Código de barras</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="codigo-producto"
						id="form-codigo-producto"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%">
					<Typography>Producto</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="producto_nombre"
						id="form-producto-nombre"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%">
					<Typography>Cantidad</Typography>
					<TextField
						fullWidth
						type="number"
						size="small"
						/* error */
						name="producto_cantidad"
						id="form-producto-cantidad"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%">
					<Typography>% de descuento</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="producto_descuento"
						id="form-producto-descuento"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>

				<Box width="100%">
					<Typography>Existencias </Typography>
					<Typography>500</Typography>
				</Box>
			</div>
			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Unidad de Compra</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="producto_unidad_compra"
						id="form-producto-unidad-compra"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%">
					<Typography>Unidades por compra</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="unidad_por_compra"
						id="form-producto-unidad-por-compra"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%">
					<Typography>Precio unitario</Typography>
					<Typography>500</Typography>
				</Box>
				<Box width="100%">
					<Typography>Importe</Typography>
					<TextField
						fullWidth
						size="small"
						/* error */
						name="producto_importe"
						id="form-producto-importe"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box width="100%" pt={3}>
					<Button
						fullWidth
						size="large"
						/* error */
						variant="contained"
						color="primary"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					>
						Agregar a compra
					</Button>
				</Box>
			</div>

			<Grid container>
				<Grid item lg={12}>
					<Box p={2}>
						<PreciosProductos />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
