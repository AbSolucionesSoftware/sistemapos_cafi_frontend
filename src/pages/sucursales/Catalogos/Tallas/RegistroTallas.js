import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaTallas from './ListaTallas';

export default function RegistroTallas({tipo}) {
	return (
		<Box>
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					/* error */
					id="outlined-error-helper-text"
					label={tipo === "ropa" ? "Talla" : "Número"}
					defaultValue={tipo === "ropa" ? "XXL" : "27"}
					/* helperText="Incorrect entry." */
					variant="outlined"
					size="small"
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<TablaTallas tipo={tipo} />
		</Box>
	);
}
