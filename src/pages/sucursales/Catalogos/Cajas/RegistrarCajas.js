import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaCajas from './ListaCajas';

export default function RegistroCajas() {
	return (
		<Box>
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					/* error */
					id="outlined-error-helper-text"
					label="Nombre caja"
					defaultValue="caja 1"
					/* helperText="Incorrect entry." */
					variant="outlined"
					size="small"
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<TablaCajas />
		</Box>
	);
}
