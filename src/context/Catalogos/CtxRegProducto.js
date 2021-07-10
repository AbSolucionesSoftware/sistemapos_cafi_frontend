import React, { createContext, useState } from 'react';

export const RegProductoContext = createContext();

export const RegProductoProvider = ({ children }) => {
	const [ datos_generales, setDatosGenerales ] = useState({});
	const [ precios, setPrecios ] = useState({
		iva_activo: false,
		ieps_activo: '',
		precio_neto: false,
		inventario: {
			inventario_minimo: 0,
			inventario_maximo: 0,
			unidad_de_inventario: ''
		},
		monedero_electronico: 0,
		unidad_de_compra: {
			unidad: '',
			precio: 0,
			cantidad: 0,
			precio_unitario: 0
		},
		precios_producto: [
			{
				numero_precio: 0,
				utilidad: 0,
				precio_neto: 0,
				unidad_mayoreo: 0,
				precio_venta: 0
			}
		],
		unidad_de_venta: [
			{
				unidad_de_venta: '',
				cantidad: 0,
				unidad_principal: false
			}
		]
	});
	const [ almacen_inicial, setAlmacenInicial ] = useState({
		id_almacen: "",
		almacen: "",
		fecha_de_expiracion: "",
	})
	const [ imagenes, setImagenes ] = useState([
			/* {
				url_imagen: '',
				key_imagen: ''
			} */
		]);
	const [ onPreview, setOnPreview ] = useState({ index: '', image: '' });
	const [ validacion, setValidacion ] = useState({ error: false, message: '' });

	return (
		<RegProductoContext.Provider
			value={{
				datos_generales,
				setDatosGenerales,
				precios,
				setPrecios,
				almacen_inicial, 
				setAlmacenInicial,
				imagenes,
				setImagenes,
				onPreview,
				setOnPreview,
				validacion,
				setValidacion
			}}
		>
			{children}
		</RegProductoContext.Provider>
	);
};
