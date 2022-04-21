import React, { useState, useEffect, useContext, Fragment } from "react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import useStyles from "../styles";
import { Search } from "@material-ui/icons";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../../gql/Ventas/ventas_generales";
import { useApolloClient } from "@apollo/client";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import SnackBarMessages from "../../../components/SnackBarMessages";

import {
  findProductArray,
  verifiPrising,
  calculatePrices2,
} from "../../../config/reuserFunctions";
import ProductoConMedidas from "./ProductoConMedidas";

export default function AgregarProductoVenta({ loading, setLoading }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
  /* const [granelBase, setGranelBase] = useState({
    granel: false,
    valor: 0,
  }); */

  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    /* setOpen, */
    setDatosVentasActual,
  } = useContext(VentasContext);

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [clave, setClave] = useState("");
  const client = useApolloClient();
  const [openMedidas, setOpenMedidas] = useState(false);
  const [producto, setProducto] = useState([]);

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
    if (!clave) return;
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
        let granel_base = {
          granel: false,
          valor: 0,
        };
        if (data.length > 1) {
          let data_operation = isNaN(data[0]) ? data[1] : data[0];
          let data_key = isNaN(data[0]) ? data[0] : data[1];
          /* setGranelBase({
            granel: true,
            valor: parseFloat(data_operation),
          }); */
          granel_base = {
            granel: true,
            valor: parseFloat(data_operation),
          };
          datosQuery = await obtenerProductos(data_key);
          setConsultaBase(!consultaBase);
        } else {
          /* setGranelBase({
            granel: false,
            valor: 0,
          }); */
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
            if (productosBase.length === 1) {
              if (productosBase[0].cantidad !== null) {
                agregarProductos(productosBase[0], granel_base);
              } else {
                /* setOpen(true); */
                setAlert({
                  message: `Este producto no existe`,
                  status: "error",
                  open: true,
                });
              }
            } else if (productosBase.length > 0) {
              setOpenMedidas(true);
              setProducto(productosBase);
            } else {
              /* setOpen(true); */
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

  const agregarProductos = async (producto, granel) => {
    let granel_base = granel
      ? granel
      : {
          granel: false,
          valor: 0,
        };
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
        granel: granel_base,
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
      //agregar producto al inicio del arreglo
      productosVentasTemp.splice(0, 0, new_prices.newP);

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
          granel: granel_base,
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
    setProducto([]);
    setOpenMedidas(false);
    /* setGranelBase({
      granel: false,
      valor: 0,
    }); */
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <ProductoConMedidas
        agregarProductos={agregarProductos}
        open={openMedidas}
        setOpen={setOpenMedidas}
        productos={producto}
      />
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
                  <IconButton onClick={(e) => keyUpEvent(e)} disabled={loading}>
                    <Search />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          inputProps={{ style: { textTransform: "uppercase" } }}
        />
      </Box>
    </Fragment>
  );
}
