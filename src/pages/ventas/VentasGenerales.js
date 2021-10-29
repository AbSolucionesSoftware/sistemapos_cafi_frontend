import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Typography,
  // CircularProgress,
  // TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import useStyles from "./styles";
import TablaVentas from "./TablaVentas";
import TablaVentasCheckbox from "./Tabla_ventas_checkbox";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../gql/Ventas/ventas_generales";
import { useLazyQuery } from "@apollo/client";
import ClientesVentas from "./ClientesVentas";

import { Fragment } from "react";
import MonedaCambio from "./Operaciones/MonedaCambio";
import {
  findProductArray,
  calculatePrices,
} from "../../config/reuserFunctions";

// import { ClienteProvider } from '../../context/Catalogos/crearClienteCtx';

export default function VentasGenerales() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  // const productosVentas = JSON.parse(localStorage.getItem('productosVentas'));
  const classes = useStyles();
  const [newProductoVentas, setNewProductoVentas] = useState(false);
  const [granelBase, setGranelBase] = useState({
    granel: false,
    valor: 0,
  });

  const [DatosVentasActual, setDatosVentasActual] = useState({
    subTotal: 0,
    total: 0,
    impuestos: 0,
    iva: 0,
    ieps: 0,
    descuento: 0,
    tipo_cambio: {},
  });

  // const [tipoCambioMoneda, setTipoCambioMoneda] = useState({
  //   cambio_actual: {
  //     tipo: "MXM",
  //     valor: 1,
  //   },
  //   cambio_convertir: {
  //     tipo: "USD",
  //     valor: 20,
  //   },
  // });

  const [obtenerProductos, { data /* error */ }] = useLazyQuery(
    CONSULTA_PRODUCTO_UNITARIO,
    {
      variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
      fetchPolicy: "network-only",
    }
  );

  let productosBase = null;
  if (data) productosBase = data.obtenerUnProductoVentas;

  useEffect(() => {
    if (productosBase !== null) {
      agregarProductos(productosBase);
    }
  }, [productosBase]);

  useEffect(() => {
    setGranelBase({
      granel: false,
      valor: 0,
    });

    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    if (venta !== null) {
      setDatosVentasActual({
        subTotal: parseFloat(venta.subTotal),
        total: parseFloat(venta.total),
        impuestos: parseFloat(venta.impuestos),
        iva: parseFloat(venta.iva),
        ieps: parseFloat(venta.ieps),
        descuento: parseFloat(venta.descuento),
      });
    }
  }, []);

  const keyUpEvent = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      const input_value = event.target.value.trim();
      const data = input_value.split("*");
      console.log(data);
      if (data.length > 1) {
        let data_operation = isNaN(data[0]) ? data[1] : data[0];
        let data_key = isNaN(data[0]) ? data[0] : data[1];
        setGranelBase({
          granel: true,
          valor: data_operation,
        });
        obtenerProductos({
          variables: {
            datosProductos: data_key,
          },
        });
      } else {
        console.log(input_value);
        setGranelBase({
          granel: false,
          valor: 0,
        });
        obtenerProductos({
          variables: {
            datosProductos: input_value,
          },
        });
      }
    }
  };

  const agregarProductos = async (producto) => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? { subTotal: 0, total: 0, impuestos: 0, iva: 0, ieps: 0, descuento: 0 }
        : venta;
    console.log(productosVentas);
    let productosVentasTemp = productosVentas;
    let subTotal = 0,
      total = 0,
      impuestos = 0,
      iva = 0,
      ieps = 0,
      descuento = 0,
      monedero = 0;

    // if(producto.id_prodo)

    const producto_encontrado = await findProductArray(
      productosVentas,
      producto
    );

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      const {
        subtotalCalculo,
        totalCalculo,
        impuestoCalculo,
        ivaCalculo,
        iepsCalculo,
        descuentoCalculo,
        monederoCalculo
      } = await calculatePrices(newP, 0, granelBase);
      // console.log(granelBase);
      subTotal = subtotalCalculo;
      total = totalCalculo;
      impuestos = impuestoCalculo;
      iva = ivaCalculo;
      ieps = iepsCalculo;
      descuento = descuentoCalculo;
      monedero = monederoCalculo;
      newP.cantidad_venta = 1;
      newP.granelProducto = granelBase;
      newP.precio_a_vender = totalCalculo;

      productosVentasTemp.push(newP);
    } else if (producto_encontrado.found && producto._id) {
      const { cantidad_venta, ...newP } =
        producto_encontrado.producto_found.producto;
      const {
        subtotalCalculo,
        totalCalculo,
        impuestoCalculo,
        ivaCalculo,
        iepsCalculo,
        descuentoCalculo,
        monederoCalculo
      } = await calculatePrices(newP, 0, granelBase);
      subTotal = subtotalCalculo;
      total = totalCalculo;
      impuestos = impuestoCalculo;
      iva = ivaCalculo;
      ieps = iepsCalculo;
      descuento = descuentoCalculo;
      monedero = monederoCalculo;
      console.log(descuento);
      newP.cantidad_venta = parseInt(cantidad_venta) + 1;
      newP.granelProducto = granelBase;
      newP.precio_a_vender = totalCalculo;
      productosVentasTemp.splice(
        producto_encontrado.producto_found.index,
        1,
        newP
      );
    }

    const CalculosData = {
      subTotal: parseFloat(venta_existente.subTotal) + subTotal,
      total: parseFloat(venta_existente.total) + total,
      impuestos: parseFloat(venta_existente.impuestos) + impuestos,
      iva: parseFloat(venta_existente.iva) + iva,
      ieps: parseFloat(venta_existente.ieps) + ieps,
      descuento: parseFloat(venta_existente.descuento) + descuento,
    };
    localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        ...CalculosData,
        cliente:
          venta_actual.venta_cliente === true ? venta_actual.cliente : {},
        venta_cliente:
          venta_actual.venta_cliente === true
            ? venta_actual.venta_cliente
            : false,
        productos: productosVentasTemp,
      })
    );
    setDatosVentasActual({
      ...CalculosData,
    });
    //Recargar la tabla de los productos
    setNewProductoVentas(!newProductoVentas);
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item lg={2}>
          {sesion.empresa.imagen ? (
            <Box className={classes.containerImage}>
              <img
                alt="imagen de empresa"
                src={sesion.empresa.imagen}
                className={classes.imagen}
              />
            </Box>
          ) : null}
        </Grid>
        <Grid item lg={8}>
          <div className={classes.formInputFlex}>
            <Box
              width="100%"
              display="flex"
              justifyItems="center"
              alignSelf="center"
              justifySelf="center"
              alignItems="center"
            >
              <Box mt={2} mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box>
                <Paper className={classes.rootBusqueda}>
                  <InputBase
                    fullWidth
                    placeholder="Buscar producto..."
                    onKeyUp={keyUpEvent}
                  />
                  <IconButton>
                    <Search />
                  </IconButton>
                </Paper>
              </Box>
            </Box>
            <Box
              width="100%"
              display="flex"
              justifyItems="center"
              alignSelf="center"
              justifySelf="center"
              alignItems="center"
            >
              <Box mt={2} mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/usuarios.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box width={250} alignItems="center">
                  <ClientesVentas sesion={sesion} />
                {/* <Paper className={classes.rootBusqueda}>
                  <InputBase fullWidth placeholder="Buscar cliente..." />
                  <IconButton>
                    <Search />
                  </IconButton>
                </Paper> */}
              </Box>
            </Box>
            <Box
              width="100%"
              display="flex"
              justifyItems="center"
              alignSelf="center"
              justifySelf="center"
              alignItems="center"
            >
              <Box mt={2} mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box>
                <Paper className={classes.rootBusqueda}>
                  <InputBase fullWidth placeholder="Buscar vendedor..." />
                  <IconButton>
                    <Search />
                  </IconButton>
                </Paper>
              </Box>
            </Box>
          </div>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <MonedaCambio />
            </Box>
            <Box width="100%" display="flex">
              <Box mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box>
                <FormControl variant="outlined" fullWidth size="small">
                  <Select id="tipo_documento" name="tipo_documento">
                    <MenuItem value="TICKET">
                      <em>Selecciona uno</em>
                    </MenuItem>
                    <MenuItem value="TICKET">TICKET</MenuItem>
                    <MenuItem value="FACTURA">FACTURA</MenuItem>
                    <MenuItem value="NOTA REMISION">NOTA REMISION</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </div>
        </Grid>
        <Grid item lg={2}>
          <Box display="flex" justifyContent="flex-end">
            <Box className={classes.containerImage}>
              <img
                alt="imagen de empresa"
                src={
                  "https://duckduckgo.com/?q=fotos+150x150&atb=v255-1&iax=images&ia=images&iai=https%3A%2F%2Fintrepidplan.com%2Fwp-content%2Fuploads%2F2020%2F02%2Fcropped-favicon-150x150_op.png"
                }
                className={classes.imagen}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid item lg={12}>
        {/* <TablaVentas
          newProductoVentas={newProductoVentas}
          setNewProductoVentas={setNewProductoVentas}
          setDatosVentasActual={setDatosVentasActual}
        /> */}
        <TablaVentasCheckbox
          newProductoVentas={newProductoVentas}
          setNewProductoVentas={setNewProductoVentas}
          setDatosVentasActual={setDatosVentasActual}
        />
      </Grid>

      <Grid container item lg={12} justify="flex-end">
        <Box p={1}>
          <Paper elevation={3}>
            <Box display="flex">
              <Box
                p={1}
                display="flex"
                justifySelf="center"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Iva: $ {DatosVentasActual.iva.toFixed(2)}
                </Typography>
              </Box>
              <Box
                p={1}
                display="flex"
                justifySelf="center"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Descuento: ${DatosVentasActual.descuento.toFixed(2)}
                </Typography>
              </Box>
              <Box
                mr={1}
                display="flex"
                justifySelf="center"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Subtotal: $ {DatosVentasActual.subTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row-reverse" mr={1}>
              <Typography variant="subtitle1">
                Impuestos: $ {DatosVentasActual.impuestos.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row-reverse" mr={1} mt={1}>
              <Typography variant="h5">
                Total: $ {DatosVentasActual.total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Fragment>
  );
}
