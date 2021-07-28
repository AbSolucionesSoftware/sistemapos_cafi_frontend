import React, { Fragment, useContext } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@material-ui/core';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';

export default function RegistroUtilidades() {
	const { precios, setPrecios, validacion } = useContext(RegProductoContext);

	const obtenerUtilidad = (e) => {
		setPrecios({
			...precios,
			precios_producto: [{ ...precios.precios_producto, [e.target.name]: parseInt(e.target.value) }]
		});
	}

	return (
		<Fragment>
			
			<Box width="100px">
				<Typography>Precio 1</Typography>
				<Box mb={1} />
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
				<Typography>Precio 2</Typography>
				<Box mb={1} />
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
				<Typography>Precio 3</Typography>
				<Box mb={1} />
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
				<Typography>Precio 4</Typography>
				<Box mb={1} />
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
				<Typography>Precio 5</Typography>
				<Box mb={1} />
				<TextField
					fullWidth
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
				<Typography>Precio 6</Typography>
				<Box mb={1} />
				<TextField
					type="number"
					InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
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
