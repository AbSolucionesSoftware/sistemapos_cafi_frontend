import React, { Fragment } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';

export default function PreciosCreditos() {
	return (
		<Fragment>
			<Box width="100px">
				<Typography>30 Días </Typography>
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
				<Typography>2 Meses</Typography>
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
				<Typography>6 Meses</Typography>
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
				<Typography>8 Meses</Typography>
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
				<Typography>12 Meses</Typography>
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
				<Typography>18 Meses</Typography>
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
