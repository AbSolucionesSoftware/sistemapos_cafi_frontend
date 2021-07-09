import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import RegistroAlmacen from './RegistroAlmacen/RegistroAlmacen';
import Traspasos from './Traspasos/Traspasos';
import InventariosPorAlmacen from './InventarioPorAlmacen/InventariosPorAlmacen';

export default function Moviminetos() {

	return (
		<Container>
			<Grid container spacing={3} justify="center" >
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<RegistroAlmacen />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<Traspasos />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<InventariosPorAlmacen />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}