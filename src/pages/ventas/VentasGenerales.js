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

import { /* FcRating, */ FcBusinessman, FcCalendar, FcSalesPerformance } from 'react-icons/fc';
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
// import MonedaCambio from "./Operaciones/MonedaCambio";
import Cotizacion from './Cotizacion/Cotizacion'

import {
  findProductArray,
  verifiPrising,
  calculatePrices2
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
      fetchPolicy: "network-only"
    }
  );

  const [consultaBase, setConsultaBase] = useState(false);

  let productosBase = null;
  if(error){
    console.log(data,loading, error.networkError);
    console.log(data,loading, error.graphQLErrors);
  }
  // console.log(data,loading, error);
  if (data) productosBase = data.obtenerUnProductoVentas;
  // console.log(productosBase);

  useEffect(() => {
    if(error){
      if(error.networkError){
          setAlert({ message: `Error de servidor`, status: 'error', open: true });
        }else if(error.graphQLErrors){
          setAlert({ message: `${error.graphQLErrors[0]?.message}`, status: 'error', open: true });
        }
    }else{
      if(productosBase !== null){
        if (productosBase.cantidad !== null) {
          agregarProductos(productosBase);
        }else{
          setOpen(true);
          setAlert({ message: `Este producto no existe`, status: 'error', open: true });
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
      if (data.length > 1) {
        let data_operation = isNaN(data[0]) ? data[1] : data[0];
        let data_key = isNaN(data[0]) ? data[0] : data[1];
        setGranelBase({
          granel: true,
          valor: parseFloat(data_operation),
        });
        obtenerProductos({
          variables: {
            datosProductos: data_key,
            sucursal: sesion.sucursal._id, 
            empresa: sesion.empresa._id
          },
          fetchPolicy: "network-only"
        });
        setConsultaBase(!consultaBase);
      } else {
        setGranelBase({
          granel: false,
          valor: 0,
        });
        obtenerProductos({
          variables: {            datosProductos: input_value,
            sucursal: sesion.sucursal._id,
            empresa: sesion.empresa._id
          },
          fetchPolicy: "network-only"
        });
        setConsultaBase(!consultaBase);
      }
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
      monedero: 0
    };

    const producto_encontrado = await findProductArray(
      producto
    );

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      //Tomar el precio con descuento o normal
      const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_neto
        : newP.precio_unidad.precio_neto;

      const new_prices = await calculatePrices2({newP,cantidad: 0, granel: granelBase, origen: "Ventas1", precio_boolean: false });

      new_prices.newP.precio_anterior = productoPrecioFinal;

      new_prices.newP.iva_total_producto = parseFloat(new_prices.ivaCalculo);
      new_prices.newP.ieps_total_producto = parseFloat(new_prices.iepsCalculo);
      new_prices.newP.impuestos_total_producto = parseFloat(new_prices.impuestoCalculo);
      new_prices.newP.subtotal_total_producto = parseFloat(new_prices.subtotalCalculo);
      new_prices.newP.total_total_producto = parseFloat(new_prices.totalCalculo);

      console.log(new_prices.newP);
      
      productosVentasTemp.push(new_prices.newP);

      CalculosData = {
        subTotal: parseFloat(venta_existente.subTotal) + parseFloat(new_prices.subtotalCalculo),
        total: parseFloat(venta_existente.total) + parseFloat(new_prices.totalCalculo),
        impuestos: parseFloat(venta_existente.impuestos) + parseFloat(new_prices.impuestoCalculo),
        iva: parseFloat(venta_existente.iva) + parseFloat(new_prices.ivaCalculo),
        ieps: parseFloat(venta_existente.ieps) + parseFloat(new_prices.iepsCalculo),
        descuento: parseFloat(venta_existente.descuento) + parseFloat(new_prices.descuentoCalculo),
        monedero: parseFloat(venta_existente.monedero) + parseFloat(new_prices.monederoCalculo)
      };


    } else if (producto_encontrado.found && producto._id) {
      
      const { cantidad_venta, ...newP } = producto_encontrado.producto_found.producto;
      
      newP.cantidad_venta = parseInt(cantidad_venta) + 1;

      const verify_prising = await verifiPrising(newP);

      console.log(verify_prising);

      //Verificar si el precio fue encontrado
      if (verify_prising.found) {
        const calculo_resta = await calculatePrices2({newP,cantidad_venta, granel: newP.granel_producto, origen: '', precio_boolean: true, precio: newP.precio_actual_object });
        
        const calculo_sumar = await calculatePrices2({newP,cantidad_venta: newP.cantidad_venta, granel: newP.granel_producto, origen: '', precio_boolean: true, precio: verify_prising.object_prising });

        newP.precio_a_vender = calculo_sumar.totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = verify_prising.pricing;

        console.log(calculo_sumar);
        
        newP.iva_total_producto = parseFloat(calculo_sumar.ivaCalculo);
        newP.ieps_total_producto = parseFloat(calculo_sumar.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(calculo_sumar.impuestoCalculo);
        newP.subtotal_total_producto = parseFloat(calculo_sumar.subtotalCalculo);
        newP.total_total_producto = parseFloat(calculo_sumar.totalCalculo);

        console.log(newP);


        newP.precio_actual_object = {
          cantidad_unidad: verify_prising.object_prising.cantidad_unidad ? verify_prising.object_prising.cantidad_unidad : null,
          numero_precio: verify_prising.object_prising.numero_precio ? verify_prising.object_prising.numero_precio : null,
          unidad_maxima: verify_prising.object_prising.unidad_maxima ? verify_prising.object_prising.unidad_maxima : null,
          precio_general: verify_prising.object_prising.precio_general ? verify_prising.object_prising.precio_general : null,
          precio_neto: verify_prising.object_prising.precio_neto ? verify_prising.object_prising.precio_neto : null,
          precio_venta: verify_prising.object_prising.precio_venta ? verify_prising.object_prising.precio_venta : null,
          iva_precio: verify_prising.object_prising.iva_precio ? verify_prising.object_prising.iva_precio : null,
          ieps_precio: verify_prising.object_prising.ieps_precio ? verify_prising.object_prising.ieps_precio : null,
          utilidad: verify_prising.object_prising.utilidad ? verify_prising.object_prising.utilidad : null,
          porciento: verify_prising.object_prising.porciento ? verify_prising.object_prising.porciento : null,
          dinero_descontado: verify_prising.object_prising.dinero_descontado ? verify_prising.object_prising.dinero_descontado : null,
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
        console.log("Entro");
        const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_neto
        : newP.precio_unidad.precio_neto;

        const new_prices = await calculatePrices2({newP, cantidad: 0, granel: granelBase, origen: "Ventas2"});

        new_prices.newP.precio_actual_producto = productoPrecioFinal;

        console.log(new_prices);

        new_prices.newP.iva_total_producto = parseFloat(new_prices.ivaCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.ieps_total_producto = parseFloat(new_prices.iepsCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.impuestos_total_producto = parseFloat(new_prices.impuestoCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.subtotal_total_producto = parseFloat(new_prices.subtotalCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.total_total_producto = parseFloat(new_prices.totalCalculo) * parseFloat(newP.cantidad_venta);
        
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          new_prices.newP
        );

        CalculosData = {
          subTotal: parseFloat(venta_existente.subTotal) + parseFloat(new_prices.subtotalCalculo),
          total: parseFloat(venta_existente.total) + new_prices.totalCalculo,
          impuestos: parseFloat(venta_existente.impuestos) + new_prices.impuestoCalculo,
          iva: parseFloat(venta_existente.iva) + new_prices.ivaCalculo,
          ieps: parseFloat(venta_existente.ieps) + new_prices.iepsCalculo,
          descuento: parseFloat(venta_existente.descuento) + new_prices.descuentoCalculo,
          monedero: parseFloat(venta_existente.monedero) + new_prices.monederoCalculo,
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
    setDatosVentasActual({
      ...CalculosData,
    });
    setUpdateTablaVentas(!updateTablaVentas);

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
            {/* <Box width="100%">
              <MonedaCambio />
            </Box> */}
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
                  <Select id="tipo_documento" value="TICKET" name="tipo_documento">
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
                      {/* <Box
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
                      </Box> */}P
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
                      {/* <Box
                        flexDirection="row-reverse"
                        display="flex"
                        mr={1}
                      >
                        <Typography variant="subtitle1" >
                          Iva: <b style={{fontSize: 17}}>$ {DatosVentasActual?.iva ? DatosVentasActual.iva.toFixed(2) : 0}</b>
                        </Typography>
                      </Box> */}
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
            </Box>
          </Paper>
        </Box>
    </Fragment>
  );
}
