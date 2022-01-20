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
import ListaVentasFactura from "./ListaVentas/ListaVentasFactura.js";
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
                  <ListaVentasFactura />
                </InputAdornment>
              ),
              readOnly: true,
            }}
          />
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
        <Grid item md={2}>
          <CodigosPostales />
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
      </Grid>
    </div>
  );
}

let compra = {
  input: {
    folio: "12345",
    descuento: 5.4,
    ieps: 2.5862100000000003,
    impuestos: 6.724146000000001,
    iva: 4.137936000000001,
    monedero: 0,
    subTotal: 23.875854,
    total: 30.6,
    venta_cliente: true,
    montos_en_caja: {
      monto_efectivo: 50,
      monto_tarjeta: 0,
      monto_creditos: 0,
      monto_monedero: 0,
      monto_transferencia: 0,
      monto_cheques: 0,
      monto_vales_despensa: 0,
    },
    credito: false,
    descuento_general_activo: false,
    decuento_general: {
      cantidad_descontado: 0,
      porciento: 0,
      precio_neto: 0,
    },
    dias_de_credito_venta: null,
    fecha_de_vencimiento_credito: null,
    fecha_vencimiento_cotizacion: null,
    cliente: {
      banco: null,
      celular: null,
      clave_cliente: "23233",
      curp: null,
      dias_credito: null,
      direccion: {
        calle: "Antonio",
        no_ext: "1",
        no_int: "1",
        codigo_postal: "1",
        colonia: "Antonio",
        municipio: "1",
        localidad: "1",
        estado: "1",
        pais: "1",
      },
      email: "antonio.poday@gmail.com",
      imagen: null,
      limite_credito: null,
      nombre_cliente: "Antonio",
      numero_cliente: "2323",
      razon_social: null,
      rfc: null,
      telefono: "1212",
      monedero_electronico: null,
    },
    productos: [
      {
        cantidad: 1,
        cantidad_venta: 1,
        codigo_barras: "226216505720",
        concepto: "unidades",
        default: true,
        descuento: {
          porciento: 15,
          dinero_descontado: 5.4,
          precio_neto: 30.6,
        },
        descuento_activo: true,
        granel_producto: {
          granel: false,
          valor: 0,
        },
        precio: 36,
        precio_a_vender: 30.6,
        precio_actual_producto: 30.6,
        precio_anterior: 36,
        iva_total_producto: 1.03,
        ieps_total_producto: 0,
        impuestos_total_producto: 1.03,
        subtotal_total_producto: 7.22,
        total_total_producto: 36,
        unidad: "Caja",
        codigo_unidad: "XBX",
        unidad_principal: true,
        inventario_general: [
          {
            cantidad_existente: 120,
            cantidad_existente_maxima: 10,
            unidad_inventario: "Pz",
            codigo_unidad: null,
            unidad_maxima: "Caja",
          },
        ],
        id_producto: {
          _id: "61b7bf6e3454b727a0c2e357",
          datos_generales: {
            clave_alterna: "COCA",
            codigo_barras: "226216505720",
            nombre_comercial: "COCACOLA",
            tipo_producto: "OTROS",
            nombre_generico: "COCACOLA",
            descripcion: null,
            id_categoria: null,
            categoria: null,
            subcategoria: null,
            id_subcategoria: null,
            id_departamento: null,
            departamento: null,
            id_marca: null,
            marca: null,
            receta_farmacia: false,
            clave_producto_sat: {
              Name: "Refrescos",
              Value: "50202306",
            },
          },
          precios: {
            ieps: 10,
            ieps_activo: false,
            inventario: {
              inventario_maximo: 15,
              inventario_minimo: 5,
              unidad_de_inventario: "Caja",
              codigo_unidad: "XBX",
            },
            iva: 16,
            iva_activo: true,
            monedero: false,
            monedero_electronico: 0,
            precio_de_compra: {
              precio_con_impuesto: 180,
              precio_sin_impuesto: 155.1724,
              iva: 24.8276,
              ieps: 0,
            },
            precios_producto: [
              {
                numero_precio: 1,
                precio_neto: 8.25,
                unidad_mayoreo: 0,
                utilidad: 10,
              },
              {
                numero_precio: 2,
                precio_neto: 0,
                unidad_mayoreo: 0,
                utilidad: 0,
              },
              {
                numero_precio: 3,
                precio_neto: 0,
                unidad_mayoreo: 0,
                utilidad: 0,
              },
              {
                numero_precio: 4,
                precio_neto: 0,
                unidad_mayoreo: 0,
                utilidad: 0,
              },
              {
                numero_precio: 5,
                precio_neto: 0,
                unidad_mayoreo: 0,
                utilidad: 0,
              },
              {
                numero_precio: 6,
                precio_neto: 0,
                unidad_mayoreo: 0,
                utilidad: 0,
              },
            ],
            unidad_de_compra: {
              cantidad: 24,
              precio_unitario_con_impuesto: 7.5,
              precio_unitario_sin_impuesto: 6.4655,
              unidad: "Caja",
              codigo_unidad: "XBX",
            },
          },
        },
        medida: null,
        color: null,
      },
    ],
  },
  empresa: "60c120b6a694891f58d32a1d",
  sucursal: "60c8e180340d5d223432a916",
  usuario: "60dde52c5cda9d5510c4b7d0",
  caja: "61a5037918594a4ecdc1c7bf",
};
