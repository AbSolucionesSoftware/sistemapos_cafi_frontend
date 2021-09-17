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
    mantener_precio: true,
  });

  const [datosCompra, setDatosCompra] = useState({
    productos: [],
    proveedor: {},
    fecha_compra: Date.now(),
    almacen: {},
    subtotal: 0,
    impuestos: 0,
    total: 0,
  });

  const [preciosVenta, setPreciosVenta] = useState([
    {
      numero_precio: 1,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
    {
      numero_precio: 2,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
    {
      numero_precio: 3,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
    {
      numero_precio: 4,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
    {
      numero_precio: 5,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
    {
      numero_precio: 6,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
    },
  ]);

  const [productoOriginal, setProductoOriginal] = useState();
  const [productosCompra, setProductosCompra] = useState([]);

  return (
    <ComprasContext.Provider
      value={{
        datosProducto,
        setDatosProducto,
        productosCompra,
        setProductosCompra,
        datosCompra,
        setDatosCompra,
        productoOriginal,
        setProductoOriginal,
		preciosVenta, 
		setPreciosVenta
      }}
    >
      {children}
    </ComprasContext.Provider>
  );
};
