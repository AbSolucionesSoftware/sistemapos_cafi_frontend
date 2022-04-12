import React, { useContext, useState } from 'react';
import {
    Box, Button, DialogContent, InputAdornment,
    Grid, Paper, TextField, Typography 
} from '@material-ui/core'
import useStyles from '../styles';
//import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
//import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import moment from 'moment';
import 'moment/locale/es';
import { CREAR_COTIZACION } from "../../../gql/Ventas/cotizaciones";
import { VentasContext } from '../../../context/Ventas/ventasContext';
import { useMutation } from '@apollo/client';
import { generateCodeNumerico } from '../../../config/reuserFunctions';
import { Alert } from "@material-ui/lab";
import BackdropComponent from '../../../components/Layouts/BackDrop';
export default function NuevaCotizacion({ setOpen }) {
    const { setAlert } = useContext(VentasContext);

    const [ CrearCotizacion ] = useMutation(CREAR_COTIZACION);

    const datosVentas = JSON.parse(localStorage.getItem('DatosVentas'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const {
        updateTablaVentas,
        setUpdateTablaVentas,
        setDatosVentasActual,
        setVentaRetomada,
      } = useContext(VentasContext);
    const [ newCotizacion, setNewCotizacion ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ preciosDescuentos, setPreciosDescuentos ] = useState(
        { "subTotal": datosVentas?.subTotal, "impuestos" : datosVentas?.impuestos, 
        "iva": datosVentas?.iva, "ieps": datosVentas?.ieps, "total" :  datosVentas?.total }
        );
    const [ totalDescount, setTotalDescount ] = useState(preciosDescuentos ? preciosDescuentos?.descuento_general?.precio_con_descuento : datosVentas?.total);
    const [ value, setValue ] =  useState(preciosDescuentos?.descuento_general?.porciento ? preciosDescuentos?.descuento_general?.porciento : 0);
    //const [] = useState({});
    let descuento_general = [];
    
    let original_datos_Ventas = datosVentas;

    
    const classes = useStyles();

    const obtenerDatos = (e) => {
        setNewCotizacion({...newCotizacion, [e.target.name]: e.target.value});
    };
    console.log(newCotizacion)



    const crearCotizacion = async () => {
        try {
            console.log(datosVentas.productos[0].concepto)
           
            if(!newCotizacion.fecha_vencimiento ){
                setAlert({
                    message: `Por favor completa los datos necesarios`,
                    status: "error",
                    open: true,
                });
                return null;
            }else{
                setLoading(true);
                 await CrearCotizacion({
                    variables: {
                        input:{
                            folio: generateCodeNumerico(8), 
                            descuento: datosVentas.descuento,
                            ieps: datosVentas.ieps,
                            impuestos: datosVentas.impuestos,
                            iva: datosVentas.iva,
                            monedero: datosVentas.monedero,
                            subTotal: datosVentas.subTotal,
                            total: datosVentas.total,
                            venta_cliente:  datosVentas.cliente ? true : false,
                            montos_en_caja: {},
                            //credito: newCotizacion.tipo_venta === 'CREDITO' ? true : false,
                            descuento_general_activo: (value > 0 ) ? true : false,
                            descuento_general:
                                {
                                    "porciento": value,
                                    "precio_con_descuento": preciosDescuentos.total,
                                    "cantidad_descontado": totalDescount
                                },
                            dias_de_credito_venta: "", 
                            fecha_de_vencimiento_credito: "",
                            fecha_vencimiento_cotizacion: newCotizacion.fecha_vencimiento,
                            cliente: datosVentas.cliente ?  datosVentas.cliente : {},
                            productos: datosVentas.productos,
                            inventario_general: datosVentas.inventario_general
                        },
                        empresa: sesion.empresa._id,
                        sucursal:  sesion.sucursal._id,
                        usuario: sesion._id,
                        caja: turnoEnCurso.id_caja
                    }
                });
                
                setAlert({
                    message: `La cotización se realizó correctamente.`,
                    status: "success",
                    open: true,
                });
            }
            setOpen(false);
            setLoading(false);
            localStorage.removeItem("DatosVentas");
            setUpdateTablaVentas(!updateTablaVentas);

            setDatosVentasActual({
              subTotal: 0,
              total: 0,
              impuestos: 0,
              iva: 0,
              ieps: 0,
              descuento: 0,
              monedero: 0,
            });
        } catch (error) {
           
            setAlert({
                message: `Algo salió mal.`,
                status: "error",
                open: true,
            });
            if(error.networkError.result){
				console.log(error.networkError.result.errors);
			}else if(error.graphQLErrors){
				console.log(error.graphQLErrors.message);
			}

        }
    };

    /* function valuetext(e) {
        return `${e}`;
    }; */

    const obtenerPorciento = (e) => {
        let newValue = e.target.value;
        
        setValue(newValue);
        if(e !== ''){
            let ventaSubtotal = original_datos_Ventas?.subTotal;
            const val =
            newValue < 10
              ? parseFloat(`0.0${newValue.replace(".", "")}`)
              : parseFloat(`0.${newValue.replace(".", "")}`);
          const porsent = ventaSubtotal * val;
           /*  let porcentaje  =  parseFloat((100 - newValue).toFixed(6));
            let descuento = parseFloat((ventaSubtotal - (ventaSubtotal * porcentaje / 100)).toFixed(6));
    
            let precioConDescuento = parseFloat((descuento +  datosVentas.impuestos).toFixed(6) ); */
         
           /*  descuento_general = {
                "descuento_general_activo": true,
                "descuento_general": {
                    "porciento": newValue,
                    "precio_con_descuento": precioConDescuento,
                    "cantidad_descontado": descuento
                }
            };
            setPreciosDescuentos(descuento_general); */
            setTotalDescount(porsent.toFixed(2));
        }
   
       
    };
    
    const obtenerPrecioText = (e) => {
        try {
            var valorText = (e.target.value !== '') ?  parseFloat(e.target.value) : '';
            var ventaSubtotal = original_datos_Ventas?.subTotal;
            setTotalDescount(valorText);
            var porcentaje  = (valorText === '') ? 0 : parseFloat(((valorText / ventaSubtotal) * 100).toFixed(6));
            var descuento = (valorText === '') ? 0 : parseFloat((porcentaje).toFixed(6));
            //var precioConDescuento =(valorText === '') ? 0 : (parseFloat(((ventaSubtotal - valorText)+  original_datos_Ventas.impuestos).toFixed(6) ));
         /*    descuento_general = {
                "descuento_general_activo": true,
                "descuento_general": {
                    "porciento":  descuento,
                    "precio_con_descuento": precioConDescuento,
                    "cantidad_descontado":  valorText
                }
            };
            setPreciosDescuentos(descuento_general); */
       
            setValue(descuento); 
            
        } catch (error) {
            console.log(error)
        }
        
    };

    const eliminarDescuento = () => { 
        try {
            descuento_general = {
                
                "subTotal": 0,
                "iva": 0,
                "ieps": 0
                
            };
            setValue(0);
            setTotalDescount('');
            setPreciosDescuentos(descuento_general);
           
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
        
    }

    const handleCalculateNewDiscountVenta = () => {
        //let venta = JSON.parse(localStorage.getItem("DatosVentas"));
        //Declarar la variables necesarias (total, subTotal, impuestos, iva ieps, productosFinal)
        let total = 0,
          subTotal = 0,
          impuestos = 0,
          iva = 0,
          ieps = 0,
          descuento = 0;
        let productosFinal = [];
        //Activar loading
    
        //Obtener productos
        const productStorage = original_datos_Ventas?.productos;
        //Mapearlos
        for (let i = 0; i < productStorage.length; i++) {
          //Obtener el producto valor i
          const product = productStorage[i];
          let precio_actual_object = {};
          const porsentajeNewDescuento =  parseFloat(value);
         /*  const dineroDescontadoDescuento = parseFloat(
            (product.precio_actual_object.precio_venta *
              parseFloat(`0.${porsentajeNewDescuento}`).toFixed(2))
          ); */
          
          const dineroDescontadoDescuento =  (porsentajeNewDescuento > 1) ? 
           (porsentajeNewDescuento > 10 ) ? 
            parseFloat(
            (product.precio_actual_object.precio_venta *
              parseFloat(`0.${porsentajeNewDescuento}`)).toFixed(2)
            )
            :
            parseFloat(
            (product.precio_actual_object.precio_venta *
                parseFloat(`0.${porsentajeNewDescuento}`)).toFixed(2) / 10
            ) 
          : 
          parseFloat(
            (product.precio_actual_object.precio_venta *
              porsentajeNewDescuento) / 100 
            
          ) 
          ;
          console.log('dineroDescontadoDescuento', )
          //Calcular los nuevos precios
          const newPrecioVentaProduct = parseFloat(
            (
              product.precio_actual_object.precio_venta - dineroDescontadoDescuento
            )
          ).toFixed(2);
          const newIvaProduct = parseFloat(
            (
              newPrecioVentaProduct *
              parseFloat(`0.${product.id_producto.precios.iva}`)
            )
          ).toFixed(2);
          const newIepsProduct = parseFloat(
            (
              newPrecioVentaProduct *
              parseFloat(`0.${product.id_producto.precios.ieps}`).toFixed(2)
            )
          ).toFixed(2);
          const newPrecioNetoProduct = parseFloat(
            (newPrecioVentaProduct + newIvaProduct + newIepsProduct)
          ).toFixed(2);
    
          const newUtilidadProduct = parseFloat(
            (
              ((newPrecioVentaProduct -
                product.id_producto.precios.precio_de_compra.precio_sin_impuesto) /
                product.id_producto.precios.precio_de_compra.precio_sin_impuesto) *
              100
            )
          ).toFixed(2);
    
          precio_actual_object = {
            cantidad_unidad: 1,
            dinero_descontado: dineroDescontadoDescuento,
            ieps_precio: newIepsProduct,
            iva_precio: newIvaProduct,
            numero_precio: product.precio_actual_object.numero_precio,
            porciento: product.precio_actual_object.porciento
              ? parseFloat(
                  (
                    parseFloat(product.precio_actual_object.porciento) +
                    parseFloat(value)
                  ).toFixed(2)
                )
              : parseFloat(value),
            precio_general: 0,
            precio_neto: newPrecioNetoProduct,
            precio_venta: newPrecioVentaProduct,
            unidad_maxima: false,
            utilidad: newUtilidadProduct,
          };
          //console.log('precio_actual_object', precio_actual_object);
          if (product.precio_actual_object.unidad_maxima) {
            //Aqui se calcula la unidad por mayoreo (Cajas y costales)
            precio_actual_object.cantidad_unidad =
              product.precio_actual_object.cantidad_unidad;
            precio_actual_object.precio_general =
              newPrecioNetoProduct *
              parseFloat(product.precio_actual_object.cantidad_unidad);
            precio_actual_object.unidad_maxima = true;
          }
          const valorGranel =
            product.granel_producto.granel === true
              ? parseFloat(product.granel_producto.valor)
              : 1;
              console.log('valorGranel:', valorGranel);
          //Guardar el nuevo producto en el arreglo
          const ieps_total_producto = parseFloat(
            (
              precio_actual_object.ieps_precio *
              valorGranel *
              product.cantidad_venta
            ).toFixed(2)
          );
          const impuestos_total_producto = parseFloat(
            (
              (precio_actual_object.ieps_precio + precio_actual_object.iva_precio) *
              valorGranel *
              product.cantidad_venta
            ).toFixed(2)
          );
          const iva_total_producto = parseFloat(
            (
              precio_actual_object.iva_precio *
              valorGranel *
              product.cantidad_venta
            ).toFixed(2)
          );
          const subtotal_total_producto = parseFloat(
            (
              precio_actual_object.precio_venta *
              valorGranel *
              product.cantidad_venta
            ).toFixed(2)
          );
          const total_total_producto = parseFloat(
            (
              precio_actual_object.precio_neto *
              valorGranel *
              product.cantidad_venta
            ).toFixed(2)
          );
         // console.log('descuentoProducto', precio_actual_object.dinero_descontado, valorGranel,  product.cantidad_venta );
          const descuentoProducto =
            parseFloat(precio_actual_object.dinero_descontado.toFixed(2)) *
            valorGranel *
            product.cantidad_venta;
    
          productosFinal.push({
            ...product,
            precio_actual_object,
            ieps_total_producto,
            impuestos_total_producto,
            iva_total_producto,
            subtotal_total_producto,
            total_total_producto,
          });
          //Sumar los valores
          total += total_total_producto;
          subTotal += subtotal_total_producto;
          impuestos += impuestos_total_producto;
          iva += iva_total_producto;
          ieps += ieps_total_producto;
          //descuento += descuentoProducto;
        }

    /*     console.log(
            "Total:",total, 
            "SubTotal:",subTotal, 
            "Impuestos:",impuestos, 
            "IVA:",iva,
            "IEPS:", ieps, 
            "Descuento:",descuento, 
            "Productos:",productosFinal
        ); */

        descuento_general = {
            impuestos,
            subTotal,
            iva,
            ieps,
            total   
        };
        setPreciosDescuentos(descuento_general);   
        /* localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            ...venta,
            productos: productosFinal,
            total : ,
            subTotal,
            impuestos,
            iva,
            ieps,
            descuento,
          })
        ); */
      }; 

    React.useEffect(() => {
      try {
        handleCalculateNewDiscountVenta();
      } catch (error) {
          
      }
    }, [value])

  /*   React.useEffect(() => {

      return () => {
        <BackdropComponent loading={loading}  />
      }
    }, [loading]) */
    
   
   
    return (
        <>
            <DialogContent style={{padding: 0}} >
                <BackdropComponent loading={loading}  />
                <div className={classes.formInputFlex}>
                    <Box width="25%">
                        <Typography>
                            <b>Usuario:</b>
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                variant="outlined"
                                onChange={obtenerDatos}
                                value={sesion ? sesion.nombre : ""}
                            />
                        </Box>
                    </Box>
                    
                    {/* <Box width="33%">
                        <Typography>
                            Tipo de Venta:
                        </Typography>
                        <FormControl
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            <Select
                                id="form-producto-tipo"
                                onChange={obtenerDatos}
                                name="tipo_venta"
                            >
                                <MenuItem value=''>
                                    <em>Selecciona uno</em>
                                </MenuItem>
                                <MenuItem value='CREDITO'>Credito</MenuItem>
                                <MenuItem value='CONTADO'>Contado</MenuItem>
                            </Select>
                        </FormControl>
                    </Box> */}
                    <Box width={(datosVentas?.cliente?.nombre_cliente) ? "25%" : "24%"}>
                        <Typography>
                            <b>Cliente:</b>
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                onChange={obtenerDatos}
                                variant="outlined"
                                value={datosVentas?.cliente?.nombre_cliente ? datosVentas?.cliente?.nombre_cliente : "Público General"}
                            />
                        </Box>
                    </Box>
                    {
                        (datosVentas?.cliente?.nombre_cliente) ? 
                        <Box width="12%">
                            <Typography>
                                <b>No. Cliente:</b>
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    disabled={true}
                                    onChange={obtenerDatos}
                                    variant="outlined"
                                    value={datosVentas ? datosVentas.cliente?.numero_cliente : ""}
                                />
                            </Box>
                        </Box>
                        :
                        <div/>
                    }
                    <Box width="25%">
                        <Typography>
                            <b>Fecha:</b>
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                onChange={obtenerDatos}
                                variant="outlined"
                                value={moment().format('L')}
                            />
                        </Box>
                    </Box>
                    <Box width={(datosVentas?.cliente?.nombre_cliente) ? "24%" : "23%"}>
                        <Typography>
                            <b>Fecha Vencimiento:</b>
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                type='date'
                                onChange={obtenerDatos}
                                size="small"
                                name="fecha_vencimiento"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </div>
                <div className={classes.formInputFlex}>
                    {/* <Box width={(datosVentas.cliente?.nombre_cliente) ? "33%" : "32%"}>
                        <Typography>
                            Cliente:
                        </Typography>
                        <Box display="flex">
                            <TextField
                                fullWidth
                                size="small"
                                disabled={true}
                                onChange={obtenerDatos}
                                variant="outlined"
                                value={datosVentas.cliente?.nombre_cliente ? datosVentas.cliente?.nombre_cliente : "Público General"}
                            />
                        </Box>
                    </Box> */}
                    
                    
                   
                </div>
             
                <Grid container>
                    <Grid item lg={5}>
                        <Box pt={4} pl={2}>
                            <Paper elevation={2} >
                                <Box  textAlign={'center'}>
                                    <Typography style={{ fontSize: 17 }}>
                                        <b>Agregar descuento</b> 
                                    </Typography>
                                    <Alert severity="info">
                                        El descuento se aplica apartir del <b>SUBTOTAL</b>
                                    </Alert>
                                </Box>
                                <Box >
                                    <div className={classes.formInputFlex}>
                                        <Box width="40%" pl={1}>
                                            <Typography>
                                                <b>Porcentaje:</b>
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="descuento"
                                                id="form-venta-porsentaje-descuento"
                                                variant="outlined"
                                                value={value}
                                                onChange={(e) => obtenerPorciento(e)}
                                                type="number"
                                                disabled={false}
                                                InputProps={{
                                                    startAdornment: (
                                                    <InputAdornment position="start">%</InputAdornment>
                                                    ),
                                                }}
                                            />
                                       {/*      <Box display='flex' justifyContent="center" justifyItems="center" className={classes.rootSlice}>
                                                <Slider
                                                    getAriaValueText={valuetext}
                                                    value={value.toFixed(2)}
                                                    aria-labelledby="discrete-slider-small-steps"
                                                    valueLabelDisplay="auto"
                                                    onChange={obtenerPorciento} 
                                                />
                                            </Box> */}
                                        </Box>
                                        <Box width="40%" pl={1}>
                                            <Typography>
                                                <b>Dinero a descontar</b>
                                            </Typography> 
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                name="precioConDescuento"
                                                onChange={obtenerPrecioText}
                                                value={totalDescount}
                                                className={classes.input}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </div>
                                </Box>
                                <Box 
                                    p={1}
                                    pt={1}
                                    pb={1}
                                    display="flex"
                                    flexDirection='row-reverse'
                                >
                                    <Button 
                                        variant="outlined"
                                        color="secondary"
                                        size="medium"
                                        onClick={eliminarDescuento}
                                    >
                                        Quitar 
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item lg={7}>
                        <Box p={3} display="flex" flexDirection="flex-end" flexWrap= 'wrap'  width="100%">
                            <Box m={1}  width="30%">
                                <Typography style={{fontSize: 17}} >
                                    <b>No. Productos: </b> {datosVentas?.productos.length}
                                </Typography>
                            </Box>
                            <Box m={1} width="32%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Sub total:</b> ${(preciosDescuentos.subTotal)? (preciosDescuentos.subTotal).toFixed(2) : 0} 
                                </Typography>
                            </Box>
                            <Box m={1} width="32%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Impuestos:</b> ${(preciosDescuentos.impuestos) ? (preciosDescuentos.impuestos).toFixed(2) : 0} 
                                </Typography>
                            </Box>
                            <Box m={1} width="32%">
                                <Typography style={{fontSize: 16}}>
                                    <b>IVA:</b> ${(preciosDescuentos.iva) ? (preciosDescuentos.iva).toFixed(2) : 0} 
                                </Typography>
                            </Box>
                            <Box m={1} width="32%">
                                <Typography style={{fontSize: 16}}>
                                    <b>IEPS:</b>${(preciosDescuentos.ieps) ? (preciosDescuentos.ieps).toFixed(2) : 0} 
                                </Typography>
                            </Box>
                            <Box m={1} width="32%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Descuento:</b> <b style={{color: "green"}}>$
                                    {/* {(preciosDescuentos?.descuento_general) ?
                                     (preciosDescuentos?.descuento_general?.cantidad_descontado !== '') ?
                                      (preciosDescuentos?.descuento_general?.cantidad_descontado).toFixed(2) :0 : 0} */}
                                      {totalDescount}
                                       </b>
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" p={2} pt={0} pb={1}>
                            <Typography style={{fontSize: 27}}>
                                Total: 
                                <b style={{color: "green"}}>
                                    ${(preciosDescuentos.total) ? (preciosDescuentos.total).toFixed(2) : 0}
                                </b>
                            </Typography>
                           {/*  <Box  mr={1}>
                                <MonetizationOnIcon style={{fontSize: 37, color: "green"}} />
                            </Box> */}
                        </Box>
                        <Box display='flex' justifyContent={'flex-end'}  >
                            <Box mr={2}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    onClick={crearCotizacion}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
           
        </>
    )
};