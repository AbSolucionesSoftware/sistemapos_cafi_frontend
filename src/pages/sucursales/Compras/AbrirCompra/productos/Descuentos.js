import React, { Fragment, useContext } from "react";
import { Box, InputAdornment, TextField } from "@material-ui/core";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function DescuentosInputs() {
  const { datosProducto, setDatosProducto, productoOriginal } = useContext(
    ComprasContext
  );
  const {
    precio_sin_impuesto,
    precio_con_impuesto,
    iva,
    ieps,
  } = productoOriginal.precios.precio_de_compra;
  const impuestos = iva + ieps;

  const obtenerPorcentaje = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        descuento_porcentaje: "",
        descuento_precio: "",
        subtotal_descuento: precio_sin_impuesto,
        total_descuento: precio_con_impuesto,
      });
      return;
    }
    let porcentaje = parseFloat(value);
    let cantidad_descontada = Math.round(
      (datosProducto.subtotal * porcentaje) / 100
    );
    let subtotal = datosProducto.subtotal - cantidad_descontada;
    let total = subtotal + impuestos;

    setDatosProducto({
      ...datosProducto,
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal.toFixed(2)),
      total_descuento: parseFloat(total.toFixed(2)),
    });
  };

  const obtenerPrecio = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        descuento_porcentaje: "",
        descuento_precio: "",
        subtotal_descuento: precio_sin_impuesto,
        total_descuento: precio_con_impuesto,
      });
      return;
    }
    let cantidad_descontada = parseFloat(value);

    let porcentaje = Math.round(
      (cantidad_descontada / datosProducto.subtotal) * 100
    );
    /* let descuento_porcentaje = 100 - porcentaje; */
    /* let total = datosProducto.total - cantidad_descontada; */
    let subtotal = datosProducto.subtotal - cantidad_descontada;
    let total = subtotal + impuestos;

    setDatosProducto({
      ...datosProducto,
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal.toFixed(2)),
      total_descuento: parseFloat(total.toFixed(2)),
    });
  };

  return (
    <Fragment>
      <Box display="flex" width={160}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          inputMode="numeric"
          onChange={(e) => obtenerPrecio(e.target.value)}
          disabled={!datosProducto.producto.datos_generales}
          value={datosProducto.descuento_precio}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <Box mr={1} />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          inputMode="numeric"
          onChange={(e) => obtenerPorcentaje(e.target.value)}
          disabled={!datosProducto.producto.datos_generales}
          value={datosProducto.descuento_porcentaje}
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
        />
      </Box>
    </Fragment>
  );
}
