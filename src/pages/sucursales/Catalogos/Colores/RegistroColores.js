import React, { useState } from 'react';
import { Box, Button, Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaColores from './ListaColores';
import { SketchPicker } from 'react-color';

export default function RegistroColores() {
	const [ color, setColor ] = useState({});

	const handleChangeComplete = (color) => {
		setColor(color);
	};
	return (
		<Box display="flex" justifyContent="center">
			<Grid container spacing={2}>
				<Grid item md={7}>
					<TablaColores />
				</Grid>
				<Grid item md={5}>
					<SketchPicker color={color} onChangeComplete={handleChangeComplete} />
					<Box mt={1} display="flex" justifyContent="center" width="100%">
                        <Button color="primary" variant="contained" size="large" fullWidth>
						    <Add />Guardar
					    </Button>
                    </Box>
				</Grid>
			</Grid>
		</Box>
	);
}
