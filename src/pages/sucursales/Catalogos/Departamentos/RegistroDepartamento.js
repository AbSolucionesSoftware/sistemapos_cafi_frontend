import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaDepartamentos from './ListaDepartamentos';

export default function RegistroDepartamentos() {
	return (
		<Box>
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					/* error */
					id="outlined-error-helper-text"
					label="Nombre departamento"
					defaultValue="Departament de embutidos"
					/* helperText="Incorrect entry." */
					variant="outlined"
					size="small"
                    fullWidth
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<TablaDepartamentos />
		</Box>
	);
}
