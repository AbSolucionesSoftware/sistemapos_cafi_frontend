import React, {useEffect, useState, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {} from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EliminarProductoVenta from './EliminarProductoVenta';


const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '52vh'
	}
});

export default function TablaVentas({ newProductoVentas }) {
	const classes = useStyles();
	const [datosTabla, setDatosTabla] = useState([])

	useEffect(() => {
		const venta = JSON.parse(localStorage.getItem("DatosVentas"));
		setDatosTabla(venta === null ? [] : venta.produtos)
	}, [newProductoVentas])

	return (
		
			<Paper className={classes.root}>
				<TableContainer className={classes.container}>
					<Table stickyHeader size="small" aria-label="a dense table">
						<TableHead>
						<TableRow>
							<TableCell style={{ width: 25 }}>Cantidad</TableCell>
							<TableCell style={{ width: 330 }}>Descripcion</TableCell>
							<TableCell style={{ width: 100 }}>Existencias</TableCell>
							<TableCell style={{ width: 100 }}>% Desc</TableCell>
							<TableCell style={{ width: 100 }}>U. Venta</TableCell>
							<TableCell style={{ width: 100 }}>Precio U</TableCell>
							<TableCell key={1} align='center' style={{ width: 35 }}>
								Eliminar
							</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{datosTabla
								.map((producto, index) => {
									return (
										<RenderTableRows
											key={index}
											producto={producto}
											// productosRefetch={productosRefetch}
										/>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
	);
}


const RenderTableRows = ({ producto, productosRefetch }) => {

	return (
		<Fragment>
			<TableRow hover>
				<TableCell>{producto.cantidad_venta}</TableCell>
				<TableCell>{producto.id_producto.datos_generales.nombre_comercial}</TableCell>
				<TableCell>
					{producto.inventario_general.map(existencia => `${existencia.cantidad_existente}`)}
				</TableCell>
				<TableCell>% {producto.descuento_activo === true ? producto.descuento.porciento : 0}</TableCell>
				<TableCell>
					{producto.inventario_general.map(existencia => `${existencia.unidad_inventario}`)}
				</TableCell>
				<TableCell>$ {producto.precio}</TableCell>
				<TableCell>
					<EliminarProductoVenta />
				</TableCell>
			</TableRow>
			
		</Fragment>
	);
};