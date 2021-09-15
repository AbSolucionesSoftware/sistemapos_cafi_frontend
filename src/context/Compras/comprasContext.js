import React, { createContext, useState } from "react";

export const ComprasContext = createContext();

export const ComprasProvider = ({ children }) => {
  const [datosProducto, setDatosProducto] = useState({
    producto: {},
    costo: 0,
    cantidad: 0,
    descuento_porcentaje: 0,
    descuento_precio: 0,
    subtotal: 0,
    impuestos: 0,
    total: 0,
	mantener_precio: false,
  });

  const [productosCompra, setProductosCompra] = useState([]);

  const [ datosCompra, setDatosCompra ] = useState({
    productos: [],
	proveedor: {},
	fecha_compra: Date.now(),
	almacen: {},
	subtotal: 0,
	impuestos: 0,
	total: 0
  });


  return (
    <ComprasContext.Provider
      value={{
        datosProducto, 
		setDatosProducto,
        productosCompra,
        setProductosCompra,
		datosCompra, 
		setDatosCompra
      }}
    >
      {children}
    </ComprasContext.Provider>
  );
};
