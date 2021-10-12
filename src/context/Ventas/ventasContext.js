import React, { createContext, useState } from 'react';

export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {

    const [datosProductoVentas, setDatosProductoVentas] = useState(
        {
            _id: null,
            cantidad: null,
            codigo_barras: null,
            concepto: null,
            default: null,
            descuento: null,
            descuento_activo: null,
            id_producto: {},
            precio: null,
            unidad: null,
            unidad_principal: null
        }
    );
    
    const [productosVentas, setProductosVentas] = useState([]);
    const [datosVentas, setDatosVentas] = useState(
        {
            productos: [],
            cliente: {},
            subtotal: 0,
            impuestos: 0,
            total: 0,
            usuario: {}
        }
    );

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
                datosProductoVentas,
                setDatosProductoVentas,
                productosVentas,
                setProductosVentas,
                datosVentas,
                setDatosVentas
            }
        }>
			{children}
		</VentasContext.Provider>
	);
};