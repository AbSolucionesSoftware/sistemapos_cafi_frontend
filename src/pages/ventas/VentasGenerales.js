import React, { useState, useEffect, useContext } from "react";
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
} from "@material-ui/core";
import useStyles from "./styles";

import { FcRating, FcBusinessman, FcCalendar, FcSalesPerformance } from 'react-icons/fc';
import { FaBarcode, FaMoneyCheckAlt } from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { Search } from "@material-ui/icons";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import TablaVentasCheckbox from "./Tabla_ventas_checkbox";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../gql/Ventas/ventas_generales";
import { useLazyQuery } from "@apollo/client";
import ClientesVentas from "./ClientesVentas";
import { VentasContext } from "../../context/Ventas/ventasContext";
import SnackBarMessages from '../../components/SnackBarMessages';

import { Fragment } from "react";
import MonedaCambio from "./Operaciones/MonedaCambio";
import Cotizacion from './Cotizacion/Cotizacion'

import {
  findProductArray,
  calculatePrices,
  verifiPrising
} from "../../config/reuserFunctions";

// import { ClienteProvider } from '../../context/Catalogos/crearClienteCtx';

export default function VentasGenerales() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  // const productosVentas = JSON.parse(localStorage.getItem('productosVentas'));
  const classes = useStyles();
  // const [newProductoVentas, setNewProductoVentas] = useState(false);
  const [granelBase, setGranelBase] = useState({
    granel: false,
    valor: 0,
  });

  const { updateTablaVentas, setUpdateTablaVentas, setOpen, clientesVentas  } = useContext(VentasContext);

  const [DatosVentasActual, setDatosVentasActual] = useState({
    subTotal: 0,
    total: 0,
    impuestos: 0,
    iva: 0,
    ieps: 0,
    descuento: 0,
    monedero: 0,
    tipo_cambio: {},
  });

  const [alert, setAlert] = useState({ message: '', status: '', open: false });

  const [obtenerProductos, { data, loading, error }] = useLazyQuery(
    CONSULTA_PRODUCTO_UNITARIO,
    {
      variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
      fetchPolicy: "network-only",
    }
  );

  // console.log(error);

  let productosBase = null;
  if (data) productosBase = data.obtenerUnProductoVentas;

  // console.log(productosBase);

  useEffect(() => {
    // console.log("Entro");
    // console.log(productosBase);
    if(error){
      if(error.networkError){
          console.log(error.networkError.result.errors);
          setAlert({ message: `Error de servidor`, status: 'error', open: true });
        }else if(error.graphQLErrors){
          console.log(error.graphQLErrors);
          setAlert({ message: `${error.graphQLErrors[0]?.message}`, status: 'error', open: true });
        }
    }else{
      // console.log(productosBase);
      if(productosBase !== null){
        if (productosBase.cantidad !== null) {
          agregarProductos(productosBase);
        }else{
          setOpen(true);
          setAlert({ message: `Este producto no existe`, status: 'error', open: true });
          // console.log("El producto no existe");
        }
      }
    }
  }, [loading]);

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
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      const input_value = event.target.value.trim();
      const data = input_value.split("*");
      // console.log(data);
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
            sucursal: sesion.sucursal._id, 
            empresa: sesion.empresa._id
          },
          fetchPolicy: "network-only"
        });
      } else {
        // console.log(input_value);444567890-
        setGranelBase({
          granel: false,
          valor: 0,
        });
        obtenerProductos({
          variables: {
            datosProductos: input_value,
            sucursal: sesion.sucursal._id,
            empresa: sesion.empresa._id
          },
          fetchPolicy: "network-only"
        });
      }
    }
  };

  const agregarProductos = async (producto) => {
    // console.log(producto);
    // console.log(granelBase);
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
    // console.log(productosVentas);
    let productosVentasTemp = productosVentas;
    let subTotal = 0,
      total = 0,
      impuestos = 0,
      iva = 0,
      ieps = 0,
      descuento = 0,
      monedero = 0;

    //Calculos de impuestos que se van a restar de la venta;
    let calculoResta = {};
    //Calculos de impuestos que se van a sumar a la venta
    let calculoSuma = {};

    // let CalculosData = {};

    const producto_encontrado = await findProductArray(
      productosVentas,
      producto
    );

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      // newP.precio_actual_producto =
      const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_con_descuento
        : newP.precio;
      const {
        subtotalCalculo,
        totalCalculo,
        impuestoCalculo,
        ivaCalculo,
        iepsCalculo,
        descuentoCalculo,
        monederoCalculo,
      } = await calculatePrices(newP, 0, granelBase, productoPrecioFinal);
      // console.log(monederoCalculo);
      subTotal = subtotalCalculo;
      total = totalCalculo;
      impuestos = impuestoCalculo;
      iva = ivaCalculo;
      ieps = iepsCalculo;
      descuento = descuentoCalculo;
      monedero = monederoCalculo;
      // console.log(monedero);
      newP.cantidad_venta = 1;
      newP.granel_producto = granelBase;
      newP.precio_a_vender = totalCalculo;
      newP.precio_actual_producto = productoPrecioFinal;
      newP.precio_anterior = productoPrecioFinal;
      productosVentasTemp.push(newP);
      const CalculosData = {
        subTotal: parseFloat(venta_existente.subTotal) + subTotal,
        total: parseFloat(venta_existente.total) + total,
        impuestos: parseFloat(venta_existente.impuestos) + impuestos,
        iva: parseFloat(venta_existente.iva) + iva,
        ieps: parseFloat(venta_existente.ieps) + ieps,
        descuento: parseFloat(venta_existente.descuento) + descuento,
        monedero: parseFloat(venta_existente.monedero) + monedero,
      };
      // console.log("Primer precio",CalculosData);
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
      setUpdateTablaVentas(!updateTablaVentas);

    } else if (producto_encontrado.found && producto._id) {
      const { cantidad_venta, ...newP } =
        producto_encontrado.producto_found.producto;
      newP.cantidad_venta = parseInt(cantidad_venta) + 1;
      // console.log(newP);
      const verify_prising = await verifiPrising(newP);
      // console.log(verify_prising);
      //Verificar si el precio fue encontrado
      if (verify_prising.found) {
        console.log("Entro a aqui nuevo precio");
        calculoResta = await calculatePrices(
          newP,
          cantidad_venta,
          newP.granel_producto,
          newP.precio_actual_producto,
          "TABLA"
        );

        //Sacar los impuestos que se van a sumar
        calculoSuma = await calculatePrices(
          newP,
          newP.cantidad_venta,
          newP.granel_producto,
          verify_prising.pricing,
          "TABLA"
        );

        // console.log(calculoSuma);
        // console.log(calculoSuma);

        newP.precio_a_vender = calculoSuma.totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = verify_prising.pricing;
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        const CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(calculoResta.subtotalCalculo) +
            calculoSuma.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(calculoResta.totalCalculo) +
            calculoSuma.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(calculoResta.impuestoCalculo) +
            calculoSuma.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(calculoResta.ivaCalculo) +
            calculoSuma.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(calculoResta.iepsCalculo) +
            calculoSuma.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(calculoResta.descuentoCalculo) +
            calculoSuma.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(calculoResta.monederoCalculo) +
            calculoSuma.monederoCalculo,
        }; 
        // console.log("Llego a nuevo precio",CalculosData);
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
        setUpdateTablaVentas(!updateTablaVentas);
      } else {
        // console.log("Entro a aqui");
        // console.log(verify_prising);
        const productoPrecioFinal = newP.descuento_activo
          ? newP.descuento.precio_con_descuento
          : newP.precio;
        const {
          subtotalCalculo,
          totalCalculo,
          impuestoCalculo,
          ivaCalculo,
          iepsCalculo,
          descuentoCalculo,
          monederoCalculo,
        } = await calculatePrices(newP, 0, granelBase, productoPrecioFinal);
        subTotal = subtotalCalculo;
        total = totalCalculo;
        impuestos = impuestoCalculo;
        iva = ivaCalculo;
        ieps = iepsCalculo;
        descuento = descuentoCalculo;
        monedero = monederoCalculo;

        newP.granel_producto = granelBase;
        newP.precio_a_vender = totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = productoPrecioFinal;
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        const CalculosData = {
          subTotal: parseFloat(venta_existente.subTotal) + subTotal,
          total: parseFloat(venta_existente.total) + total,
          impuestos: parseFloat(venta_existente.impuestos) + impuestos,
          iva: parseFloat(venta_existente.iva) + iva,
          ieps: parseFloat(venta_existente.ieps) + ieps,
          descuento: parseFloat(venta_existente.descuento) + descuento,
          monedero: parseFloat(venta_existente.monedero) + monedero,
        };
        // console.log("Precio normal",CalculosData);
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
        setUpdateTablaVentas(!updateTablaVentas);
      }
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
        <Box height='9%'>
          <div className={classes.formInputFlex}>
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
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg"
                  alt="iconoBander"
                  className={classes.iconSize}
                />
              </Box>
              <Box width="100%">
                <Paper className={classes.rootBusqueda}>
                  <InputBase
                    width="100%"
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
              <Box width="100%" >
                <FormControl variant="outlined" fullWidth size="small">
                  <Select id="tipo_documento" name="tipo_documento">
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
          </div>
        </Box>

        <Box height='65%'>
          <TablaVentasCheckbox setDatosVentasActual={setDatosVentasActual} />
        </Box>
        
        <Box display='flex' justifyContent='flex-end' flexDirection='column' height='25%'>
          <Paper elevantion={3} style={{padding: 2, marginTop: 2}}> 
            <Grid container>
              <Grid item lg={7}>
                  <Grid 
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"  
                  >
                    <Grid item lg={7}>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Cliente: <b style={{fontSize: 16}}>{clientesVentas ? clientesVentas.nombre_cliente : ""}</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1}>
                          <FcBusinessman style={{fontSize: 19}} />
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                        <Typography variant="subtitle1">
                            Cliente.: <b style={{fontSize: 16}}>{clientesVentas ? clientesVentas.numero_cliente : ""}</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1} >
                          <AiOutlineFieldNumber style={{fontSize: 22}} />
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Clave Clte.: <b style={{fontSize: 16}}>{clientesVentas ? clientesVentas.clave_cliente : ""}</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1}>
                          <FaBarcode style={{fontSize: 19}} />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item lg={5}>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Limite Credito: <b style={{fontSize: 16}}>${clientesVentas ? clientesVentas.limite_credito : 0}</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1}>
                          <FaMoneyCheckAlt style={{fontSize: 19}} />
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                          Descs.: <b style={{fontSize: 16}}>{clientesVentas ? clientesVentas.numero_descuento : 0}%</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1}>
                          <AiOutlineFieldNumber style={{fontSize: 22}} />
                        </Box>
                      </Box>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">
                            Dias Credito: <b style={{fontSize: 16}}>{clientesVentas ? clientesVentas.dias_credito : 0} Dias</b>
                          </Typography>
                        </Box>
                        <Box mt={.5} mr={1}>
                          <FcCalendar style={{fontSize: 19}} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
              </Grid>
              <Grid item lg={5}>
                <Grid container>
                  <Grid item lg={7}>
                    <Box display="flex" alignItems="center" flexDirection="row-reverse" >
                      <Box>
                        <Typography variant="subtitle1">
                          Monedero : <b style={{fontSize: 17}}>$ {DatosVentasActual ? DatosVentasActual?.monedero?.toFixed(2) : 0}</b>
                        </Typography>
                      </Box>
                      <Box mt={.5} mr={1}>
                        <FcSalesPerformance style={{fontSize: 19}} />
                      </Box>
                    </Box>
                    <Box
                      flexDirection="row-reverse"
                      alignItems="center"
                      display="flex"
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          Descuento: <b style={{fontSize: 17}}>${DatosVentasActual ? DatosVentasActual?.descuento?.toFixed(2) : 0}</b>
                        </Typography>
                      </Box>
                      <Box mt={.5} mr={1}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <img 
                              src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/price-tag.png' 
                              alt="icono admin" 
                              style={{width: 20}}                                   
                            />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={5}>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        mr={1}
                      >
                        <Typography variant="subtitle1">
                          Subtotal: <b style={{fontSize: 17}}>$ {DatosVentasActual?.subTotal ? DatosVentasActual?.subTotal?.toFixed(2) : 0}</b>
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="row-reverse" mr={1}>
                        <Typography variant="subtitle1">
                          Impuestos: <b style={{fontSize: 17}}>$ {DatosVentasActual?.impuestos ? DatosVentasActual?.impuestos?.toFixed(2) : 0}</b>
                        </Typography>
                      </Box>
                      <Box
                        flexDirection="row-reverse"
                        display="flex"
                        mr={1}
                      >
                        <Typography variant="subtitle1" >
                          Iva: <b style={{fontSize: 17}}>$ {DatosVentasActual?.iva ? DatosVentasActual.iva.toFixed(2) : 0}</b>
                        </Typography>
                      </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box display="flex" flexDirection="row-reverse" p={1}>
              <Typography variant="h4">
                Total: <b style={{color: "green"}}>${DatosVentasActual?.total ? DatosVentasActual?.total.toFixed(2) : 0}</b>
              </Typography>
              <Box mt={.5} mr={1}>
                <MonetizationOnIcon style={{fontSize: 37, color: "green"}} />
              </Box>
              <Box p={1}>
                <Cotizacion type="GENERAR" />
              </Box>
            </Box>
          </Paper>
        </Box>
    </Fragment>
  );
}
