import React, { createContext, useState } from 'react';

export const RegProductoContext = createContext();

export const RegProductoProvider = ({ children }) => {
	const [datos_generales, setDatosGenerales] = useState({});
	const [precios, setPrecios] = useState({
		iva_activo: true,
		ieps_activo: false,
		ieps: 0,
		iva: 16,
		inventario: {
			inventario_minimo: 0,
			inventario_maximo: 0,
			unidad_de_inventario: 'PIEZAS',
		},
		precio_de_compra: {
			precio_con_impuesto: 0,
			precio_sin_impuesto: 0,
			iva: 0,
			ieps: 0
		},
		unidad_de_compra: {
			unidad: "PIEZAS",
			cantidad: 1,
			precio_unitario_sin_impuesto: 0,
			precio_unitario_con_impuesto: 0,

		},
		unidad_de_venta: []
	});

	const preciosP = [
		{
			numero_precio: 1,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		},
		{
			numero_precio: 2,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		},
		{
			numero_precio: 3,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		},
		{
			numero_precio: 4,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		},
		{
			numero_precio: 5,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		},
		{
			numero_precio: 6,
			utilidad: 0,
			precio_neto: 0,
			unidad_mayoreo: 0,
			precio_venta: 0
		}
	]

	const [unidadesVenta, setUnidadesVenta] = useState([]);

	const [almacen_inicial, setAlmacenInicial] = useState({
		id_almacen: "",
		almacen: "",
		cantidad: 0,
		fecha_de_expiracion: "",
	})
	const [ centro_de_costos, setCentroDeCostos ] = useState({
		id_cuenta: '',
		cuenta: '',
		id_sub_cuenta: '',
		sub_cuenta: '',
	})
	const [imagenes, setImagenes] = useState([]);
	const [onPreview, setOnPreview] = useState({ index: '', image: '' });
	const [validacion, setValidacion] = useState({ error: false, message: '' });

	return (
		<RegProductoContext.Provider
			value={{
				datos_generales, setDatosGenerales,
				precios, setPrecios,
				almacen_inicial, setAlmacenInicial,
				imagenes, setImagenes,
				onPreview, setOnPreview,
				validacion, setValidacion,
				preciosP,
				unidadesVenta, setUnidadesVenta,
				centro_de_costos, setCentroDeCostos,
			}}
		>
			{children}
		</RegProductoContext.Provider>
	);
};
