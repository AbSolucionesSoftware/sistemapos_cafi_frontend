import { Grid } from "@material-ui/core";
import React, { Fragment } from "react";
import Abonos from "../../pages/ventas/Abonos/Abonos";
import BuscarProducto from "../../pages/ventas/BuscarProductos/BuscarProducto";
import ClientesVentas from "../../pages/ventas/ClientesVentas/ClientesVentas";
import Cotizacion from "../../pages/ventas/Cotizacion/Cotizacion";
import AbrirCajon from "../../pages/ventas/Operaciones/AbrirCajon";
import CancelarVenta from "../../pages/ventas/Operaciones/CancelarVenta";
import CerrarVenta from "../../pages/ventas/Operaciones/CerrarVenta";
import ConsultarPrecio from "../../pages/ventas/Operaciones/ConsultarPrecio";
import PreciosProductos from "../../pages/ventas/Operaciones/PreciosProducto";
import VentasEspera from "../../pages/ventas/VentasEspera/VentasEspera";
import VentasRealizadas from "../../pages/ventas/VentasRealizadas/VentasRealizadas";
import useStyles from "./styles";

export default function NavegacionVentasLateral() {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container className={classes.drawerColor}>
        <Grid item lg={6} md={6} xs={6}>
          <CerrarVenta />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <BuscarProducto />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <CancelarVenta />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <Cotizacion type="GENERAR" />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <PreciosProductos />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <VentasEspera />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <ClientesVentas />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <VentasRealizadas />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <ConsultarPrecio />
        </Grid>
        <Grid item lg={6} md={6} xs={6}>
          <Abonos />
        </Grid>
      </Grid>
    </Fragment>
  );
}
