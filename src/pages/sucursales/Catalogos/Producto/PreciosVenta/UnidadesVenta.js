import React, { Fragment, useContext, useState } from "react";
import {
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import {
  Box,
  TextField,
  Typography,
  Table,
  Checkbox,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Add, Cached, LocalOffer } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { unitCodes, unitCodes_granel } from "../unidades";
import { useDebounce } from "use-debounce/lib";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  titulos: {
    fontWeight: 500,
  },
}));

export default function PreciosDeCompra() {
  const classes = useStyles();
  const {
    datos_generales,
    precios,
    unidadesVenta,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
    update,
  } = useContext(RegProductoContext);

  /* const [unidades, setUnidades] = useState({
    unidad: precios.unidad_de_compra.unidad,
    codigo_unidad: precios.unidad_de_compra.codigo_unidad,
    unidad_principal: false,
    cantidad: 1,
  }); */

  /* const obtenerUnidadesVentas = (e, child) => {
    if (e.target.name === "cantidad") {
      let cantidad = parseFloat(e.target.value);
      setUnidades({
        ...unidades,
        cantidad: cantidad,
        precio: cantidad * unidadVentaXDefecto.precio,
      });
    } else if (e.target.name === "unidad") {
      const { codigo_unidad, unidad } = child.props.unidad;
      setUnidades({
        ...unidades,
        [e.target.name]: unidad,
        codigo_unidad,
        precio: unidades.cantidad * unidadVentaXDefecto.precio,
      });
    } else {
      setUnidades({
        ...unidades,
        [e.target.name]: e.target.value,
      });
    }
  }; */

  /* const obtenerPrecioUVentas = (value) => {
    console.log("obtenreprecio");
    if (unidades.descuento_activo && unidades.descuento_activo === true) {
      console.log("entra");
      //calcular nuevo precio entre %
      let precio_neto = Math.round(
        value -
          value *
            parseFloat(
              `0.${
                unidades.descuento.porciento < 10
                  ? `0${unidades.descuento.porciento}`
                  : unidades.descuento.porciento
              }`
            )
      );
      setUnidades({
        ...unidades,
        precio: parseFloat(value),
        descuento: { ...unidades.descuento, precio_neto },
      });
    } else {
      setUnidades({
        ...unidades,
        precio: parseFloat(value),
      });
    }
  }; */

  const descuentoUnidadXdefecto = (descuento_activo) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      descuento_activo,
    });
  };

  const checkUnidadDefault = (checked) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      unidad_principal: true,
    });
    if (checked) {
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad_principal: false,
      });
    }

    /* if (checked) {
      let nuevo_array = [];
      for (let i = 0; i < unidadesVenta.length; i++) {
        const element = unidadesVenta[i];
        let new_element = {
          _id: element._id,
          codigo_barras: element.codigo_barras,
          unidad: element.unidad,
          codigo_unidad: element.codigo_unidad,
          precio: parseFloat(element.precio),
          cantidad: parseFloat(element.cantidad),
          unidad_principal: false,
          default: element.default,
          descuento: element.descuento,
          descuento_activo: element.descuento_activo,
          precio_unidad: element.precio_unidad,
        };
        nuevo_array.push(new_element);
      }
      setUnidadesVenta([...nuevo_array]);
    } */
  };

  return (
    <Fragment>
      <Box>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código de barras</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Aplicar Descuento</TableCell>
                <TableCell>Unidad Principal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow /* selected={actualizarUnidad ? true : false} */>
                <TableCell>{datos_generales.codigo_barras}</TableCell>
                <TableCell>{unidadVentaXDefecto.unidad}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {unidadVentaXDefecto.descuento_activo !== null ? (
                      <LocalOffer
                        color={
                          unidadVentaXDefecto.descuento_activo === true
                            ? "primary"
                            : "action"
                        }
                      />
                    ) : null}
                    <Box mr={1} />
                    <Typography>
                      <b>
                        $
                        {formatoMexico(
                          unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento.precio_neto
                            : unidadVentaXDefecto.precio
                        )}
                      </b>
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{unidadVentaXDefecto.cantidad}</TableCell>
                <TableCell>
                  {unidadVentaXDefecto.descuento_activo !== null ? (
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={
                          unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento_activo
                            : false
                        }
                        onChange={(e) =>
                          descuentoUnidadXdefecto(e.target.checked)
                        }
                        inputProps={{ "aria-label": "check descuento" }}
                        color="primary"
                        disabled={unidadVentaXDefecto.descuento_activo === null}
                      />
                      <Typography color="primary">
                        %
                        {parseFloat(
                          unidadVentaXDefecto.descuento_activo !== null
                            ? unidadVentaXDefecto.descuento.porciento
                            : 0
                        )}
                      </Typography>
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={unidadVentaXDefecto.unidad_principal}
                    onChange={(e) => checkUnidadDefault(e.target.checked)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
                <TableCell>
                  {/* {actualizarUnidad ? (
                    <IconButton
                      color="primary"
                      onClick={() => cancelarUpdate()}
                    >
                      <Close color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => updateUnidadPrincipal()}
                    >
                      <EditOutlined color="primary" />
                    </IconButton>
                  )} */}
                </TableCell>
              </TableRow>
              <UnidadesVentaSecundaria />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fragment>
  );
}

const UnidadesVentaSecundaria = () => {
  const {
    datos_generales,
    unidadesVenta,
    precios,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);

  /* const [precio, setPrecio] = useState(unidadVentaSecundaria.precio);
  const [cantidad, setCantidad] = useState(unidadVentaSecundaria.cantidad);

  const [PRICE] = useDebounce(precio, 500);
  const [QUANTITY] = useDebounce(cantidad, 500); */

  /* useEffect(() => {
    calcularUnidad(PRICE);
  }, [PRICE]);

  useEffect(() => {
    calcularUnidad(QUANTITY);
  }, [QUANTITY]); */

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      codigo_barras,
    });
  };


  const obtenerDatosUnidad = (e) => {
    let { name, value } = e.target;
    if (value) {
      value = parseFloat(value);
    }
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      [name]: value,
    });
  };

  const calcularUnidad = () => {
    if (!unidadVentaSecundaria.precio || !unidadVentaSecundaria.cantidad)
      return;
    const { precio, cantidad } = unidadVentaSecundaria;

    const { iva, ieps } = precios;

    let suma_impuestos =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let PVCI = parseFloat((precio / cantidad).toFixed(2));
    let PVSI = parseFloat((PVCI / (suma_impuestos + 1)).toFixed(2));

    let PCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    let iva_precio = parseFloat(
      PVSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`).toFixed(2)
    );
    let ieps_precio = parseFloat(
      PVSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`).toFixed(2)
    );
    let utilidad = parseFloat((((PVSI - PCSI) / PCSI) * 100).toFixed(2));

    let unidad_secundaria = {
      ...unidadVentaSecundaria,
      precio,
      cantidad,
      precio_unidad: {
        numero_precio: 1,
        precio_venta: PVSI,
        precio_neto: PVCI,
        unidad_mayoreo: 0,
        iva_precio,
        ieps_precio,
        utilidad,
        unidad_maxima: false,
      },
    };

    if (
      unidadVentaSecundaria.codigo_unidad === "XBX" ||
      unidadVentaSecundaria.unidad === "Costal"
    ) {
      unidad_secundaria.precio_unidad.precio_general = precio;
      unidad_secundaria.precio_unidad.cantidad_unidad = cantidad;
      unidad_secundaria.precio_unidad.unidad_maxima = true;
    }

    setUnidadVentaSecundaria(unidad_secundaria);
  };

  const checkUnidadPrincipal = (checked) => {
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      unidad_principal: true,
    });
    if (checked) {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad_principal: false,
      });
    }
    /*let nuevo_array = [];
    for (let i = 0; i < unidadesVenta.length; i++) {
      const element = unidadesVenta[i];
      let new_element = {
        _id: element._id,
        codigo_barras: element.codigo_barras,
        unidad: element.unidad,
        codigo_unidad: element.codigo_unidad,
        precio: parseFloat(element.precio),
        cantidad: parseFloat(element.cantidad),
        unidad_principal: i === index ? true : false,
        default: element.default,
        descuento: element.descuento,
        descuento_activo: element.descuento_activo,
        precio_unidad: element.precio_unidad,
      };
      nuevo_array.push(new_element);
    }
    setUnidadesVenta([...nuevo_array]);
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      unidad_principal: false,
    }); */
  };

  const aplicarDescuento = (value) => {
    let nuevo_array = [];
    /* for (let i = 0; i < unidadesVenta.length; i++) {
      const element = unidadesVenta[i];

      let new_element = {
        _id: element._id,
        codigo_barras: element.codigo_barras,
        unidad: element.unidad,
        codigo_unidad: element.codigo_unidad,
        precio: parseFloat(element.precio),
        cantidad: parseFloat(element.cantidad),
        unidad_principal: element.unidad_principal,
        default: element.default,
        descuento: element.descuento,
        descuento_activo: i === index ? value : element.descuento_activo,
        precio_unidad: element.precio_unidad,
      };
      nuevo_array.push(new_element);
    }
    setUnidadesVenta([...nuevo_array]); */
  };

  return (
    <TableRow>
      <TableCell width={220}>
        <FormControl variant="outlined" size="small" name="codigo_barras">
          <OutlinedInput
            id="input-codigo-barras"
            name="codigo_barras"
            value={unidadVentaSecundaria.codigo_barras}
            /* onChange={obtenerUnidadesVentas} */
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => GenCodigoBarras()}
                >
                  <Cached />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </TableCell>
      <TableCell>{unidadVentaSecundaria.unidad}</TableCell>
      <TableCell width={150}>
        <TextField
          type="number"
          name="precio"
          variant="outlined"
          size="small"
          onBlur={calcularUnidad}
          onChange={obtenerDatosUnidad}
          onBlur={(e) => {
            if(e.target.value === ''){
              setUnidadVentaSecundaria({
                ...unidadVentaSecundaria,
                unidad_principal: false,
                precio: unidadVentaSecundaria.descuento_activo !== null &&
                unidadVentaSecundaria.descuento_activo === true
                  ? unidadVentaSecundaria.descuento.precio_neto
                  : 0
              })
              setUnidadVentaXDefecto({
                ...unidadVentaXDefecto,
                unidad_principal: true
              })
            }
          }}
          value={
            unidadVentaSecundaria.descuento_activo !== null &&
            unidadVentaSecundaria.descuento_activo === true
              ? unidadVentaSecundaria.descuento.precio_neto
              : unidadVentaSecundaria.precio
          }
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                {unidadVentaSecundaria.descuento_activo !== null ? (
                  <LocalOffer
                    color={
                      unidadVentaSecundaria.descuento_activo
                        ? "primary"
                        : "disabled"
                    }
                  />
                ) : null}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell width={110}>
        <Tooltip
          title={<Typography variant="subtitle2">Pz/Kg por Unidad</Typography>}
          placement="top"
          arrow
        >
          <TextField
            InputProps={{ inputProps: { min: 0 } }}
            type="number"
            variant="outlined"
            size="small"
            name="cantidad"
            onBlur={calcularUnidad}
            onChange={obtenerDatosUnidad}
            value={unidadVentaSecundaria.cantidad}
            onBlur={(e) => {
              if(e.target.value === ''){
                setUnidadVentaSecundaria({
                  ...unidadVentaSecundaria,
                  cantidad: precios.unidad_de_compra.cantidad
                })
              }
            }}
          />
        </Tooltip>
      </TableCell>
      <TableCell>
        {unidadVentaSecundaria.descuento_activo !== null ? (
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={
                unidadVentaSecundaria.descuento_activo
                  ? unidadVentaSecundaria.descuento_activo
                  : false
              }
              onChange={(e) => aplicarDescuento(e.target.checked)}
              inputProps={{ "aria-label": "check descuento" }}
              color="primary"
              disabled={unidadVentaSecundaria.descuento_activo === null}
            />
            <Typography color="primary">
              %
              {parseFloat(
                unidadVentaSecundaria.descuento &&
                  unidadVentaSecundaria.descuento !== null
                  ? unidadVentaSecundaria.descuento.porciento
                  : 0
              )}
            </Typography>
          </Box>
        ) : null}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={unidadVentaSecundaria.unidad_principal}
          onChange={(e) => checkUnidadPrincipal(e.target.checked)}
          inputProps={{ "aria-label": "primary checkbox" }}
          disabled={unidadVentaSecundaria.precio === 0}
        />
      </TableCell>
    </TableRow>
  );
};
