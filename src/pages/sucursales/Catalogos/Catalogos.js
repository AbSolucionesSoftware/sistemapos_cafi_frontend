import React from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import Cliente from './Cliente/Cliente';
import Productos from './Producto/Productos';
import Tallas from './Tallas/Tallas';
import UnidadMedida from './UnidadMedida/UnidadMedida';
import Contabilidad from './Contabilidad/Contabilidad';
import Proveedores from './Proveedores/Proovedores';
/* import Cajas from './Cajas/Cajas'; */
import Descuentos from './Descuentos/Descuentos';
import Usuarios from './Usuarios/Usuarios';
import Departamentos from './Departamentos/Departamentos';
import Categorias from './Categorias/Categorias';
import Colores from './Colores/Colores';

export default function Catalogos() {
	return (
		<Container>
			<Grid container spacing={5} justify="center">
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Cliente />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Productos />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Tallas />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<UnidadMedida />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Contabilidad />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Proveedores />
					</Box>
				</Grid>
				{/* <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Cajas />
					</Box>
				</Grid> */}
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Descuentos />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Usuarios />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Departamentos />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Categorias />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Colores />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
