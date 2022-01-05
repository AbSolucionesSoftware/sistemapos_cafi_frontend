import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import Cajas from './Cajas/Cajas';
import ReportesTurnosUsuarios from './TurnosUsuarios/ReportesTurnosUsuarios';
import ReportesCompras from './Compras/ReportesCompras';
import ReportesVentas from './Ventas/ReportesVentas';
import ReportesAlmacen from './Almacenes/ReportesAlmacen';
import ReportesCortes from './Cortes/ReportesCortes';
import ReportesTesoreria from './Tesoreria/Reporte_Tesoreria';

export default function Reportes() {

	return (
		<Container>
			<Grid container spacing={3} justify="center" >
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<Cajas />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesTurnosUsuarios />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesCompras />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesVentas />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesAlmacen />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesCortes />
					</Box>
				</Grid>
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<ReportesTesoreria />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}