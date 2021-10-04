import React, { useState, useContext, useEffect } from 'react';
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
    CircularProgress,
    TextField
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import useStyles from './styles';
import TablaVentas from './TablaVentas';
import { useQuery } from '@apollo/client';
import { VentasContext } from '../../context/Ventas/ventasContext';
import { CONSULTA_PRODUCTO_UNITARIO } from '../../gql/Ventas/ventas_generales';
import { useLazyQuery } from "@apollo/client";


// import usuario from '../../icons/usuarios.svg';
// import codigo from '../../icons/ventas/busqueda-de-codigos-de-barras.svg';
// import vendedor from '../../icons/ventas/admin.svg';
// import ticket from '../../icons/ventas/publicalo.svg';

import { Fragment } from 'react'; 
import MonedaCambio from './Operaciones/MonedaCambio';



export default function VentasGenerales() {
    
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    // const productosVentas = JSON.parse(localStorage.getItem('productosVentas'));
    const classes = useStyles();
    const [productoBase, setProductoBase] = useState({});
    const [changeState, setChangeState] = useState(false);
    const [newProductoVentas, setNewProductoVentas] = useState(false);
    // let venta = JSON.parse(localStorage.getItem('DatosVentas'));
    // let productosVentas = venta === null ? {subTotal = 0, total = 0 , impuestos = 0 , iva = 0, ieps = 0} : venta;
    const [DatosVentasActual, setDatosVentasActual] = useState({
        subTotal: 0, 
        total: 0 , 
        impuestos: 0 , 
        iva: 0, 
        ieps: 0
    })
    const [obtenerProductos, { data ,error }] = useLazyQuery(
        CONSULTA_PRODUCTO_UNITARIO,
        { variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id }, fetchPolicy: "network-only" }
    );


    let productosBase = null;
    if(data) productosBase = data.obtenerUnProductoVentas;

    useEffect(() => {
        if(productosBase !== null){
            agregarProductos(productosBase);
        }
    }, [productosBase])

    const keyUpEvent = async (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            const input_value = event.target.value;
            console.log(input_value);
            obtenerProductos({
                variables: {
                    datosProductos: input_value,
                }
            }); 
            // setChangeState(!changeState);
        }
    }

    const agregarProductos = async (producto) => {
        let venta = JSON.parse(localStorage.getItem('DatosVentas'));
        console.log(venta);
        let productosVentas = venta === null ? [] : venta.produtos;
        let productosVentasTemp = [];
        let subTotal = 0, total = 0 , impuestos = 0 , iva = 0, ieps = 0;
        let found = false;
        for(let i = 0; i < productosVentas.length; i++){
            if(typeof productosVentas[i].codigo_barras !== 'undefined'){
                if(productosVentas[i].id_producto.datos_generales.clave_alterna === producto.id_producto.datos_generales.clave_alterna || productosVentas[i].codigo_barras === producto.codigo_barras){
                    const { cantidad_venta, ...newP } = productosVentas[i];
                    newP.cantidad_venta = parseInt(cantidad_venta) + 1;
                    found = true;
                    const { subtotalCalculo, totalCalculo , impuestoCalculo, ivaCalculo, iepsCalculo } = await CalculoPreciosVentas(found,newP);
                    subTotal += subtotalCalculo;
                    total += totalCalculo;
                    impuestos += impuestoCalculo;
                    iva += ivaCalculo;
                    ieps += iepsCalculo;
                    productosVentasTemp.push(newP);
                }else{
                    const newP = productosVentas[i];
                    const { subtotalCalculo, totalCalculo , impuestoCalculo, ivaCalculo, iepsCalculo } = await CalculoPreciosVentas(found,newP);
                    subTotal += subtotalCalculo;
                    total += totalCalculo;
                    impuestos += impuestoCalculo;
                    iva += ivaCalculo;
                    ieps += iepsCalculo;
                    productosVentasTemp.push(newP);
                }
            }else{
                if(productosVentas[i].id_producto.datos_generales.clave_alterna === producto.id_producto.datos_generales.clave_alterna){
                    const { cantidad_venta, ...newP } = productosVentas[i];
                    newP.cantidad_venta = parseInt(cantidad_venta) + 1;
                    found = true;
                    const { subtotalCalculo, totalCalculo , impuestoCalculo, ivaCalculo, iepsCalculo } = await CalculoPreciosVentas(found,newP);
                    subTotal += subtotalCalculo;
                    total += totalCalculo;
                    impuestos += impuestoCalculo;
                    iva += ivaCalculo;
                    ieps += iepsCalculo;
                    productosVentasTemp.push(newP);
                }else{
                    const newP = productosVentas[i];
                    const { subtotalCalculo, totalCalculo , impuestoCalculo, ivaCalculo, iepsCalculo } = await CalculoPreciosVentas(found,newP);
                    subTotal += subtotalCalculo;
                    total += totalCalculo;
                    impuestos += impuestoCalculo;
                    iva += ivaCalculo;
                    ieps += iepsCalculo;
                    productosVentasTemp.push(newP);
                }
            }
        }
        if(!found){
            const newP = {...producto};
            const { subtotalCalculo, totalCalculo , impuestoCalculo, ivaCalculo, iepsCalculo } = await CalculoPreciosVentas(false,newP);
            subTotal += subtotalCalculo;
            total += totalCalculo;
            impuestos += impuestoCalculo;
            iva += ivaCalculo;
            ieps += iepsCalculo;
            newP.cantidad_venta = 1;
            productosVentasTemp.push(newP);
        }

        
        const datosVentaFinales = {
            subTotal, 
            total, 
            impuestos, 
            iva, 
            ieps,
            produtos: productosVentasTemp
        }
        console.log(datosVentaFinales);
        JSON.parse(localStorage.setItem('DatosVentas',JSON.stringify(datosVentaFinales)));
        setDatosVentasActual({
            subTotal, 
            total, 
            impuestos, 
            iva, 
            ieps,
        })
        //Recargar la tabla de los productos
        setNewProductoVentas(!newProductoVentas);
        //GUARDAR EN LOCALSTORAGE
    }

    const CalculoPreciosVentas = async (found = false, newP) => {
        console.log("entro");
        let subtotalCalculo = 0, totalCalculo = 0, impuestoCalculo = 0, ivaCalculo = 0, iepsCalculo = 0;
        totalCalculo = found ? parseFloat(newP.precio) * parseFloat(newP.cantidad_venta) : parseFloat(newP.precio);
        subtotalCalculo = found ? (parseFloat(newP.precio) - parseFloat(newP.id_producto.precios.precio_de_compra.iva)) * parseFloat(newP.cantidad_venta) : (parseFloat(newP.precio) - parseFloat(newP.id_producto.precios.precio_de_compra.iva));
        impuestoCalculo = found ? (parseFloat(newP.id_producto.precios.precio_de_compra.iva) + parseFloat(newP.id_producto.precios.precio_de_compra.ieps)) * parseFloat(newP.cantidad_venta) : (parseFloat(newP.id_producto.precios.precio_de_compra.iva) + parseFloat(newP.id_producto.precios.precio_de_compra.ieps));
        ivaCalculo = found ? parseFloat(newP.id_producto.precios.precio_de_compra.iva) * parseFloat(newP.cantidad_venta) : parseFloat(newP.id_producto.precios.precio_de_compra.iva);
        iepsCalculo = found ? parseFloat(newP.id_producto.precios.precio_de_compra.ieps) * parseFloat(newP.cantidad_venta) : parseFloat(newP.id_producto.precios.precio_de_compra.ieps);
        return {
            totalCalculo,
            subtotalCalculo,
            impuestoCalculo,
            ivaCalculo,
            iepsCalculo,
        }
    }

    

    return (
            <Fragment>
                <Grid container>
                    <Grid item lg={2}>
                        {
                            sesion.empresa.imagen ? (
                                <Box className={classes.containerImage}>
                                    <img alt="imagen de empresa" src={sesion.empresa.imagen} className={classes.imagen} />
                                </Box>
                            ) : null
                        }
                    </Grid>
                    <Grid item lg={8}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar producto..."
                                            onKeyUp={keyUpEvent}
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/usuarios.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar cliente..."
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar vendedor..."
                                        />
                                        <IconButton >
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
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <FormControl
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    >
                                        <Select
                                            id="tipo_documento"
                                            name="tipo_documento"
                                        >
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
                    <Grid item lg={2} >
                        <Box display='flex' justifyContent="flex-end"
                        >
                            <Box className={classes.containerImage} >
                                <img alt="imagen de empresa" src={"https://duckduckgo.com/?q=fotos+150x150&atb=v255-1&iax=images&ia=images&iai=https%3A%2F%2Fintrepidplan.com%2Fwp-content%2Fuploads%2F2020%2F02%2Fcropped-favicon-150x150_op.png"} className={classes.imagen} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                
                <Grid item lg={12}>
                    <TablaVentas newProductoVentas={newProductoVentas} />
                </Grid>                                                                                                                                                             
            
                <Grid container item lg={12} justify="flex-end">
                    <Box p={1}>
                        <Paper elevation={3}>
                            <Box display="flex">
                                <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Iva: ${DatosVentasActual.iva}
                                    </Typography>
                                </Box>
                                <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Descuento: $0
                                    </Typography>
                                </Box>
                                <Box mr={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Subtotal: ${DatosVentasActual.subTotal}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" mr={1} >
                                <Typography variant="subtitle1">
                                    Impuestos: ${DatosVentasActual.impuestos}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" mr={1} mt={1}>
                                <Typography variant='h5'>
                                    Total: ${DatosVentasActual.total}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>  
            </Fragment>
    )
}