import React, { Fragment, useContext } from "react";
import { Box, InputAdornment, TextField } from "@material-ui/core";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function DescuentosInputs() {
  const { datosProducto, setDatosProducto, productoOriginal } = useContext(
    ComprasContext
  );
  const { iva, ieps, precio_de_compra } = productoOriginal.precios;
  const { precio_sin_impuesto, precio_con_impuesto } = precio_de_compra;
  const iva_precio_actual = precio_de_compra.iva;
  const ieps_precio_actual = precio_de_compra.ieps;
  const impuesto_actual = iva_precio_actual + ieps_precio_actual;
  const { costo } = datosProducto;
  const PCSI_actual = costo - impuesto_actual;

  const obtenerPorcentaje = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        impuestos_descuento: impuesto_actual,
        descuento_porcentaje: "",
        descuento_precio: "",
        subtotal_descuento: precio_sin_impuesto,
        total_descuento: precio_con_impuesto,
      });
      return;
    }
    let porcentaje = parseFloat(value);
    let cantidad_descontada = Math.round((PCSI_actual * porcentaje) / 100);

    let subtotal_con_descuento = PCSI_actual - cantidad_descontada;
    const iva_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    const ieps_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    const impuestos = iva_precio + ieps_precio;

    let total = subtotal_con_descuento + impuestos;

    setDatosProducto({
      ...datosProducto,
      impuestos_descuento: parseFloat(impuestos.toFixed(2)),
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal_con_descuento.toFixed(2)),
      total_descuento: parseFloat(total.toFixed(2)),
    });
  };

  const obtenerPrecio = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        impuestos_descuento: impuesto_actual,
        descuento_porcentaje: "",
        descuento_precio: "",
        subtotal_descuento: precio_sin_impuesto,
        total_descuento: precio_con_impuesto,
      });
      return;
    }
    let cantidad_descontada = parseFloat(value);
    let porcentaje = Math.round((cantidad_descontada / PCSI_actual) * 100);
    let subtotal_con_descuento = PCSI_actual - cantidad_descontada;
    const iva_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    const ieps_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    const impuestos = iva_precio + ieps_precio;
    let total = subtotal_con_descuento + impuestos;

    setDatosProducto({
      ...datosProducto,
      impuestos_descuento: impuestos,
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal_con_descuento.toFixed(2)),
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
