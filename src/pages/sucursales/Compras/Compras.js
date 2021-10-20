import React from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import AbrirCompra from './AbrirCompra/AbrirCompra';
import ComprasRealizadas from './ComprasRealizadas/ComprasRealizadas';
/* import CargaMasiva from './CargaMasiva/CargaMasiva'; */
import ComprasEnEspera from './ComprasEnEspera/ComprasEnEspera';


export default function Compras() {

	return (
		<Container maxWidth="md">
			<Grid container spacing={3} justify="center">
				<Grid item md={4}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<AbrirCompra />
					</Box>
				</Grid>
				<Grid item md={4}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<ComprasRealizadas />
					</Box>
				</Grid>
				{/* <Grid item md={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<CargaMasiva />
					</Box>
				</Grid> */}
                <Grid item md={4}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<ComprasEnEspera />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
