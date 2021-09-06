import React, { Fragment } from 'react';
import { Grid, Box, TextField, Typography, Paper, Button } from '@material-ui/core';
import { MenuItem, Select, InputLabel, FormControl, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RegistroProvedor from '../proveedor/RegistroProvedor';
import RegistroAlmacen from '../almacen/RegistroAlmacen';

import PreciosProductos from './PreciosProductos';
import RegistroProducto from './RegistroProducto';

import { top100Films } from './peliculastest';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px 0px`
		},
		paddingTop: 3,
		alignItems: 'center',
		justifyItems: 'center'
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function DatosProducto() {
	const classes = useStyles();

	return (
		<Fragment>
			<Grid container spacing={3}>
				<Grid item lg={4}>
					<div className={classes.formInputFlex}>
						<Autocomplete
							id="combo-box-demo"
							size="small"
							fullWidth
							options={top100Films}
							getOptionLabel={(option) => option.title}
							renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
						/>
						<RegistroProducto />
					</div>
					<div className={classes.formInputFlex}>
						<FormControl variant="outlined" fullWidth size="small">
							<InputLabel id="lista-proveedores-select">Elige tu proveedor</InputLabel>
							<Select
								id="form-proveedor"
								/* value={age} */ /* onChange={handleChange} */ labelId="lista-proveedores-select"
								label="Elige tu proveedor"
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value="proveedor 1">proveedor 1</MenuItem>
							</Select>
						</FormControl>
						<RegistroProvedor />
					</div>
					<div className={classes.formInputFlex}>
						<FormControl variant="outlined" fullWidth size="small">
							<InputLabel id="lista-almacenes-select">Elige el almacen inicial</InputLabel>
							<Select
								id="form-almacenes"
								/* value={age} */ /* onChange={handleChange} */ labelId="lista-almacenes-select"
								label="Elige el almacen inicial"
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value="Almacen 1">Almacen 1</MenuItem>
							</Select>
						</FormControl>
						<RegistroAlmacen />
					</div>
				</Grid>
				<Grid item lg={2}>
					<Box height="200px" display="flex" justifyContent="center" alignItems="center">
						<img
							alr="imagen producto"
							src="https://www.dportenis.mx/wcsstore/ExtendedSitesCatalogAssetStore/images/catalog/zoom/1016287-0001V1.jpg"
							style={{ maxWidth: '100%', maxHeight: '100%' }}
						/>
					</Box>
				</Grid>
				<Grid item lg={6}>
					<Grid container spacing={3}>
						<Grid item>
							<Typography>
								Código de barras: <b>a23232322323</b>
							</Typography>
							<Typography>
								Nombre comercial: <b>Tenis nike</b>
							</Typography>
							<Typography>
								Impuestos: <b>IVA: 16%</b> <b>IEPS: 0%</b>
							</Typography>
							<Typography>
								Unidad de compra: <b>PZ</b>
							</Typography>
						</Grid>
						<Grid item>
							<Typography>
								Precio de compra con impuestos: <b>$2,500</b>
							</Typography>
							<Typography>
								Precio de compra con impuestos: <b>$3,100</b>
							</Typography>
							<Typography>
								Precio de venta: <b>$3,100</b>
							</Typography>
							<Typography>
								Precio de venta NETO: <b>$3,600</b>
							</Typography>
						</Grid>
					</Grid>
					<Box>
						<PreciosProductos />
						<Button size="large" variant="contained" color="primary" startIcon={<Add />}>
							Agregar compra a la lista
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	);
}
