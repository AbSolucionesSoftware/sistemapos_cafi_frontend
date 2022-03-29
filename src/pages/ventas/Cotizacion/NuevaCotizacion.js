import React, { useContext, useState } from 'react';
import {
    Box, Button, DialogContent, 
    FormControl, Grid, MenuItem,  
    Paper, 
    Select, Slider, TextField, Typography 
} from '@material-ui/core'
import useStyles from '../styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import moment from 'moment';
import 'moment/locale/es';
import { CREAR_COTIZACION } from "../../../gql/Ventas/cotizaciones";
import { VentasContext } from '../../../context/Ventas/ventasContext';
import { useMutation } from '@apollo/client';
import { generateCodeNumerico } from '../../../config/reuserFunctions';

export default function NuevaCotizacion({ setOpen }) {
    const { setAlert } = useContext(VentasContext);

    const [ CrearCotizacion ] = useMutation(CREAR_COTIZACION);

    const datosVentas = JSON.parse(localStorage.getItem('DatosVentas'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const [ newCotizacion, setNewCotizacion ] = useState([]);
    const [ preciosDescuentos, setPreciosDescuentos ] = useState([]);
    const [ totalDescount, setTotalDescount ] = useState(preciosDescuentos ? preciosDescuentos?.descuento_general?.precio_con_descuento : datosVentas?.total);
    const [ value, setValue ] =  useState(preciosDescuentos?.descuento_general?.porciento ? preciosDescuentos?.descuento_general?.porciento : 0);

    let descuento_general = [];
    var totalCompra = datosVentas?.subTotal;

    
    const classes = useStyles();

    const obtenerDatos = (e) => {
        setNewCotizacion({...newCotizacion, [e.target.name]: e.target.value});
    };
    console.log(newCotizacion)



    const crearCotizacion = async () => {
        try {
            console.log(datosVentas.productos[0].concepto)
            if(!newCotizacion.fecha_vencimiento || !newCotizacion.tipo_venta){
                setAlert({
                    message: `Por favor completa los datos necesarios`,
                    status: "error",
                    open: true,
                });
                return null;
            }else{
                const registroCotizacion = await CrearCotizacion({
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
                            credito: newCotizacion.tipo_venta === 'CREDITO' ? true : false,
                            descuento_general_activo: preciosDescuentos?.descuento_general_activo ? preciosDescuentos?.descuento_general_activo : false,
                            descuento_general: preciosDescuentos?.descuento_general ? preciosDescuentos?.descuento_general :
                            {
                                "porciento": 0,
                                "precio_con_descuento": 0,
                                "cantidad_descontado": 0
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
                console.log(registroCotizacion);
            }

        } catch (error) {
            console.log(error);
            if(error.networkError.result){
				console.log(error.networkError.result.errors);
			}else if(error.graphQLErrors){
				console.log(error.graphQLErrors.message);
			}

        }
    };

    function valuetext(e) {
        return `${e}`;
    };

    const obtenerPorciento = (event, newValue) => {
        setValue(newValue);
        var porcentaje  =  parseFloat((100 - newValue).toFixed(6));
        var descuento = parseFloat((totalCompra - (totalCompra * porcentaje / 100)).toFixed(6));
        var precioConDescuento = parseFloat((descuento +  datosVentas.impuestos).toFixed(6) );
     
        descuento_general = {
            "descuento_general_activo": true,
            "descuento_general": {
                "porciento": newValue,
                "precio_con_descuento": precioConDescuento,
                "cantidad_descontado": descuento
            }
        };
        setPreciosDescuentos(descuento_general);
        setTotalDescount(descuento);
    };
    
    const obtenerPrecioText = (e) => {
        try {
            var valorText = (e.target.value !== '') ?  parseFloat(e.target.value) : '';
        
            setTotalDescount(valorText);
            var porcentaje  = (valorText === '') ? 0 : parseFloat(((valorText / totalCompra) * 100).toFixed(6));
           
            var descuento = (valorText === '') ? 0 : parseFloat((porcentaje).toFixed(6));
            var precioConDescuento =(valorText === '') ? 0 : (parseFloat(((totalCompra - valorText)+  datosVentas.impuestos).toFixed(6) ));
           

    
            descuento_general = {
                "descuento_general_activo": true,
                "descuento_general": {
                    "porciento":  descuento,
                    "precio_con_descuento": precioConDescuento,
                    "cantidad_descontado":  valorText
                }
            };
    
            setPreciosDescuentos(descuento_general);
            setValue(descuento); 
        } catch (error) {
            console.log(error)
        }
        
    };

    const eliminarDescuento = () => { 
        try {
            descuento_general = {
                "descuento_general_activo": false,
                "descuento_general": {
                    "porciento": 0,
                    "precio_con_descuento": 0,
                    "cantidad_descontado": 0
                }
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

    return (
        <>
            <DialogContent style={{padding: 0}} >
                <div className={classes.formInputFlex}>
                    <Box width="33%">
                        <Typography>
                            Usuario:
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
                    <Box width="33%">
                        <Typography>
                            Fecha:
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
                    <Box width="33%">
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
                    </Box>
                </div>
                <div className={classes.formInputFlex}>
                    <Box width={(datosVentas.cliente?.nombre_cliente) ? "33%" : "32%"}>
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
                    </Box>
                    {
                        (datosVentas.cliente?.nombre_cliente) ? 
                        <Box width="33%">
                            <Typography>
                                No. Cliente:
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
                    
                    <Box width={(datosVentas.cliente?.nombre_cliente) ? "33%" : "32%"}>
                        <Typography>
                            Fecha Vencimiento:
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
             
                <Grid container>
                    <Grid item lg={6}>
                        <Box pt={1} >
                            <Paper elevation={3} >
                                <Box p={2} pt={0} textAlign={'center'}>
                                    <Typography variant="h6">
                                        Agregar descuento a la venta
                                    </Typography>
                                </Box>
                                <Box textAlign="center"  p={2} pt={1}>
                                    <div className={classes.formInputFlex}>
                                        <Box width="94%">
                                            <Box display="flex" alignItems="center">
                                                <Box display="flex" justifyContent="center" alignItems="center" mr={1} >
                                                    <img 
                                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/price-tag.png' 
                                                        alt="icono admin" 
                                                        style={{width: 26}}                                   
                                                    />
                                                </Box>
                                                <Typography style={{ fontSize: 18 }}>
                                                    Porciento descuento
                                                </Typography>
                                            </Box>
                                            <Box display='flex' justifyContent="center" justifyItems="center" className={classes.rootSlice}>
                                                <Slider
                                                    getAriaValueText={valuetext}
                                                    value={value.toFixed(2)}
                                                    aria-labelledby="discrete-slider-small-steps"
                                                    valueLabelDisplay="auto"
                                                    onChange={obtenerPorciento} 
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                    <div className={classes.formInputFlex}>
                                        <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                                        
                                            <Box >
                                                <MoneyOffIcon style={{fontSize: 30, color: "green"}} />
                                            </Box>
                                            <Typography style={{ fontSize: 18 }} >
                                                Cantidad a descontar
                                            </Typography>
                                            <Box display="flex" ml={1}>
                                                
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
                                        </Box>
                                    </div>
                                </Box>
                                <Box 
                                    p={1}
                                    pt={0}
                                    display="flex"
                                    flexDirection='row-reverse'
                                >
                                    <Button 
                                        variant="outlined"
                                        color="secondary"
                                        size="medium"
                                        onClick={eliminarDescuento}
                                    >
                                        Eliminar Descuento
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item lg={6}>
                        <Box mr={2} mt={2}>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 17}}>
                                    <b>No. Productos: </b> {datosVentas.productos.length}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Sub total:</b> ${datosVentas ? (datosVentas.subTotal).toFixed(2) : 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Impuestos:</b> ${datosVentas ? (datosVentas.impuestos).toFixed(2): 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 16}}>
                                    <b>I.V.A.:</b> ${datosVentas ? (datosVentas.iva).toFixed(2) : 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 17}}>
                                    <b>Descuento:</b> <b style={{color: "green"}}>${(preciosDescuentos?.descuento_general) ? (preciosDescuentos?.descuento_general?.cantidad_descontado !== '') ? (preciosDescuentos?.descuento_general?.cantidad_descontado).toFixed(2) :0 : 0} </b>
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" p={2}>
                            <Typography style={{fontSize: 27}}>
                                Total: 
                                <b style={{color: "green"}}>
                                    ${preciosDescuentos?.descuento_general && preciosDescuentos?.descuento_general?.porciento > 0   ? 
                                        ( preciosDescuentos?.descuento_general.precio_con_descuento).toFixed(2)
                                     : 
                                        (datosVentas ) ? (datosVentas.total).toFixed(2) : 0
                                    }
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