import React, { forwardRef, Fragment, useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { VentasContext } from '../../context/Ventas/ventasContext';

import {findProductArray, calculatePrices } from '../../config/reuserFunctions';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProducto({ 
	producto,
	setNewProductoVentas,
	newProductoVentas,
	setDatosVentasActual
 }) {
	const [ open, setOpen ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	/* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */

	const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);

	const handleToggleModal = () => setOpen(!open);

	const eliminarProductoBD = async () => {
		// console.log(producto);
		let venta = JSON.parse(localStorage.getItem("DatosVentas"));
		let productosVentas = venta === null ? [] : venta.productos;
		const venta_actual = venta === null ? [] : venta;
		let productosVentasTemp = productosVentas;
		let venta_existente =
			venta === null
			? 
				{
					subTotal: 0,
					total: 0,
					impuestos: 0,
					iva: 0,
					ieps: 0,
					descuento: 0,
					monedero: 0
				}
			: venta;

		const producto_encontrado = await findProductArray(
			productosVentas,
			producto
		);
		if (producto_encontrado.found) {
			const { cantidad_venta, ...newP } = producto;
			// newP.precio_actual_producto = newP.descuento_activo ? newP.descuento.precio_con_descuento :  newP.precio;
			//Sacar los impuestos que se van a restar
			let calculoResta = await calculatePrices(newP, cantidad_venta, newP.granel_producto, newP.precio_actual_producto);
			productosVentasTemp.splice(
				producto_encontrado.producto_found.index,
				1
			);
			const CalculosData = {
				subTotal: 
				  parseFloat(venta_existente.subTotal) -
				  parseFloat(calculoResta.subtotalCalculo) ,
				total: 
				  parseFloat(venta_existente.total) -
				  parseFloat(calculoResta.totalCalculo),
				impuestos: 
				  parseFloat(venta_existente.impuestos) -
				  parseFloat(calculoResta.impuestoCalculo),
				iva: 
				  parseFloat(venta_existente.iva) -
				  parseFloat(calculoResta.ivaCalculo),
				ieps: 
				  parseFloat(venta_existente.ieps) -
				  parseFloat(calculoResta.iepsCalculo),
				descuento: 
				  parseFloat(venta_existente.descuento) -
				  parseFloat(calculoResta.descuentoCalculo),
				monedero: 
				  parseFloat(venta_existente.monedero) -
				  parseFloat(calculoResta.monederoCalculo),
			  };
			  localStorage.setItem("DatosVentas", JSON.stringify({
				...CalculosData,
				cliente: venta_actual.venta_cliente === true ? venta_actual.cliente : {},
				venta_cliente: venta_actual.venta_cliente === true ? venta_actual.venta_cliente : false,
				productos: productosVentasTemp,
			  }));
			  setDatosVentasActual(CalculosData);
			  //Recargar la tabla de los productos
			//   setNewProductoVentas(!newProductoVentas);
			  setUpdateTablaVentas(!updateTablaVentas);
		}
		
	};

	return (
		<Fragment>
			{/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}
			<IconButton size="small" onClick={() => handleToggleModal()}>
				<Delete size="small" color="error" />
			</IconButton>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => handleToggleModal()}
				aria-labelledby="alert-dialog-delete-producto"
			>
				<DialogTitle id="alert-dialog-delete-producto">
					{'¿Estás seguro de eliminar este producto?'}
				</DialogTitle>
				<DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => handleToggleModal()} color="inherit">
						Cancelar
					</Button>
					<Button onClick={() => eliminarProductoBD()} color="secondary" startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
