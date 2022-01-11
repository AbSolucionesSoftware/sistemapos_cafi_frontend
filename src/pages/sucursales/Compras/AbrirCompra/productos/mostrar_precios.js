import { Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function MostrarPrecios() {
  const { datosProducto } = useContext(ComprasContext);
  const { presentaciones } = useContext(RegProductoContext);

  if (presentaciones.length > 0) {
    let cantida_suma = 0;
    let cantidad_total = 0;
    presentaciones.forEach((presentacion) => {
      const { cantidad, cantidad_nueva } = presentacion;
      let nueva = cantidad_nueva ? cantidad_nueva : 0;

      cantida_suma += cantidad + nueva;
    });
    if (isNaN(cantida_suma)) cantidad_total = 0;
    cantidad_total = cantida_suma; 

    return (
      <Grid container spacing={2}>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Subtotal:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>${formatoMexico(datosProducto.subtotal_descuento * cantidad_total)}</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Impuestos:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>${formatoMexico(datosProducto.impuestos * cantidad_total)}</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Descuento:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>{datosProducto.descuento_porcentaje}%</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Total:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>
              $
              {formatoMexico(
                datosProducto.total_descuento * cantidad_total
              )}
            </b>
          </Typography>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={2}>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Subtotal:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>${formatoMexico(datosProducto.subtotal_descuento * datosProducto.cantidad)}</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Impuestos:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>${formatoMexico(datosProducto.impuestos * datosProducto.cantidad)}</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Descuento:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>{datosProducto.descuento_porcentaje}%</b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 16 }}>Total:</Typography>
          <Typography style={{ fontSize: 18 }}>
            <b>
              $
              {formatoMexico(
                datosProducto.total_descuento * datosProducto.cantidad
              )}
            </b>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
