import React, { createContext, useState } from 'react';

export const VentasContext = createContext();

export const VentasProvider = ({children}) => {

    const [datosProducto, setDatosProducto] = useState(
        {
            producto: {},
            costo: 0,
            cantidad: 0,
            descuento_porcentaje: 0,
            descuento_precio: 0,
            subtotal: 0,
            impuestos: 0,
            total: 0
         }
    );
    
    const [productosCompra, setProductosCompra] = useState([]);

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


    return (
        <VentasContext 
            value={
                {
                    datosProducto,
                    setDatosProducto
                    
                }
            }
        >
            {children}
        </VentasContext>
    );
};

