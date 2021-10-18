import React, { forwardRef, Fragment, useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { CircularProgress, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

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

	const handleToggleModal = () => setOpen(!open);

	const eliminarProductoBD = async () => {
		console.log(producto);
		let venta = JSON.parse(localStorage.getItem("DatosVentas"));
		let productosVentas = venta === null ? [] : venta.produtos;
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
				}
			: venta;

		const producto_encontrado = await findProductArray(
			productosVentas,
			producto
		);
		if (producto_encontrado.found) {
			const { cantidad_venta, ...newP } = producto;
			//Sacar los impuestos que se van a restar
			let calculoResta = await calculatePrices(newP, cantidad_venta, newP.granelProducto);
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
			  };
			  localStorage.setItem("DatosVentas", JSON.stringify({
				...CalculosData,
				cliente: venta_actual.venta_cliente === true ? venta_actual.cliente : {},
				venta_cliente: venta_actual.venta_cliente === true ? venta_actual.venta_cliente : false,
				produtos: productosVentasTemp,
			  }));
			  setDatosVentasActual(CalculosData);
			  //Recargar la tabla de los productos
			  setNewProductoVentas(!newProductoVentas);
		}
		
	};

	return (
		<Fragment>
			{/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}
			<IconButton onClick={() => handleToggleModal()}>
				<Delete color="error" />
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
