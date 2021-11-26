import React, { forwardRef, useContext, useState } from "react";

import {
  Box,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import TipoCDFI from "./Operaciones/TipoCDFI.js";
import ListaClientesFactura from "./Operaciones/ListaClientesFactura.js";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx.js";
import moment from "moment";
import ListaFoliosFactura from "./Operaciones/ListaFolios.js";

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
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [ventana, setVentana] = useState("");
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const ventanas = () => {
    switch (ventana) {
      case "tipocdfi":
        return <TipoCDFI handleClickOpen={handleClickOpen} />;
      case "clientes":
        return <ListaClientesFactura />;
      default:
        break;
    }
  };

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  console.log(datosFactura);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography>Cliente:</Typography>
          <TextField
            value={datosFactura.cliente}
            placeholder="Selecciona un cliente"
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
              <MenuItem value="Comprobante de ingreso">
                Comprobante de ingreso
              </MenuItem>
              <MenuItem value="Comprobante de egreso">
                Comprobante de egreso
              </MenuItem>
              <MenuItem value="Comprobante de nómina">
                Comprobante de nómina
              </MenuItem>
              <MenuItem value="Comprobante de traslado">
                Comprobante de traslado
              </MenuItem>
              <MenuItem value="Comprobante de recepción de pagos">
                Comprobante de recepción de pagos
              </MenuItem>
              <MenuItem value="Comprobante de retenciones e información de pagos">
                Comprobante de retenciones e información de pagos
              </MenuItem>
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
            <Select value={datosFactura.uso_cfdi} name="uso_cfdi" onChange={obtenerDatos}>
              <MenuItem value="">
                <em>Seleccione uno</em>
              </MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
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
              <MenuItem value={moment().subtract(3, "d").format("LL")}>
                {moment().subtract(3, "d").format("LL")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Folio:</Typography>
          <TextField
            value={datosFactura.folio}
            placeholder="Selecciona un folio"
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ListaFoliosFactura />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Serie:</Typography>
          <TextField
            fullWidth
            type="number"
            size="small"
            variant="outlined"
            value={datosFactura.serie}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Código postal:</Typography>
          <TextField
            fullWidth
            name="codigo_postal"
            size="small"
            variant="outlined"
            value={datosFactura.codigo_postal}
            onChange={obtenerDatos}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Moneda:</Typography>
          <FormControl variant="outlined" fullWidth size="small" name="moneda">
            <Select value={datosFactura.moneda} name="moneda" onChange={obtenerDatos}>
              <MenuItem value="MXN">MXN</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Forma de pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small" name="forma_pago">
            <Select value={datosFactura.forma_pago} name="forma_pago" onChange={obtenerDatos}>
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Tarjeta Credito">Tarjeta Credito</MenuItem>
              <MenuItem value="Tarjeta Debito">Tarjeta Debito</MenuItem>
              <MenuItem value="Credito">Credito</MenuItem>
              <MenuItem value="Modenedero Electronico">Modenedero Electronico</MenuItem>
              <MenuItem value="Vales despensa">Vales despensa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Metodo de pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small" name="metodo_pago">
            <Select value={datosFactura.metodo_pago} name="metodo_pago" onChange={obtenerDatos}>
              <MenuItem value="PUE - Pago en una sola exhibición">PUE - Pago en una sola exhibición</MenuItem>
              <MenuItem value="PPD - Pago en parcialidades">PPD - Pago en parcialidades</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        {ventanas()}
      </Dialog>
    </div>
  );
}
