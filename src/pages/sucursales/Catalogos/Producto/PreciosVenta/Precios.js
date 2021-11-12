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

  const obtenerUtilidad = (value) => {
    if (!value) {
      preciosVenta.utilidad = "";
      newPreciosP.splice(index, 1, preciosVenta);
      setPreciosP(newPreciosP);
      return;
    }
    //se agrega la utilidad
    preciosVenta.utilidad = parseFloat(value);

    //apartir de aqui se hacen los calculos para meter datos a precios de venta y precios netos
    let utilidad = 1;
    let verificacion_entero = false;
    let valor2 = value;

    if (parseFloat(value) < 10) valor2 = "0" + value.replace(/[.]/g, "");
    if (value > 99) {
      valor2 = value / 100;
      verificacion_entero = true;
    }

    if (!verificacion_entero) {
      utilidad = "." + valor2.replace(/[.]/g, "");
    } else {
      utilidad = parseFloat(valor2);
    }

    const ganancia_utilidad_sin_impuestos =
      precios.unidad_de_compra.precio_unitario_sin_impuesto +
      precios.unidad_de_compra.precio_unitario_sin_impuesto * utilidad;
    preciosVenta.precio_venta = parseFloat(
      ganancia_utilidad_sin_impuestos.toFixed(6)
    );
    let precio = 0;
    if (precios.iva_activo || precios.ieps_activo) {
      const ganancia_utilidad_con_impuestos =
        precios.unidad_de_compra.precio_unitario_con_impuesto +
        precios.unidad_de_compra.precio_unitario_con_impuesto * utilidad;
      preciosVenta.precio_neto = parseFloat(
        ganancia_utilidad_con_impuestos.toFixed(6)
      );
      if (preciosVenta.numero_precio === 1) {
        precio = parseFloat(ganancia_utilidad_con_impuestos.toFixed(6));
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            parseFloat(ganancia_utilidad_con_impuestos.toFixed(6));
        }
        /* setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        }); */
      }
    } else {
      preciosVenta.precio_neto = parseFloat(
        ganancia_utilidad_sin_impuestos.toFixed(6)
      );
      if (preciosVenta.numero_precio === 1) {
        precio = parseFloat(ganancia_utilidad_sin_impuestos.toFixed(6));
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            parseFloat(ganancia_utilidad_sin_impuestos.toFixed(6));
        }
        /* setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        }); */
      }
    }

    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      precio: parseFloat(precio.toFixed(6)),
    });
  /* console.log(unidadVentaXDefecto);
    if (unidadVentaXDefecto.descuento_activo && unidadVentaXDefecto.descuento_activo === true) {
      //calcular nuevo precio entre %
      let precio_con_descuento = Math.round(
        (precio * unidadVentaXDefecto.descuento.porciento) / 100
      );
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(6)),
        descuento: { ...unidadVentaXDefecto.descuento, precio_con_descuento },
      });
    }  */

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
    //obtenermos el precio neto
    preciosVenta.precio_neto = parseFloat(value);

    //si es el primer precio ponerlo en la unidad de venta por defecto
    if (preciosVenta.numero_precio === 1) {
      let precio = parseFloat(value);
      if (
        unidadVentaXDefecto.unidad === "Caja" ||
        unidadVentaXDefecto.unidad === "Costal"
      ) {
        precio = unidadVentaXDefecto.cantidad * parseFloat(value);
      }
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(6)),
      });
    }

    //calculamos el precio de venta y la utilidad
    let new_utilidad;

    if (precios.iva_activo || precios.ieps_activo) {
      new_utilidad =
        parseFloat(value) /
        parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto);
    } else {
      new_utilidad =
        parseFloat(value) /
        parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto);
    }

    let porcent = parseFloat(((new_utilidad - 1) * 100).toFixed(6));
    preciosVenta.utilidad = porcent;

    let utilidad;
    const valor = porcent.toString().replace(/[.]/g, "");

    utilidad = "." + valor;
    if (valor < 10) utilidad = ".0" + valor;
    if (valor % 100 === 0) utilidad = valor / 100;
    const precio = (
      precios.unidad_de_compra.precio_unitario_sin_impuesto +
      precios.unidad_de_compra.precio_unitario_sin_impuesto * utilidad
    ).toFixed(6);
    preciosVenta.precio_venta = parseFloat(precio);

    //se agrega al array original
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

  const calculos = () =>{
    const utilidad = preciosVenta.utilidad;
    if (!utilidad) {
      preciosVenta.precio_venta =
        precios.unidad_de_compra.precio_unitario_sin_impuesto;
    }
    if (!precios.iva_activo && !precios.ieps_activo) {
      preciosVenta.precio_neto =
        precios.unidad_de_compra.precio_unitario_sin_impuesto;

      if (preciosVenta.numero_precio === 1) {
        let precio = precios.unidad_de_compra.precio_unitario_sin_impuesto;
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            precios.unidad_de_compra.precio_unitario_sin_impuesto;
        }
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        });
      }
    } else {
      preciosVenta.precio_neto =
        precios.unidad_de_compra.precio_unitario_con_impuesto;
      if (preciosVenta.numero_precio === 1) {
        let precio = precios.unidad_de_compra.precio_unitario_con_impuesto;
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            precios.unidad_de_compra.precio_unitario_con_impuesto;
        }
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        });
      }
    }

    let verificacion_entero = false;
    let new_utilidad = 0;
    new_utilidad = utilidad;

    if (parseFloat(utilidad) < 10)
      new_utilidad = "0" + utilidad.toString().replace(/[.]/g, "");
    if (utilidad > 99) {
      new_utilidad = utilidad / 100;
      verificacion_entero = true;
    }

    if (!verificacion_entero) {
      new_utilidad = "." + new_utilidad.toString().replace(/[.]/g, "");
    } else {
      new_utilidad = parseFloat(new_utilidad);
    }

    const ganancia_utilidad_sin_impuestos =
      precios.unidad_de_compra.precio_unitario_sin_impuesto +
      precios.unidad_de_compra.precio_unitario_sin_impuesto * new_utilidad;

    preciosVenta.precio_venta = parseFloat(
      ganancia_utilidad_sin_impuestos.toFixed(6)
    );

    if (precios.iva_activo || precios.ieps_activo) {
      const ganancia_utilidad_con_impuestos =
        precios.unidad_de_compra.precio_unitario_con_impuesto +
        precios.unidad_de_compra.precio_unitario_con_impuesto * new_utilidad;
      preciosVenta.precio_neto = parseFloat(
        ganancia_utilidad_con_impuestos.toFixed(6)
      );

      if (preciosVenta.numero_precio === 1) {
        let precio = parseFloat(ganancia_utilidad_con_impuestos.toFixed(6));
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            parseFloat(ganancia_utilidad_con_impuestos.toFixed(6));
        }
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        });
      }
    } else {
      preciosVenta.precio_neto = parseFloat(
        ganancia_utilidad_sin_impuestos.toFixed(6)
      );
      if (preciosVenta.numero_precio === 1) {
        let precio = parseFloat(ganancia_utilidad_sin_impuestos.toFixed(6));
        if (
          unidadVentaXDefecto.unidad === "Caja" ||
          unidadVentaXDefecto.unidad === "Costal"
        ) {
          precio =
            unidadVentaXDefecto.cantidad *
            parseFloat(ganancia_utilidad_sin_impuestos.toFixed(6));
        }
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(6)),
        });
      }
    }

    newPreciosP.splice(index, 1, preciosVenta);
    setPreciosP(newPreciosP);
  }
  useEffect(() => {
    if(preciosVenta.numero_precio === 1){
      calculos();
    }else if(preciosVenta.numero_precio > 1 && preciosVenta.precio_neto){
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
            <b>{parseFloat(preciosVenta.precio_venta).toFixed(3)}</b>
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
                verificarCampoVacio("unidad_mayoreo", preciosVenta.unidad_mayoreo)
              }
              error={preciosVenta.unidad_mayoreo === ""}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
