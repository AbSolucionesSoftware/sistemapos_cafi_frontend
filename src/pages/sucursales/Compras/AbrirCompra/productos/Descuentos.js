import React, { Fragment, useContext } from "react";
import { Box, InputAdornment, TextField } from "@material-ui/core";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function DescuentosInputs() {
  const { datosProducto, setDatosProducto } = useContext(ComprasContext);

  const obtenerPorcentaje = (value) => {
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        descuento_porcentaje: "",
        descuento_precio: "",
        total_con_descuento: datosProducto.total,
      });
      return;
    }
    /* let porcentaje = 100 - value; */
    let descuento_precio = Math.round((datosProducto.total * value) / 100);
    let total = datosProducto.total - descuento_precio;
    setDatosProducto({
      ...datosProducto,
      descuento_porcentaje: parseFloat(value),
      descuento_precio: parseFloat(descuento_precio),
      total_con_descuento: parseFloat(total),
    });
  };

  const obtenerPrecio = (value) => {
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        descuento_porcentaje: "",
        descuento_precio: "",
        total_con_descuento: datosProducto.total,
      });
      return;
    }
    let porcentaje = Math.round((value / datosProducto.total) * 100);
    /* let descuento_porcentaje = 100 - porcentaje; */
    let total = datosProducto.total - value;

    setDatosProducto({
      ...datosProducto,
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(value),
      total_con_descuento: parseFloat(total),
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
