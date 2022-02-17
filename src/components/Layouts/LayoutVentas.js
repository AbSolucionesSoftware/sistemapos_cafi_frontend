import React from 'react';
import NavegacionVentas from '../Navegaciones/NavegacionVentas';
import NavegacionVentasLateral from '../Navegaciones/NavegacionVentasLateral';
import { Grid, Box } from '@material-ui/core';
import { VentasProvider } from '../../context/Ventas/ventasContext';
import VentaIndex from '../../pages/ventas/venta_index';

export default function LayoutVentas(props) {
    const sesion = localStorage.getItem("sesionCafi");

    if(!sesion) props.history.push('/');

	return (
		<Box height='100vh'>
			<VentasProvider>
				<Grid lg={12} style={{height: '10vh'}}>
					<NavegacionVentas />
				</Grid>
				<Grid container style={{height: '90vh'}}>
					<Grid lg={9}>
						<VentaIndex />
					</Grid>
					<Grid lg={3}>
						<NavegacionVentasLateral />
					</Grid>
				</Grid>
			</VentasProvider>
		</Box>
	);
}