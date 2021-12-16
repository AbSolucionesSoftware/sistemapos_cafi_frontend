import React, { useContext, useEffect } from "react";

import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import ListaClientesFactura from "./ListaClientesFactura.js";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx.js";
import moment from "moment";
import CodigosPostales from "./Catalogos/CodigoPostal.js";
import {
  usosCfdi,
  tiposCfdi,
  tipoCambio,
  formaPago,
  metodoPago,
} from "../catalogos";
import ListaClientesFacturas from "./ClientesSelect.js";

export default function RegistroFactura({ serie_default }) {
  const { datosFactura, setDatosFactura, error_validation } = useContext(
    FacturacionCtx
  );
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  useEffect(() => {
    const { folio, serie } = serie_default[0];
    setDatosFactura({ ...datosFactura, folio: folio.toString(), serie });
  }, []);

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  const obtenerUsoCfdi = (e) => {
    const { name, value } = e.target;
    setDatosFactura({
      ...datosFactura,
      receiver: {
        ...datosFactura.receiver,
        [name]: value,
      },
    });
  };

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item md={6}>
          <Box mb={1}>
            <Typography>
              <b>Emisor</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <InputLabel>Emisor</InputLabel>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={datosFactura.issuer.Name}
                InputProps={{
                  readOnly: true,
                }}
                error={error_validation.status && !datosFactura.issuer.Name}
                helperText={
                  error_validation.status && !datosFactura.issuer.Name
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4}>
              <InputLabel>RFC</InputLabel>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={datosFactura.issuer.Rfc}
                InputProps={{
                  readOnly: true,
                }}
                error={error_validation.status && !datosFactura.issuer.Rfc}
                helperText={
                  error_validation.status && !datosFactura.issuer.Rfc
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4}>
              <InputLabel>Regimen fiscal</InputLabel>
              <FormControl fullWidth size="small" variant="outlined">
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={datosFactura.issuer.FiscalRegime}
                  InputProps={{
                    readOnly: true,
                  }}
                  error={
                    error_validation.status && !datosFactura.issuer.FiscalRegime
                  }
                  helperText={
                    error_validation.status && !datosFactura.issuer.FiscalRegime
                      ? error_validation.message
                      : ""
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6}>
          <Box mb={1}>
            <Typography>
              <b>Receptor</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <InputLabel>Cliente</InputLabel>
              <TextField
                value={datosFactura.receiver.Name}
                placeholder="Selecciona un cliente"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ListaClientesFacturas />
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                error={error_validation.status && !datosFactura.receiver.Name}
                helperText={
                  error_validation.status && !datosFactura.receiver.Name
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4}>
              <InputLabel>RFC</InputLabel>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={datosFactura.receiver.Rfc}
                InputProps={{
                  readOnly: true,
                }}
                error={error_validation.status && !datosFactura.receiver.Rfc}
                helperText={
                  error_validation.status && !datosFactura.receiver.Rfc
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4}>
              <InputLabel>Uso de CFDi</InputLabel>
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                fullWidth
                error={
                  error_validation.status && !datosFactura.receiver.CfdiUse
                }
              >
                <Select
                  value={datosFactura.receiver.CfdiUse}
                  name="CfdiUse"
                  onChange={obtenerUsoCfdi}
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
                <FormHelperText>
                  {error_validation.status && !datosFactura.receiver.CfdiUse
                    ? error_validation.message
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={1} mb={2}>
        <Typography>
          <b>Datos factura</b>
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={2}>
        <Grid item md={1}>
          <TextField
            value={datosFactura.folio}
            label="Folio"
            fullWidth
            size="small"
            variant="outlined"
            disabled
            error={error_validation.status && !datosFactura.folio}
            helperText={
              error_validation.status && !datosFactura.folio
                ? error_validation.message
                : ""
            }
          />
        </Grid>
        <Grid item md={1}>
          <TextField
            value={datosFactura.serie}
            label="Serie"
            fullWidth
            size="small"
            variant="outlined"
            disabled
            error={error_validation.status && !datosFactura.serie}
            helperText={
              error_validation.status && !datosFactura.serie
                ? error_validation.message
                : ""
            }
          />
        </Grid>

        <Grid item md={3}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="cfdi_type"
            error={error_validation.status && !datosFactura.cfdi_type}
          >
            <InputLabel id="tipo_factura">Tipo de factura</InputLabel>
            <Select
              labelId="tipo_factura"
              value={datosFactura.cfdi_type}
              name="cfdi_type"
              onChange={obtenerDatos}
              label="Tipo de factura"
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
            <FormHelperText>
              {error_validation.status && !datosFactura.cfdi_type
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="date"
            error={error_validation.status && !datosFactura.date}
          >
            <InputLabel id="fecha_fact">Fecha de facturación</InputLabel>
            <Select
              labelId="fecha_fact"
              value={datosFactura.date}
              name="date"
              onChange={obtenerDatos}
              label="Fecha de facturacion"
            >
              <MenuItem value="">
                <em>Selecciona una fecha</em>
              </MenuItem>
              <MenuItem value="0">{moment().format("LL")}</MenuItem>
              <MenuItem value="1">
                {moment().subtract(1, "d").format("LL")}
              </MenuItem>
              <MenuItem value="2">
                {moment().subtract(2, "d").format("LL")}
              </MenuItem>
            </Select>
            <FormHelperText>
              {error_validation.status && !datosFactura.date
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <CodigosPostales />
        </Grid>
        <Grid item md={2}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="currency"
            error={error_validation.status && !datosFactura.currency}
          >
            <InputLabel id="moneda">Moneda</InputLabel>
            <Select
              labelId="moneda"
              value={datosFactura.currency}
              name="currency"
              onChange={obtenerDatos}
              label="moneda"
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
            <FormHelperText>
              {error_validation.status && !datosFactura.currency
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="payment_form"
            error={error_validation.status && !datosFactura.payment_form}
          >
            <InputLabel id="forma_pago">Forma de pago</InputLabel>
            <Select
              labelId="forma_pago"
              value={datosFactura.payment_form}
              name="payment_form"
              onChange={obtenerDatos}
              label="forma de pago"
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
            <FormHelperText>
              {error_validation.status && !datosFactura.payment_form
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="payment_method"
            error={error_validation.status && !datosFactura.payment_method}
          >
            <InputLabel id="metodo_pago">Método de pago</InputLabel>
            <Select
              labelId="metodo_pago"
              value={datosFactura.payment_method}
              name="payment_method"
              onChange={obtenerDatos}
              label="metodo de pago"
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
            <FormHelperText>
              {error_validation.status && !datosFactura.payment_method
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item md={3}>
          <TextField
            value={datosFactura.cliente}
            placeholder="Selecciona venta a facturar"
            fullWidth
            size="small"
            label="Venta"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ListaClientesFactura />
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
