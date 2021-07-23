import React from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import Depositos from './Depositos/Depositos';
import Retiros from './Retiros/Retiros';
import Egresos from './Egresos/Egresos';
import AbonosProveedores from './AbonoProveedores/AbonosProovedores';
import AbonosClientes from './AbonoClientes/AbonosClientes';
import Transferencias from './Transferencias/Transferencias';

export default function Tesoreria() {

	return (
		<Container>
			<Grid container spacing={2} justify="center">
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Depositos />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Retiros />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Egresos />
					</Box>
				</Grid>
                <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<AbonosProveedores />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<AbonosClientes />
					</Box>
				</Grid>
                <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Transferencias />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
