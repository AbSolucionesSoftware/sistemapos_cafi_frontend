import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import Cajas from './Cajas/Cajas';


export default function Reportes() {

	return (
		<Container>
			<Grid container spacing={3} justify="center" >
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<Cajas />
					</Box>
				</Grid>
				 
			</Grid>
		</Container>
	);
}