import React, { useState, useEffect, useContext } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Portal from "@material-ui/core/Portal";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import useStyles from "./styles";

import { FcBusinessman, FcCalendar, FcSalesPerformance } from "react-icons/fc";
import { FaBarcode, FaMoneyCheckAlt } from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { Search } from "@material-ui/icons";

import TablaVentasCheckbox from "./Tabla_ventas_checkbox";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../gql/Ventas/ventas_generales";
import { useApolloClient } from "@apollo/client";
import ClientesVentas from "./ClientesVentas";
import { VentasContext } from "../../context/Ventas/ventasContext";
import SnackBarMessages from "../../components/SnackBarMessages";

import {
  findProductArray,
  verifiPrising,
  calculatePrices2,
  formatoMexico,
} from "../../config/reuserFunctions";

export default function VentasGenerales() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  // const productosVentas = JSON.parse(localStorage.getItem('productosVentas'));
  const classes = useStyles();
  // const [newProductoVentas, setNewProductoVentas] = useState(false);
  const [granelBase, setGranelBase] = useState({
    granel: false,
    valor: 0,
  });

  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setOpen,
    clientesVentas,
    openBackDrop,
    DatosVentasActual,
    setDatosVentasActual,
  } = useContext(VentasContext);

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();

  const obtenerProductos = async (input) => {
    const response = await client.query({
      query: CONSULTA_PRODUCTO_UNITARIO,
      variables: {
        datosProductos: input.toUpperCase(),
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
      },
      fetchPolicy: "network-only",
    });
    return response;
  };

  const [consultaBase, setConsultaBase] = useState(false);

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
        monedero: parseFloat(venta.monedero),
      });
    }
  }, [updateTablaVentas]);

  const keyUpEvent = async (event) => {
    if (loading) return;
    try {
      if (
        event.code === "Enter" ||
        event.code === "NumpadEnter" ||
        event.type === "click"
      ) {
        setLoading(true);
        const input_value = clave;
        const data = input_value.split("*");
        let datosQuery = {
          data: undefined,
          loading: false,
          error: undefined,
        };
        if (data.length > 1) {
          let data_operation = isNaN(data[0]) ? data[1] : data[0];
          let data_key = isNaN(data[0]) ? data[0] : data[1];
          setGranelBase({
            granel: true,
            valor: parseFloat(data_operation),
          });
          datosQuery = await obtenerProductos(data_key);
          setConsultaBase(!consultaBase);
        } else {
          setGranelBase({
            granel: false,
            valor: 0,
          });
          datosQuery = await obtenerProductos(input_value);
          setConsultaBase(!consultaBase);
        }

        if (datosQuery.error) {
          if (datosQuery.error.networkError) {
            setAlert({
              message: `Error de servidor`,
              status: "error",
              open: true,
            });
          } else if (datosQuery.error.graphQLErrors) {
            setAlert({
              message: `${datosQuery.error.graphQLErrors[0]?.message}`,
              status: "error",
              open: true,
            });
          }
          setLoading(false);
          return;
        }
        if (datosQuery.data) {
          let productosBase = datosQuery.data.obtenerUnProductoVentas;
          if (productosBase !== null) {
            if (productosBase.cantidad !== null) {
              agregarProductos(productosBase);
            } else {
              setOpen(true);
              setAlert({
                message: `Este producto no existe`,
                status: "error",
                open: true,
              });
            }
          }
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const agregarProductos = async (producto) => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? {
            subTotal: 0,
            total: 0,
            impuestos: 0,
            iva: 0,
            ieps: 0,
            descuento: 0,
            monedero: 0,
          }
        : venta;

    let productosVentasTemp = productosVentas;

    let CalculosData = {
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    };

    const producto_encontrado = await findProductArray(producto);

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      //Tomar el precio con descuento o normal
      const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_neto
        : newP.precio_unidad.precio_neto;

      const new_prices = await calculatePrices2({
        newP,
        cantidad: 0,
        granel: granelBase,
        origen: "Ventas1",
        precio_boolean: false,
      });

      new_prices.newP.precio_anterior = productoPrecioFinal;

      new_prices.newP.iva_total_producto = parseFloat(new_prices.ivaCalculo);
      new_prices.newP.ieps_total_producto = parseFloat(new_prices.iepsCalculo);
      new_prices.newP.impuestos_total_producto = parseFloat(
        new_prices.impuestoCalculo
      );
      new_prices.newP.subtotal_total_producto = parseFloat(
        new_prices.subtotalCalculo
      );
      new_prices.newP.total_total_producto = parseFloat(
        new_prices.totalCalculo
      );

      // console.log(new_prices.newP);

      productosVentasTemp.push(new_prices.newP);

      CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) +
          parseFloat(new_prices.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) +
          parseFloat(new_prices.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) +
          parseFloat(new_prices.impuestoCalculo),
        iva:
          parseFloat(venta_existente.iva) + parseFloat(new_prices.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) + parseFloat(new_prices.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) +
          parseFloat(new_prices.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) +
          parseFloat(new_prices.monederoCalculo),
      };
    } else if (producto_encontrado.found && producto._id) {
      const {
        cantidad_venta,
        ...newP
      } = producto_encontrado.producto_found.producto;

      newP.cantidad_venta = parseInt(cantidad_venta) + 1;

      const verify_prising = await verifiPrising(newP);

      // console.log(verify_prising);

      //Verificar si el precio fue encontrado
      if (verify_prising.found) {
        const calculo_resta = await calculatePrices2({
          newP,
          cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: newP.precio_actual_object,
        });

        const calculo_sumar = await calculatePrices2({
          newP,
          cantidad_venta: newP.cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: verify_prising.object_prising,
        });

        newP.precio_a_vender = calculo_sumar.totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = verify_prising.pricing;

        // console.log(calculo_sumar);

        newP.iva_total_producto = parseFloat(calculo_sumar.ivaCalculo);
        newP.ieps_total_producto = parseFloat(calculo_sumar.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(
          calculo_sumar.impuestoCalculo
        );
        newP.subtotal_total_producto = parseFloat(
          calculo_sumar.subtotalCalculo
        );
        newP.total_total_producto = parseFloat(calculo_sumar.totalCalculo);

        // console.log(newP);

        newP.precio_actual_object = {
          cantidad_unidad: verify_prising.object_prising.cantidad_unidad
            ? verify_prising.object_prising.cantidad_unidad
            : null,
          numero_precio: verify_prising.object_prising.numero_precio
            ? verify_prising.object_prising.numero_precio
            : null,
          unidad_maxima: verify_prising.object_prising.unidad_maxima
            ? verify_prising.object_prising.unidad_maxima
            : null,
          precio_general: verify_prising.object_prising.precio_general
            ? verify_prising.object_prising.precio_general
            : null,
          precio_neto: verify_prising.object_prising.precio_neto
            ? verify_prising.object_prising.precio_neto
            : null,
          precio_venta: verify_prising.object_prising.precio_venta
            ? verify_prising.object_prising.precio_venta
            : null,
          iva_precio: verify_prising.object_prising.iva_precio
            ? verify_prising.object_prising.iva_precio
            : null,
          ieps_precio: verify_prising.object_prising.ieps_precio
            ? verify_prising.object_prising.ieps_precio
            : null,
          utilidad: verify_prising.object_prising.utilidad
            ? verify_prising.object_prising.utilidad
            : null,
          porciento: verify_prising.object_prising.porciento
            ? verify_prising.object_prising.porciento
            : null,
          dinero_descontado: verify_prising.object_prising.dinero_descontado
            ? verify_prising.object_prising.dinero_descontado
            : null,
        };

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(calculo_resta.subtotalCalculo) +
            calculo_sumar.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(calculo_resta.totalCalculo) +
            calculo_sumar.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(calculo_resta.impuestoCalculo) +
            calculo_sumar.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(calculo_resta.ivaCalculo) +
            calculo_sumar.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(calculo_resta.iepsCalculo) +
            calculo_sumar.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(calculo_resta.descuentoCalculo) +
            calculo_sumar.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(calculo_resta.monederoCalculo) +
            calculo_sumar.monederoCalculo,
        };
      } else {
        // console.log("Entro");
        const productoPrecioFinal = newP.descuento_activo
          ? newP.descuento.precio_neto
          : newP.precio_unidad.precio_neto;

        const new_prices = await calculatePrices2({
          newP,
          cantidad: 0,
          granel: granelBase,
          origen: "Ventas2",
        });

        new_prices.newP.precio_actual_producto = productoPrecioFinal;

        // console.log(new_prices);

        new_prices.newP.iva_total_producto =
          parseFloat(new_prices.ivaCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.ieps_total_producto =
          parseFloat(new_prices.iepsCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.impuestos_total_producto =
          parseFloat(new_prices.impuestoCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.subtotal_total_producto =
          parseFloat(new_prices.subtotalCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.total_total_producto =
          parseFloat(new_prices.totalCalculo) * parseFloat(newP.cantidad_venta);

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          new_prices.newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) +
            parseFloat(new_prices.subtotalCalculo),
          total: parseFloat(venta_existente.total) + new_prices.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) + new_prices.impuestoCalculo,
          iva: parseFloat(venta_existente.iva) + new_prices.ivaCalculo,
          ieps: parseFloat(venta_existente.ieps) + new_prices.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) + new_prices.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) + new_prices.monederoCalculo,
        };
      }
    }

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
    localStorage.setItem(
      "VentaOriginal",
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
    setUpdateTablaVentas(!updateTablaVentas);
  };

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Paper>
        <Grid container spacing={3} style={{ padding: 8 }}>
          <Grid item md={4} xs={12}>
            <Box
              width="100%"
              display="flex"
              justifyItems="center"
              alignSelf="center"
              justifySelf="center"
              alignItems="center"
            >
              <Box mt={1} mx={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <TextField
                fullWidth
                placeholder="Buscar producto..."
                variant="outlined"
                size="small"
                onKeyUp={(e) => keyUpEvent(e)}
                onChange={(e) => setClave(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {loading ? (
                        <IconButton disabled={loading}>
                          <CircularProgress size={20} color="primary" />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={(e) => keyUpEvent(e)}
                          disabled={loading}
                        >
                          <Search />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              width="100%"
              display="flex"
              justifyItems="center"
              alignSelf="center"
              justifySelf="center"
              alignItems="center"
            >
              <Box mt={1} mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/usuarios.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box width="100%" alignItems="center">
                <ClientesVentas sesion={sesion} />
                {/* <Paper className={classes.rootBusqueda}>
                  <InputBase fullWidth placeholder="Buscar cliente..." />
                  <IconButton>
                    <Search />
                  </IconButton>
                </Paper> */}
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box width="100%" display="flex">
              <Box mr={1}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box width="100%">
                <FormControl variant="outlined" fullWidth size="small">
                  <Select
                    id="tipo_documento"
                    value="TICKET"
                    name="tipo_documento"
                  >
                    <MenuItem value="">
                      <em>Selecciona uno</em>
                    </MenuItem>
                    <MenuItem value="TICKET">TICKET</MenuItem>
                    <MenuItem value="FACTURA">FACTURA</MenuItem>
                    <MenuItem value="NOTA REMISION">NOTA REMISION</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box
        height="100%"
        style={
          loading
            ? {
                pointerEvents: "none",
                opacity: 0.6,
              }
            : null
        }
      >
        <TablaVentasCheckbox setDatosVentasActual={setDatosVentasActual} />
      </Box>

      <Box display="flex" justifyContent="flex-end" flexDirection="column">
        <Paper variant="outlined">
          <Grid container spacing={2}>
            <Grid item md={6} sm={6} xs={12}>
              <Box mx={2}>
                <Grid container>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <FcBusinessman style={{ fontSize: 19 }} />
                        <Box mr={1} />
                        <Typography variant="subtitle1">
                          Cliente:{" "}
                          <b style={{ fontSize: 16 }}>
                            {clientesVentas
                              ? clientesVentas.nombre_cliente
                              : ""}
                          </b>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={5} xs={12}>
                    <Box display="flex" alignItems="center">
                      <AiOutlineFieldNumber style={{ fontSize: 19 }} />
                      <Box mr={1} />
                      <Typography variant="subtitle1">
                        Cliente.:{" "}
                        <b style={{ fontSize: 16 }}>
                          {clientesVentas ? clientesVentas.numero_cliente : ""}
                        </b>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={7} xs={12}>
                    <Box display="flex" alignItems="center">
                      <FaBarcode style={{ fontSize: 19 }} />
                      <Box mr={1} />
                      <Typography variant="subtitle1">
                        Clave Clte.:{" "}
                        <b style={{ fontSize: 16 }}>
                          {clientesVentas ? clientesVentas.clave_cliente : ""}
                        </b>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={5} xs={12}>
                    <Box display="flex" alignItems="center">
                      <FcCalendar style={{ fontSize: 19 }} />
                      <Box mr={1} />
                      <Typography variant="subtitle1">
                        Dias Credito:{" "}
                        <b style={{ fontSize: 16 }}>
                          {clientesVentas && clientesVentas.dias_credito
                            ? clientesVentas.dias_credito
                            : 0}
                        </b>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={7} xs={12}>
                    <Box display="flex" alignItems="center">
                      <FaMoneyCheckAlt style={{ fontSize: 19 }} />
                      <Box mr={1} />
                      <Typography variant="subtitle1">
                        Limite Credito:{" "}
                        <b style={{ fontSize: 16 }}>
                          $
                          {clientesVentas && clientesVentas.limite_credito
                            ? formatoMexico(clientesVentas.limite_credito)
                            : 0}
                        </b>
                      </Typography>
                    </Box>
                  </Grid>
                 {/* <Grid item md={6} xs={12}>
                     <Box
                    flexDirection="row-reverse"
                    display="flex"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        Descs.:{" "}
                        <b style={{ fontSize: 16 }}>
                          {clientesVentas ? clientesVentas.numero_descuento : 0}
                          %
                        </b>
                      </Typography>
                    </Box>
                    <Box mt={0.5} mr={1}>
                      <AiOutlineFieldNumber style={{ fontSize: 22 }} />
                    </Box>
                  </Box> 
                  </Grid>*/}
                </Grid>
              </Box>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={6} xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="row-reverse"
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        Monedero :{" "}
                        <b style={{ fontSize: 17 }}>
                          ${" "}
                          {DatosVentasActual
                            ? DatosVentasActual.monedero
                              ? formatoMexico(DatosVentasActual.monedero)
                              : 0
                            : 0}
                        </b>
                      </Typography>
                    </Box>
                    <Box mt={0.5} mr={1}>
                      <FcSalesPerformance style={{ fontSize: 19 }} />
                    </Box>
                  </Box>
                  <Box
                    flexDirection="row-reverse"
                    alignItems="center"
                    display="flex"
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        Descuento:{" "}
                        <b style={{ fontSize: 17 }}>
                          ${" "}
                          {DatosVentasActual
                            ? DatosVentasActual.descuento
                              ? formatoMexico(DatosVentasActual.descuento)
                              : 0
                            : 0}
                        </b>
                      </Typography>
                    </Box>
                    <Box mt={0.5} mr={1}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/price-tag.png"
                          alt="icono admin"
                          style={{ width: 20 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Box flexDirection="row-reverse" display="flex" mr={1}>
                    <Typography variant="subtitle1">
                      Subtotal:{" "}
                      <b style={{ fontSize: 17 }}>
                        ${" "}
                        {DatosVentasActual?.subTotal
                          ? formatoMexico(DatosVentasActual.subTotal)
                          : 0}
                      </b>
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="row-reverse" mr={1}>
                    <Typography variant="subtitle1">
                      Impuestos:{" "}
                      <b style={{ fontSize: 17 }}>
                        ${" "}
                        {DatosVentasActual?.impuestos
                          ? formatoMexico(DatosVentasActual.impuestos)
                          : 0}
                      </b>
                    </Typography>
                  </Box>
                  {/* <Box flexDirection="row-reverse" display="flex" mr={1}>
                    <Typography variant="subtitle1">
                      Iva:{" "}
                      <b style={{ fontSize: 17 }}>
                        ${" "}
                        {DatosVentasActual?.iva
                          ? DatosVentasActual.iva.toFixed(2)
                          : 0}
                      </b>
                    </Typography>
                  </Box> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box display="flex" flexDirection="row-reverse" p={1}>
            <Typography variant="h4">
              Total:{" "}
              <b style={{ color: "green" }}>
                $
                {DatosVentasActual?.total
                  ? formatoMexico(DatosVentasActual.total)
                  : 0}
              </b>
            </Typography>
            {/* <Box mt={0.5} mr={1}>
              <MonetizationOnIcon style={{ fontSize: 37, color: "green" }} />
            </Box> */}
          </Box>
        </Paper>
      </Box>
      <Portal>
        <Backdrop style={{ zIndex: "99999" }} open={openBackDrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Portal>
    </Box>
  );
}
