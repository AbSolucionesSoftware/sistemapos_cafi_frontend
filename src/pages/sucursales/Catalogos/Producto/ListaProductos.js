import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CrearProducto from './crearProducto';
import DescuentoProductos from './Descuentos/Descuento';
import InfoProductoDrawer from './infoProductoDrawer';
import EliminarProducto from './EliminarProducto';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '70vh'
	},
	avatar: {
		width: 130,
		height: 130
	}
});

export default function ListaProductos({ obtenerProductos, productosRefetch }) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>Codigo barras</TableCell>
							<TableCell>Clave alterna</TableCell>
							<TableCell>Nombre comercial</TableCell>
							<TableCell>Nombre genérico</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Existencia</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Información</TableCell>
							<TableCell>Editar</TableCell>
							<TableCell>Descuento</TableCell>
							<TableCell>Eliminar</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerProductos
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((producto, index) => {
								return (
									<RenderTableRows
										key={index}
										producto={producto}
										productosRefetch={productosRefetch}
									/>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={obtenerProductos.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const RenderTableRows = ({ producto, productosRefetch }) => {

	return (
		<Fragment>
			<TableRow hover>
				<TableCell>{producto.datos_generales.codigo_barras}</TableCell>
				<TableCell>{producto.datos_generales.clave_alterna}</TableCell>
				<TableCell>{producto.datos_generales.nombre_comercial}</TableCell>
				<TableCell>{producto.datos_generales.nombre_generico}</TableCell>
				<TableCell>{producto.datos_generales.descripcion}</TableCell>
				<TableCell align="center" padding="checkbox">{
					producto.inventario_general.map(existencia => `${existencia.cantidad_existente} ${existencia.unidad_inventario}`)
				}</TableCell>
				<TableCell>{producto.datos_generales.tipo_producto}</TableCell>
				<TableCell align="center" padding="checkbox">
					<InfoProductoDrawer producto={producto} />
				</TableCell>
				<TableCell align="center" padding="checkbox">
					<CrearProducto accion={true} datos={producto} productosRefetch={productosRefetch} />
				</TableCell>
				<TableCell align="center" padding="checkbox">
					<DescuentoProductos datos={producto} productosRefetch={productosRefetch} />
				</TableCell>
				<TableCell align="center" padding="checkbox">
					<EliminarProducto datos={producto} productosRefetch={productosRefetch} />
				</TableCell>
			</TableRow>
			
		</Fragment>
	);
};