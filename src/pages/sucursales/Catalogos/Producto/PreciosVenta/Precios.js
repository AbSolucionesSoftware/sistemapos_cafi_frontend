import React, { Fragment, useContext, useEffect } from "react";
import {
  Box,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

const useStyles = makeStyles((theme) => ({
  precioTitle: {
    width: theme.spacing(20),
  },
  marginInput: {
    marginTop: 19,
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

export default function PreciosDeVenta() {
  const { preciosP } = useContext(RegProductoContext);
  let newPreciosP = [...preciosP];

  return (
    <Fragment>
      {preciosP.map((res, index) => (
        <RenderPreciosP
          key={index}
          data={res}
          index={index}
          newPreciosP={newPreciosP}
        />
      ))}
    </Fragment>
  );
}

const RenderPreciosP = ({ data, index, newPreciosP }) => {
  const classes = useStyles();
  const {
    preciosP,
    precios,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    setPreciosP,
  } = useContext(RegProductoContext);
  let preciosVenta = { ...preciosP[index] };

  const obtenerUtilidad = (valor_base) => {
    if (!valor_base) {
      preciosVenta.utilidad = "";
      newPreciosP.splice(index, 1, preciosVenta);
      setPreciosP(newPreciosP);
      return;
    }

    /* let utilidad = 1; */
    let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    let { unidad, cantidad, descuento, descuento_activo } = unidadVentaXDefecto;
    let { iva, ieps } = precios;
    let utilidad = valor_base / 100;

    const precio_venta = PUCSI * utilidad + PUCSI;
    let iva_precio =
      precio_venta * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
    let ieps_precio =
      precio_venta * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let impuestos = iva_precio + ieps_precio;
    const precio_neto = precio_venta + impuestos;

    preciosVenta.utilidad = parseFloat(valor_base);
    preciosVenta.precio_venta = parseFloat(precio_venta.toFixed(2));
    preciosVenta.precio_neto = parseFloat(precio_neto.toFixed(2));

    //meter los precios a unidadXdefecto
    let unidadXDefecto = {
      ...unidadVentaXDefecto,
      precio_unidad: {
        numero_precio: preciosVenta.numero_precio,
        precio_neto: precio_neto,
        precio_venta: precio_venta,
        unidad_mayoreo: preciosVenta.unidad_mayoreo,
        iva_precio,
        ieps_precio,
        utilidad: preciosVenta.utilidad,
        unidad_maxima: false,
      },
    };

    if (preciosVenta.numero_precio === 1) {
      if (unidad === "Caja" || unidad === "Costal") {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat((cantidad * precio_neto).toFixed(2)),
        };
      } else {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: precio_neto,
        };
      }
      if (descuento_activo === true) {
        //calcular nuevo precio entre %
        /* let precio_con_descuento = Math.round(
          precio_neto - precio_neto * parseFloat("." + descuento.porciento)
        ); */

        let new_precio_venta_desc = (precio_venta * descuento.porciento) / 100;
        let new_iva_precio =
          new_precio_venta_desc * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
        let new_ieps_precio =
          new_precio_venta_desc * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
        let new_impuestos = new_iva_precio + new_ieps_precio;
        let precio_con_descuento = new_precio_venta_desc + new_impuestos;

        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat(precio_neto.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto: precio_con_descuento,
          },
        };
      }
    }
    setUnidadVentaXDefecto(unidadXDefecto);

    newPreciosP.splice(index, 1, preciosVenta);
    setPreciosP(newPreciosP);
  };

  const obtenerPrecioNeto = (value) => {
    if (!value) {
      preciosVenta.precio_neto = "";
      newPreciosP.splice(index, 1, preciosVenta);
      setPreciosP(newPreciosP);
      return;
    }

    let precio_neto = parseFloat(value);
    let { unidad, cantidad, descuento, descuento_activo } = unidadVentaXDefecto;
    let { iva, ieps } = precios;
    let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;

    let suma =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let precio_venta = parseFloat((precio_neto / (suma + 1)).toFixed(2));
    let iva_precio =
      precio_venta * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
    let ieps_precio =
      precio_venta * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let impuestos = iva_precio + ieps_precio;
    let utilidad_base = ((precio_neto - impuestos - PUCSI) / PUCSI) * 100;

    preciosVenta.precio_neto = precio_neto;
    preciosVenta.precio_venta = precio_venta;
    preciosVenta.utilidad = parseFloat(utilidad_base.toFixed(2));

    //meter los precios a unidadXdefecto
    let unidadXDefecto = {
      ...unidadVentaXDefecto,
      precio_unidad: {
        numero_precio: preciosVenta.numero_precio,
        precio_neto: precio_neto,
        precio_venta: precio_venta,
        unidad_mayoreo: preciosVenta.unidad_mayoreo,
        iva_precio,
        ieps_precio,
        utilidad: preciosVenta.utilidad,
        unidad_maxima: false,
      },
    };

    if (preciosVenta.numero_precio === 1) {
      if (unidad === "Caja" || unidad === "Costal") {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat((cantidad * precio_neto).toFixed(2)),
        };
      } else {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: precio_neto,
        };
      }
      if (descuento_activo === true) {
        //calcular nuevo precio entre %
        /* let precio_con_descuento = Math.round(
          precio_neto - precio_neto * parseFloat("." + descuento.porciento)
        ); */

        let new_precio_venta_desc = (precio_venta * descuento.porciento) / 100;
        let new_iva_precio =
          new_precio_venta_desc * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
        let new_ieps_precio =
          new_precio_venta_desc * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
        let new_impuestos = new_iva_precio + new_ieps_precio;
        let precio_con_descuento = new_precio_venta_desc + new_impuestos;

        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat(precio_neto.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto: precio_con_descuento,
          },
        };
      }
    }
    setUnidadVentaXDefecto(unidadXDefecto);

    newPreciosP.splice(index, 1, preciosVenta);
    setPreciosP(newPreciosP);
  };

  const obtenerMayoreo = (value) => {
    if (!value) {
      preciosVenta.unidad_mayoreo = "";
      newPreciosP.splice(index, 1, preciosVenta);
      setPreciosP(newPreciosP);
      return;
    }
    preciosVenta.unidad_mayoreo = parseInt(value);
    newPreciosP.splice(index, 1, preciosVenta);
    setPreciosP(newPreciosP);
  };

  const calculos = () => {
    let { iva, ieps } = precios;
    let { unidad, cantidad, descuento, descuento_activo } = unidadVentaXDefecto;
    let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    let utilidad_base = preciosVenta.utilidad ? preciosVenta.utilidad : 0;
    let utilidad = utilidad_base / 100;

    //precio venta y neto con utilidad
    const precio_venta = parseFloat((PUCSI * utilidad + PUCSI).toFixed(2));
    let iva_precio =
      precio_venta * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
    let ieps_precio =
      precio_venta * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let impuestos = iva_precio + ieps_precio;

    const precio_neto = parseFloat((precio_venta + impuestos).toFixed(2));

    //meter los valores a preciosVenta
    preciosVenta.precio_venta = precio_venta;
    preciosVenta.precio_neto = precio_neto;
    preciosVenta.iva_precio = iva;
    preciosVenta.ieps_precio = ieps;

    //meter los precios a unidadXdefecto
    let unidadXDefecto = {
      ...unidadVentaXDefecto,
      precio_unidad: {
        numero_precio: preciosVenta.numero_precio,
        precio_neto: precio_neto,
        precio_venta: precio_venta,
        unidad_mayoreo: preciosVenta.unidad_mayoreo,
        iva_precio,
        ieps_precio,
        utilidad: preciosVenta.utilidad,
        unidad_maxima: false,
      },
    };

    if (preciosVenta.numero_precio === 1) {
      if (unidad === "Caja" || unidad === "Costal") {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat((cantidad * precio_neto).toFixed(2)),
        };
      } else {
        unidadXDefecto = {
          ...unidadXDefecto,
          precio: precio_neto,
        };
      }
      if (descuento_activo === true) {
        //calcular nuevo precio entre %
        /* let precio_con_descuento = Math.round(
          precio_neto - precio_neto * parseFloat("." + descuento.porciento)
        ); */

        let new_precio_venta_desc = (precio_venta * descuento.porciento) / 100;
        let new_iva_precio =
          new_precio_venta_desc * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
        let new_ieps_precio =
          new_precio_venta_desc * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
        let new_impuestos = new_iva_precio + new_ieps_precio;
        let precio_con_descuento = new_precio_venta_desc + new_impuestos;

        unidadXDefecto = {
          ...unidadXDefecto,
          precio: parseFloat(precio_neto.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto: precio_con_descuento,
          },
        };
      }
    }
    setUnidadVentaXDefecto(unidadXDefecto);

    newPreciosP.splice(index, 1, preciosVenta);
    setPreciosP(newPreciosP);
  };

  useEffect(() => {
    if (preciosVenta.numero_precio === 1) {
      calculos();
    } else if (preciosVenta.numero_precio > 1 && preciosVenta.precio_neto) {
      calculos();
    }

    /* preciosP.splice(index, 1, preciosVenta); */
  }, [precios.unidad_de_compra.precio_unitario_con_impuesto]);

  const verificarCampoVacio = (name, value) => {
    switch (name) {
      case "utilidad":
        if (!value) {
          preciosVenta.utilidad = 0;
          preciosVenta.precio_neto =
            precios.unidad_de_compra.precio_unitario_con_impuesto;
          newPreciosP.splice(index, 1, preciosVenta);
          setPreciosP(newPreciosP);
        }
        break;
      case "precio_neto":
        if (!value) {
          preciosVenta.precio_neto =
            preciosVenta.numero_precio > 1
              ? 0
              : precios.unidad_de_compra.precio_unitario_con_impuesto;
          preciosVenta.utilidad = 0;
          newPreciosP.splice(index, 1, preciosVenta);
          setPreciosP(newPreciosP);
        }
        break;
      case "unidad_mayoreo":
        if (!value) {
          preciosVenta.unidad_mayoreo = 0;
          newPreciosP.splice(index, 1, preciosVenta);
          setPreciosP(newPreciosP);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Box className={classes.input}>
      <Box display="flex" my={1} mr={1}>
        <Box
          alignItems="flex-end"
          display={data.numero_precio > 1 ? "none" : "flex"}
        >
          <Typography className={classes.precioTitle}>
            <b>Utilidad</b>
          </Typography>
        </Box>
        <Box minWidth={100}>
          <Typography>Precio {data.numero_precio}</Typography>
          <Box mb={2} />
          <TextField
            disabled={
              !parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto)
            }
            fullWidth
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            size="small"
            value={preciosVenta.utilidad}
            name="utilidad"
            variant="outlined"
            onChange={(e) => obtenerUtilidad(e.target.value)}
            onBlur={() =>
              verificarCampoVacio("utilidad", preciosVenta.utilidad)
            }
            error={preciosVenta.utilidad === ""}
          />
        </Box>
      </Box>
      <Box display="flex" my={2} mr={1}>
        <Box
          alignItems="flex-end"
          display={data.numero_precio > 1 ? "none" : "flex"}
        >
          <Box
            alignItems="flex-end"
            flexDirection="column"
            display={data.numero_precio > 1 ? "none" : "flex"}
          >
            <Typography className={classes.precioTitle}>
              <b>Precio de venta</b>
            </Typography>
            <Typography
              className={classes.precioTitle}
              variant="caption"
              color="textSecondary"
            >
              (precio sin impuestos)
            </Typography>
          </Box>
        </Box>
        <Box pl={1}>
          <Typography>
            <b>{parseFloat(preciosVenta.precio_venta).toFixed(2)}</b>
          </Typography>
        </Box>
      </Box>
      <Box display="flex" my={1} mr={1}>
        <Box
          alignItems="flex-end"
          flexDirection="column"
          display={data.numero_precio > 1 ? "none" : "flex"}
        >
          <Typography className={classes.precioTitle}>
            <b>Precio venta neto</b>
          </Typography>
          <Typography
            className={classes.precioTitle}
            variant="caption"
            color="textSecondary"
          >
            (precio con impuestos)
          </Typography>
        </Box>
        <Box className={data.numero_precio > 1 ? classes.marginInput : ""}>
          <TextField
            disabled={
              !parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto)
            }
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            size="small"
            name="precio_neto"
            variant="outlined"
            value={preciosVenta.precio_neto}
            onChange={(e) => obtenerPrecioNeto(e.target.value)}
            onBlur={() =>
              verificarCampoVacio("precio_neto", preciosVenta.precio_neto)
            }
            error={preciosVenta.precio_neto === ""}
          />
        </Box>
      </Box>

      <Box display="flex" my={2} mr={1}>
        <Box
          alignItems="flex-end"
          display={data.numero_precio > 1 ? "none" : "flex"}
        >
          <Typography className={classes.precioTitle}>
            <b>Unidad por mayoreo</b>
          </Typography>
        </Box>
        {data.numero_precio > 1 ? (
          <Box>
            <TextField
              disabled={
                !parseFloat(
                  precios.unidad_de_compra.precio_unitario_sin_impuesto
                )
              }
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
              name="unidad_mayoreo"
              variant="outlined"
              value={preciosVenta.unidad_mayoreo}
              onChange={(e) => obtenerMayoreo(e.target.value)}
              onBlur={() =>
                verificarCampoVacio(
                  "unidad_mayoreo",
                  preciosVenta.unidad_mayoreo
                )
              }
              error={preciosVenta.unidad_mayoreo === ""}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
