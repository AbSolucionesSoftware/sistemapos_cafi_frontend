import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@material-ui/core";
import { Typography, Divider, FormControl, Select } from "@material-ui/core";
import PreciosDeCompra from "./UnidadesVenta";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { Alert } from "@material-ui/lab";
import { useDebounce } from "use-debounce/lib";
import PreciosDeVenta from "./Precios";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    "& .obligatorio": {
      color: "red",
    },
  },
  formInput: {
    margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
  },
  precioTitle: {
    width: theme.spacing(20),
    display: "flex",
    alignItems: "center",
  },
  input: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
}));

export default function RegistroInfoAdidional() {
  const classes = useStyles();
  const {
    precios,
    setPrecios,
    validacion,
    preciosP,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
  } = useContext(RegProductoContext);

  /* CHECKBOX IVA */
  const obtenerIva = (e) => {
    if (e.target.name === "iva" && !e.target.value) {
      setPrecios({
        ...precios,
        iva: "",
      });
      return;
    }
    let precio_con_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    if (e.target.name === "iva_activo") {
      if (e.target.checked) {
        precio_sin_impuesto = parseFloat(
          precios.precio_de_compra.precio_sin_impuesto
        );
        iva = parseFloat(precio_sin_impuesto) * 0.16;
        ieps =
          parseFloat(precio_sin_impuesto) *
          parseFloat(
            precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps
          );
        precio_con_impuesto = precio_sin_impuesto + iva + ieps;
        precio_unitario_sin_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        precio_unitario_con_impuesto =
          precio_con_impuesto / precios.unidad_de_compra.cantidad;
      } else {
        precio_sin_impuesto = parseFloat(
          precios.precio_de_compra.precio_sin_impuesto
        );
        iva = 0;
        ieps =
          parseFloat(precio_sin_impuesto) *
          parseFloat(
            precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps
          );
        precio_con_impuesto = precio_sin_impuesto + iva + ieps;
        precio_unitario_sin_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        precio_unitario_con_impuesto =
          precio_con_impuesto / precios.unidad_de_compra.cantidad;
        if (!precios.ieps_activo) {
          precio_con_impuesto = 0;
          precio_unitario_con_impuesto =
            precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        }
      }
    } else {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      iva =
        parseFloat(precio_sin_impuesto) *
        parseFloat(
          e.target.value < 10 ? ".0" + e.target.value : "." + e.target.value
        );
      ieps =
        parseFloat(precio_sin_impuesto) *
        parseFloat(
          precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps
        );
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    }
    setPrecios({
      ...precios,
      iva_activo:
        e.target.name === "iva_activo" ? e.target.checked : precios.iva_activo,
      iva:
        e.target.name === "iva"
          ? parseFloat(e.target.value)
          : e.target.checked
          ? 16
          : 0,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(6)),
        iva: parseFloat(iva.toFixed(6)),
        ieps: parseFloat(ieps.toFixed(6)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(6)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(6)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(6)
        ),
      },
    });
  };

  /* CHECKBOX IEPS
	si el checkbox esta true se agrega al precio de venta */
  const obtenerIeps = (e) => {
    if (e.target.name === "ieps" && !e.target.value) {
      setPrecios({
        ...precios,
        ieps: "",
      });
      return;
    }
    let precio_con_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    if (e.target.name === "ieps_activo") {
      if (e.target.checked) {
        precio_sin_impuesto = parseFloat(
          precios.precio_de_compra.precio_sin_impuesto
        );
        iva =
          parseFloat(precio_sin_impuesto) *
          parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
        ieps = parseFloat(precio_sin_impuesto) * precios.ieps;
        precio_con_impuesto = precio_sin_impuesto + iva + ieps;
        precio_unitario_sin_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        precio_unitario_con_impuesto =
          precio_con_impuesto / precios.unidad_de_compra.cantidad;
      } else {
        precio_sin_impuesto = parseFloat(
          precios.precio_de_compra.precio_sin_impuesto
        );
        ieps = 0;
        iva =
          parseFloat(precio_sin_impuesto) *
          parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
        precio_con_impuesto = precio_sin_impuesto + iva + ieps;
        precio_unitario_sin_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        precio_unitario_con_impuesto =
          precio_con_impuesto / precios.unidad_de_compra.cantidad;
        if (!precios.iva_activo) {
          precio_con_impuesto = 0;
          precio_unitario_con_impuesto =
            precio_sin_impuesto / precios.unidad_de_compra.cantidad;
        }
      }
    } else {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      iva =
        parseFloat(precio_sin_impuesto) *
        parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
      ieps =
        parseFloat(precio_sin_impuesto) *
        parseFloat(
          e.target.value < 10 ? ".0" + e.target.value : "." + e.target.value
        );
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    }
    setPrecios({
      ...precios,
      ieps_activo:
        e.target.name === "ieps_activo"
          ? e.target.checked
          : precios.ieps_activo,
      ieps:
        e.target.name === "ieps"
          ? parseFloat(e.target.value)
          : e.target.checked
          ? precios.ieps
          : 0,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(6)),
        iva: parseFloat(iva.toFixed(6)),
        ieps: parseFloat(ieps.toFixed(6)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(6)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(6)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(6)
        ),
      },
    });
  };

  const [precioConImpuesto, setPrecioConImpuesto] = useState(
    precios.precio_de_compra.precio_con_impuesto
  );
  const [precioSinImpuesto, setPrecioSinImpuesto] = useState(
    precios.precio_de_compra.precio_sin_impuesto
  );

  const [PCI] = useDebounce(precioConImpuesto, 500);
  const [PSI] = useDebounce(precioSinImpuesto, 500);

  /* ARMAR OBJETO DE PRECIOS DE COMPRA */
  const obtenerPrecioConImpuesto = (value) => {
    let precio_con_impuesto = 0;
    let total_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    /* Precio con impuesto */
    precio_con_impuesto = parseFloat(value);
    total_impuesto =
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva) +
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_sin_impuesto = parseFloat(value) / parseFloat(total_impuesto + 1);
    iva =
      precio_sin_impuesto *
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
    ieps =
      precio_sin_impuesto *
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;
    if (isNaN(iva)) iva = 0;
    if (isNaN(ieps)) ieps = 0;
    /* if (isNaN(precio_con_impuesto)) precio_con_impuesto = 0;
		if (isNaN(precio_sin_impuesto)) precio_sin_impuesto = 0; */

    setPrecioSinImpuesto(parseFloat(precio_sin_impuesto.toFixed(6)));
    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(6)),
        iva: parseFloat(iva.toFixed(6)),
        ieps: parseFloat(ieps.toFixed(6)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(6)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(6)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(6)
        ),
      },
    });
  };

  /* ARMAR OBJETO DE PRECIOS DE COMPRA */
  const obtenerPrecioSinImpuesto = (value) => {
    let precio_con_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    /* Precio sin impuesto */
    precio_sin_impuesto = parseFloat(value);
    iva =
      parseFloat(value) *
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
    ieps =
      parseFloat(value) *
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_con_impuesto = precio_sin_impuesto + iva + ieps;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    if (!precios.iva_activo && !precios.ieps_activo) {
      precio_con_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_con_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    }

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;
    if (isNaN(iva)) iva = 0;
    if (isNaN(ieps)) ieps = 0;
    /* if (isNaN(precio_con_impuesto)) precio_con_impuesto = 0;
		if (isNaN(precio_sin_impuesto)) precio_sin_impuesto = 0; */

    setPrecioConImpuesto(parseFloat(precio_con_impuesto.toFixed(6)));
    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(6)),
        iva: parseFloat(iva.toFixed(6)),
        ieps: parseFloat(ieps.toFixed(6)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(6)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(6)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(6)
        ),
      },
    });
  };

  /* ARMAR OBJETO DE UNIDAD DE COMPRA */
  const obtenerUnidadCompra = (e) => {
    if (e.target.name === "unidad") {
      if (e.target.value === "Caja" || e.target.value === "Costal") {
        let precio = unidadVentaXDefecto.cantidad * unidadVentaXDefecto.precio;
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        });
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: e.target.value,
          },
          inventario: {
            ...precios.inventario,
            unidad_de_inventario: e.target.value,
          },
        });
      } else {
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          unidad: e.target.value,
          cantidad: 1,
          precio: preciosP[0].precio_neto
            ? preciosP[0].precio_neto
            : precios.unidad_de_compra.precio_unitario_con_impuesto,
        });
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: e.target.value,
            cantidad: 1,
          },
          inventario: {
            ...precios.inventario,
            unidad_de_inventario: e.target.value,
          },
        });
      }
    } else {
      if (!precios.iva_activo && !precios.ieps_activo) {
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: parseFloat(e.target.value),
            precio_unitario_sin_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(6)
            ),
            precio_unitario_con_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(6)
            ),
          },
        });
      } else {
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: parseFloat(e.target.value),
            precio_unitario_sin_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(6)
            ),
            precio_unitario_con_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_con_impuesto / e.target.value
              ).toFixed(6)
            ),
          },
        });
      }
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        cantidad:
          precios.unidad_de_compra.unidad !== "Caja" ||
          precios.unidad_de_compra.unidad !== "Costal"
            ? 1
            : parseFloat(e.target.value),
      });
    }
  };

  const verificarCampoVacio = (name, value) => {
    if (!value) {
      setPrecios({
        ...precios,
        [name]: 0,
      });
    }
  };

  useEffect(() => {
    obtenerPrecioConImpuesto(PCI);
  }, [PCI]);

  useEffect(() => {
    obtenerPrecioSinImpuesto(PSI);
  }, [PSI]);

  return (
    <Box>
      <div className={classes.input}>
        <Box>
          <Typography>
            <b>Impuestos</b>
          </Typography>
        </Box>
        <Divider />
        <Box display="flex" alignItems="center" justifyContent="center" my={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={precios.iva_activo}
                onChange={obtenerIva}
                name="iva_activo"
              />
            }
            label="IVA"
          />
          <Box>
            <TextField
              disabled={!precios.iva_activo}
              label="porcentaje IVA"
              type="number"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              size="small"
              name="iva"
              id="form-producto-iva"
              variant="outlined"
              value={precios.iva}
              onChange={obtenerIva}
              onBlur={() => verificarCampoVacio("iva", precios.iva)}
              error={precios.iva === ""}
            />
          </Box>
          <Box mx={5} />
          <FormControlLabel
            control={
              <Checkbox
                checked={precios.ieps_activo}
                onChange={obtenerIeps}
                name="ieps_activo"
              />
            }
            label="IEPS"
          />
          <Box>
            <TextField
              disabled={!precios.ieps_activo}
              label="porcentaje IEPS"
              type="number"
              InputProps={{
                inputProps: { min: 0 },
                endAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
              size="small"
              name="ieps"
              id="form-producto-ieps"
              variant="outlined"
              value={precios.ieps}
              onChange={obtenerIeps}
              onBlur={() => verificarCampoVacio("ieps", precios.ieps)}
              error={precios.ieps === ""}
            />
          </Box>
          <Box display="flex" alignItems="center" ml={1}>
            <Alert severity="info">Selecciona los impuestos aplicables</Alert>
          </Box>
        </Box>
        <Box mt={3}>
          <Typography>
            <b>Precios y unidad de compra</b>
          </Typography>
        </Box>
        <Divider />
        <Box className={classes.formInputFlex} justifyContent="center">
          <Box>
            <Typography>Unidad de compra</Typography>
            <Box display="flex">
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                error={validacion.error && !precios.unidad_de_compra.unidad}
              >
                {precios.granel ? (
                  <Select
                    id="form-producto-categoria"
                    name="unidad"
                    value={precios.unidad_de_compra.unidad}
                    onChange={obtenerUnidadCompra}
                  >
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Costal">Costal</MenuItem>
                    <MenuItem value="Lt">Lt</MenuItem>
                  </Select>
                ) : (
                  <Select
                    id="form-producto-categoria"
                    name="unidad"
                    value={precios.unidad_de_compra.unidad}
                    onChange={obtenerUnidadCompra}
                  >
                    <MenuItem value="Caja">Caja</MenuItem>
                    <MenuItem value="Pz">Pz</MenuItem>
                  </Select>
                )}
                <FormHelperText>{validacion.message}</FormHelperText>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Typography align="center">Unidad de conversion</Typography>
            <Typography align="center" variant="h6">
              <b>
                {precios.unidad_de_compra.unidad === "Caja"
                  ? "Pz"
                  : precios.unidad_de_compra.unidad === "Costal"
                  ? "Kg"
                  : precios.unidad_de_compra.unidad}
              </b>
            </Typography>
          </Box>
          <Box>
            <Typography>
              <span className="obligatorio">* </span>Factor por Unidad
            </Typography>
            <TextField
              disabled={
                precios.unidad_de_compra.unidad === "Caja" ||
                precios.unidad_de_compra.unidad === "Costal"
                  ? false
                  : true
              }
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              size="small"
              error={validacion.error && !precios.unidad_de_compra.cantidad}
              name="cantidad"
              id="form-producto-cantidad"
              variant="outlined"
              value={precios.unidad_de_compra.cantidad}
              helperText={validacion.message}
              onChange={obtenerUnidadCompra}
            />
          </Box>
          <Box>
            <Typography>
              <span className="obligatorio">* </span>Precio sin impuestos
            </Typography>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
              error={validacion.error && !precioSinImpuesto}
              name="precio_sin_impuesto"
              id="form-producto-precio_sin_impuesto"
              variant="outlined"
              value={precioSinImpuesto}
              helperText={validacion.message}
              onChange={(e) => setPrecioSinImpuesto(e.target.value)}
            />
          </Box>
          <Box>
            <Typography>
              <span className="obligatorio">* </span>Precio con impuestos
            </Typography>
            <TextField
              disabled={!precios.iva_activo && !precios.ieps_activo}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
              error={validacion.error && !precioConImpuesto}
              name="precio_con_impuesto"
              id="form-producto-precio_con_impuesto"
              variant="outlined"
              value={precioConImpuesto}
              helperText={validacion.message}
              onChange={(e) => setPrecioConImpuesto(e.target.value)}
            />
          </Box>
        </Box>
        <Box className={classes.formInputFlex} justifyContent="center">
          <Box width="120px">
            <Typography align="center">IVA</Typography>
            <Typography align="center" variant="h6">
              <b>$ {parseFloat(precios.precio_de_compra.iva).toFixed(3)}</b>
            </Typography>
          </Box>
          <Box width="120px">
            <Typography align="center">IEPS</Typography>
            <Typography align="center" variant="h6">
              <b>$ {parseFloat(precios.precio_de_compra.ieps).toFixed(3)}</b>
            </Typography>
          </Box>
          <Box>
            <Typography align="center">
              Precio unitario sin impuestos
            </Typography>
            <Typography align="center" variant="h6">
              <b>$ {parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto).toFixed(3)}</b>
            </Typography>
          </Box>
          <Box>
            <Typography align="center">
              Precio unitario con impuestos
            </Typography>
            <Typography align="center" variant="h6">
              <b>$ {parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto).toFixed(3)}</b>
            </Typography>
          </Box>
        </Box>
        <Box mt={1}>
          <Typography>
            <b>Precios de venta</b>
          </Typography>
        </Box>
        <Divider />
        <Box display="flex">
          <PreciosDeVenta /* key={index} data={res} index={index} */ />
          {/* {preciosP.map((res, index) => (
            
          ))} */}
        </Box>
        <Box mt={2}>
          <Typography>
            <b>Unidades de venta</b>
          </Typography>
        </Box>
        <Divider />
        <Box>
          <PreciosDeCompra />
        </Box>
      </div>
    </Box>
  );
}
