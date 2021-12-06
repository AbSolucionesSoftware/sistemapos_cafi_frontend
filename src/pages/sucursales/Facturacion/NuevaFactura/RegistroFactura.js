import React, { forwardRef, useContext, useState } from "react";

import {
  Dialog,
  FormControl,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import ListaClientesFactura from "./ListaClientesFactura.js";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx.js";
import moment from "moment";
import ListaFoliosFactura from "./Catalogos/ListaFolios.js";
import CodigosPostales from "./Catalogos/CodigoPostal.js";
import {
  usosCfdi,
  tiposCfdi,
  tipoCambio,
  formaPago,
  metodoPago,
} from "../catalogos";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconSvg: {
    width: 50,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroFactura() {
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography>Venta:</Typography>
          <TextField
            value={datosFactura.cliente}
            placeholder="Selecciona venta a facturar"
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ListaClientesFactura />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={3}>
          <Typography>Tipo de factura:</Typography>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="tipo_factura"
          >
            <Select
              value={datosFactura.tipo_factura}
              name="tipo_factura"
              onChange={obtenerDatos}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {tiposCfdi.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <Typography>Uso de CFDI:</Typography>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="uso_cfdi"
          >
            <Select
              value={datosFactura.uso_cfdi}
              name="uso_cfdi"
              onChange={obtenerDatos}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {usosCfdi.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <Typography>Fecha de facturación:</Typography>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="fecha_expedicion"
          >
            <Select
              value={datosFactura.fecha_expedicion}
              name="fecha_expedicion"
              onChange={obtenerDatos}
            >
              <MenuItem value={moment().format("LL")}>
                {moment().format("LL")}
              </MenuItem>
              <MenuItem value={moment().subtract(1, "d").format("LL")}>
                {moment().subtract(1, "d").format("LL")}
              </MenuItem>
              <MenuItem value={moment().subtract(2, "d").format("LL")}>
                {moment().subtract(2, "d").format("LL")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <CodigosPostales />
        </Grid>
        <Grid item md={2}>
          <Typography>Moneda:</Typography>
          <FormControl variant="outlined" fullWidth size="small" name="currency">
            <Select
              value={datosFactura.currency}
              name="currency"
              onChange={obtenerDatos}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {tipoCambio.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Forma de pago:</Typography>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="forma_pago"
          >
            <Select
              value={datosFactura.forma_pago}
              name="forma_pago"
              onChange={obtenerDatos}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {formaPago.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Metodo de pago:</Typography>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="metodo_pago"
          >
            <Select
              value={datosFactura.metodo_pago}
              name="metodo_pago"
              onChange={obtenerDatos}
              value={datosFactura.metodo_pago}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {metodoPago.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          md={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{`Folio: ${datosFactura.folio}`}</Typography>
        </Grid>
        <Grid
          item
          md={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{`Serie: ${datosFactura.serie}`}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}
