import React, { Fragment } from 'react';
import { Box, TextField } from '@material-ui/core';

export default function RegistroPrecioMayoreo() {
	return (
		<Fragment>
			<Box width="100px">
				{/* <TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					name="precio_neto"
					id="form-producto-nombre-comercial"
					variant="outlined"
				/> */}
			</Box>
			<Box width="100px">
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					/* id="form-producto-nombre-comercial" */
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					/* id="form-producto-nombre-comercial" */
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					/* id="form-producto-nombre-comercial" */
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					size="small"
					/* error */
					name="precio_neto"
					/* id="form-producto-nombre-comercial" */
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
			<Box width="100px">
				<TextField
					type="number"
					InputProps={{ inputProps: { min: 0 } }}
					fullWidth
					size="small"
					/* error */
					name="unidad_de_venta"
					/* id="form-producto-nombre-generico" */
					variant="outlined"
					/* value="" */
					/* helperText="Incorrect entry." */
					/* onChange={obtenerCampos} */
				/>
			</Box>
		</Fragment>
	);
}
