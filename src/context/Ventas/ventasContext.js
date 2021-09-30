import React, { createContext, useState } from 'react';

export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {

    const [datosProducto, setDatosProducto] = useState({
        producto: {},
        costo: 0,
        cantidad: 0,
        descuento_porcentaje: 0,
        descuento_precio: 0,
        subtotal: 0,
    });

    const [datosCompra, setDatosCompra] = useState({
        productos: [],
        proveedor: {},
        fecha_compra: '',
        almacen: {},
        subtotal: 0,
        impuestos: 0,
        total: 0
    });

    const [productosCompra, setProductosCompra] = useState([]);

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ alert, setAlert ] = useState({ message: "", status: "", open: false });

	return (
		<VentasContext.Provider value={
            { 
                alert, 
                setAlert,
                update,
                setUpdate,
                error,
                setError,
                datosProducto,
                setDatosProducto,
                datosCompra,
                setDatosCompra,
                productosCompra,
                setProductosCompra
            }
        }>
			{children}
		</VentasContext.Provider>
	);
};