import React, { Fragment } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';

export default function RegistroUtilidades() {
	return (
		<Fragment>
			<Box width="100px">
				<Typography>Precio 1</Typography>
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<Typography>Precio 2</Typography>
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<Typography>Precio 3</Typography>
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<Typography>Precio 4</Typography>
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<Typography>Precio 5</Typography>
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<Typography>Precio 6</Typography>
				<TextField
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					fullWidth
					size="small"
					/* error */
					name="unidad_de_venta"
					id="form-producto-nombre-generico"
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
		</Fragment>
	);
}
