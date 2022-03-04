import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import RegistroAlmacen from './RegistroAlmacen/RegistroAlmacen';
import Traspasos from './Traspasos/Traspasos';
import { useQuery } from '@apollo/client';
import InventariosPorAlmacen from './InventarioPorAlmacen/InventariosPorAlmacen';
import { TraspasosProvider } from "../../../context/Almacenes/traspasosAlmacen";
import { OBTENER_PRODUCTOS_ALMACEN } from '../../../gql/Almacenes/Almacen';
export default function Almacenes() {

	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro: ''
		},
		fetchPolicy: "network-only"
	});
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
							<Traspasos refetch={productosAlmacenQuery.refetch} />
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			{sesion.accesos.almacenes.inventario_almacen.ver === false ? (null):(
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<TraspasosProvider>
							<InventariosPorAlmacen productosAlmacenQuery={productosAlmacenQuery}  />
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			</Grid>
		</Container>
	);
}
