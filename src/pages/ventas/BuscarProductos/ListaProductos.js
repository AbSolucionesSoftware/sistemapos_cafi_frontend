import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, CircularProgress } from '@material-ui/core';

const columns = [
	{ id: 'clave', label: 'Clave', minWidth: 40, align: 'center' },
	{ id: 'codigo', label: 'C. Barras', minWidth: 40, align: 'center' },
	{ id: 'descripcion', label: 'Nombre/Descrip.', minWidth: 330 },
	{ id: 'existencia', label: 'Exist.', minWidth: 30, align: 'center'},
	{ id: 'unidad', label: 'Unidad', minWidth: 30, align: 'center'},
	{ id: 'precio', label: 'Precio', minWidth: 30, align: 'center'},
];

const useStyles = makeStyles({
	root: {
		width: '100%',
		marginTop: 15
	},
	container: {
		height: '40vh'
	}
});

export default function ListaProductos({
	productosBusqueda, 
	setProductoSeleccionado, 
	loading
}) {

	const classes = useStyles();

	if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{productosBusqueda.map((producto) => {
							return (
								<RowsProductos 
									producto={producto}
									setProductoSeleccionado={setProductoSeleccionado}
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

function RowsProductos({producto, setProductoSeleccionado}) {

	return(
		<>
			<TableRow 
				hover 
				role="checkbox" 
				tabIndex={-1} 
				key={producto._id}
				onClick={() => setProductoSeleccionado(producto)}
			>
				<TableCell align="center" >
					{producto.id_producto.datos_generales.clave_alterna}
				</TableCell>
				<TableCell align="center">
					{producto.id_producto.datos_generales.codigo_barras}
				</TableCell>
				<TableCell >
					{producto.id_producto.datos_generales.nombre_comercial}
				</TableCell>
				<TableCell align="center">
					{producto.cantidad}
				</TableCell>
				<TableCell align="center">
					{producto.unidad}
				</TableCell>
				<TableCell align="center">
					{producto.precio}
				</TableCell>
			</TableRow>
		</>	
	);
	
}