import React from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import InformacionFiscal from './InformacionFiscal/InformacionFiscal';
import Datos from './Datos/MisDatos';
import Sucursal from './Sucursal/DatosSucursal';
export default function MiEmpresa() {
	
	
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	
	return (
		<div>
			<Container>
			<Grid container spacing={5} justify="center">
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Sucursal />
					</Box>
				</Grid>
				{sesion.accesos.mi_empresa.datos_empresa.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Datos idEmpresa={sesion.empresa._id} />
						</Box>
					</Grid>
				)}
				{sesion.accesos.mi_empresa.informacion_fiscal.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<InformacionFiscal />
						</Box> 
					</Grid>
				)}
			</Grid>
		</Container>
		</div>
	);
}
