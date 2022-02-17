import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import RegistroAlmacen from './RegistroAlmacen/RegistroAlmacen';
import Traspasos from './Traspasos/Traspasos';
import InventariosPorAlmacen from './InventarioPorAlmacen/InventariosPorAlmacen';
import { TraspasosProvider } from "../../../context/Almacenes/traspasosAlmacen";

export default function Moviminetos() {

	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	return (
		<Container>
			<Grid container spacing={3} justify="center" >
			{sesion.accesos.almacenes.almacen.ver === false ? (null):(
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<RegistroAlmacen />
					</Box>
				</Grid>
			)}
			{sesion.accesos.almacenes.traspasos.ver === false ? (null):(
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<TraspasosProvider>
							<Traspasos />
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			{sesion.accesos.almacenes.inventario_almacen.ver === false ? (null):(
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<TraspasosProvider>
							<InventariosPorAlmacen />
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			</Grid>
		</Container>
	);
}
