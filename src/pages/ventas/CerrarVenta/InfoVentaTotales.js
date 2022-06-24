import React, { Fragment } from "react";

import { Box, Grid, Typography } from "@material-ui/core";
import { FcBusinessman, FcSalesPerformance } from "react-icons/fc";
import { formatoMexico } from "../../../config/reuserFunctions";

export default function InfoTotalesVenta({
  montos,
  totales,
  datosCliente,
  monedero,
  monederoTotal,
}) {
  return (
    <Fragment>
      <Grid item md={5} xs={12}>
        <Box display="flex">
          <Box display="flex" alignItems={"center"} mr={2}>
            <Box mt={0.5} mr={0.5}>
              <FcBusinessman style={{ fontSize: 19 }} />
            </Box>
            <Typography variant="subtitle1">
              <b>Cliente:</b>
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            {datosCliente.nombre_cliente
              ? datosCliente.nombre_cliente
              : "Público General"}
          </Typography>
        </Box>
        <Box display="flex">
          <Box display="flex" alignItems={"center"} mr={2}>
            <Box mt={0.5} mr={0.5}>
              <FcSalesPerformance style={{ fontSize: 19 }} />
            </Box>
            <Typography variant="subtitle1">
              <b>Dinero electrónico a generar:</b>
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            ${monedero ? formatoMexico(monedero) : 0.0}
          </Typography>
        </Box>
        <Box display="flex">
          <Box display="flex" alignItems={"center"} mr={2}>
            <Box mt={0.5} mr={0.5}>
              <FcSalesPerformance style={{ fontSize: 19 }} />
            </Box>
            <Typography variant="subtitle1">
              <b>Dinero electrónico disponible:</b>
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            $
            {!datosCliente.monedero_electronico
              ? 0.0
              : formatoMexico(
                  datosCliente.monedero_electronico - montos.puntos
                )}
          </Typography>
        </Box>
        <Box display="flex">
          <Box display="flex" alignItems={"center"} mr={2}>
            <Box mt={0.5} mr={0.5}>
              <FcSalesPerformance style={{ fontSize: 19 }} />
            </Box>
            <Typography variant="subtitle1">
              <b>Total puntos que tendrá:</b>
            </Typography>
          </Box>
          <Typography variant="subtitle1">
            $
            {monederoTotal ? formatoMexico(monederoTotal - montos.puntos) : 0.0}
          </Typography>
        </Box>
      </Grid>
      <Grid item md={5} xs={12}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography style={{ fontSize: "17px" }}>
            <b>Monto pagado:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">
            $ {formatoMexico(totales.monto_pagado)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: "17px" }}>
            <b>Subtotal:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">
            $ {formatoMexico(totales.subtotal)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: "17px" }}>
            <b>Impuestos:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">
            $ {formatoMexico(totales.impuestos)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: "17px" }}>
            <b>Total:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">$ {formatoMexico(totales.total)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: "17px" }}>
            <b>Descuento:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">
            $ {totales.descuento ? formatoMexico(totales.descuento) : 0}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography align="left" style={{ fontSize: "17px" }}>
            <b>Cambio:</b>
          </Typography>
          <Box mx={1} />
          <Typography variant="h6">
            $ {totales.cambio ? formatoMexico(totales.cambio) : 0}
          </Typography>
        </Box>
      </Grid>
    </Fragment>
  );
}
