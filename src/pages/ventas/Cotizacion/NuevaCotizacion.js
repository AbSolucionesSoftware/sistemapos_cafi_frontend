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
    const [ totalDescount, setTotalDescount ] = useState(preciosDescuentos ? preciosDescuentos?.descuento_general?.precio_con_descuento : 0);
    const [ value, setValue ] =  useState(preciosDescuentos?.descuento_general?.porciento ? preciosDescuentos?.descuento_general?.porciento : 0);

    let descuento_general = [];
    var totalCompra = datosVentas?.total;

    
    const classes = useStyles();

    const obtenerDatos = (e) => {
        setNewCotizacion({...newCotizacion, [e.target.name]: e.target.value});
    };
    console.log(newCotizacion)

    const input = {
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
        decuento_general: preciosDescuentos?.descuento_general ? preciosDescuentos?.descuento_general :
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
    };

    const crearCotizacion = async () => {
        try {
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
                        input,
                        empresa: "60c120b6a694891f58d32a1d",
                        sucursal: "60c8e180340d5d223432a916",
                        usuario: "60dde52c5cda9d5510c4b7d0",
                        caja: "61a5037918594a4ecdc1c7bf"
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
        var descuento = parseFloat((totalCompra * porcentaje / 100).toFixed(6));
        var dineroDescontado = parseFloat((totalCompra - descuento).toFixed(6));
        descuento_general = {
            "descuento_general_activo": true,
            "descuento_general": {
                "porciento": newValue,
                "precio_con_descuento": descuento,
                "cantidad_descontado": dineroDescontado
            }
        };
        setPreciosDescuentos(descuento_general);
        setTotalDescount(descuento);
    };
    
    const obtenerPrecioText = (e) => {
        var valorText = parseFloat(e.target.value);
        setTotalDescount(valorText);
        var porcentaje  = parseFloat(((valorText / totalCompra) * 100).toFixed(6));
        var descuento = parseFloat((100 - porcentaje).toFixed(6));
        var dineroDescontado = parseFloat((totalCompra - valorText).toFixed(6));

        descuento_general = {
            "descuento_general_activo": true,
            "descuento_general": {
                "porciento": descuento,
                "precio_con_descuento": valorText,
                "cantidad_descontado": dineroDescontado
            }
        };
        setPreciosDescuentos(descuento_general);
        setValue(descuento);
    };

    const eliminarDescuento = () => { 
        descuento_general = {
            "descuento_general_activo": false,
            "descuento_general": {
                "porciento": 0,
                "precio_con_descuento": 0,
                "cantidad_descontado": 0
            }
        };
        setValue(0);
        setTotalDescount(0);
        setPreciosDescuentos(descuento_general);
    }

    return (
        <>
            <DialogContent style={{padding: 0}} >
                <div className={classes.formInputFlex}>
                    <Box width="100%">
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
                    <Box width="100%">
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
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
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
                                value={datosVentas.cliente?.nombre_cliente ? datosVentas.cliente?.nombre_cliente : "Publico General"}
                            />
                        </Box>
                    </Box>
                    <Box width="100%">
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
                <div className={classes.formInputFlex}>
                    <Box width="100%">
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
                    <Box width="100%">
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
                <Grid container>
                    <Grid item lg={6}>
                        <Box p={1}>
                            <Paper elevation={3} >
                                <Box p={2} textAlign={'center'}>
                                    <Typography variant="h6">
                                        Agregar descuento total a la venta.
                                    </Typography>
                                </Box>
                                <Box textAlign={'center'} p={2}>
                                    <div className={classes.formInputFlex}>
                                        <Box width="95%">
                                            <Box display="flex" alignItems="center">
                                                <Box display="flex" justifyContent="center" alignItems="center" p={1}>
                                                    <img 
                                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/price-tag.png' 
                                                        alt="icono admin" 
                                                        style={{width: 30}}                                   
                                                    />
                                                </Box>
                                                <Typography variant="h6">
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
                                        <Box width="100%">
                                            <Typography variant="h6" >
                                                Total con descuento:
                                            </Typography>
                                            <Box display="flex">
                                                <Box display="flex" justifyContent="center" alignItems="center" mr={1}>
                                                    <MoneyOffIcon style={{fontSize: 38, color: "green"}} />
                                                </Box>
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
                                    display="flex"
                                    flexDirection='row-reverse'
                                >
                                    <Button 
                                        variant="outlined"
                                        color="secondary"
                                        size="large"
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
                                <Typography style={{fontSize: 18}}>
                                    <b>No. Productos: </b> {datosVentas.productos.length}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 18}}>
                                    <b>Sub total:</b> ${datosVentas ? (datosVentas.subTotal).toFixed(2) : 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 18}}>
                                    <b>Impuestos:</b> ${datosVentas ? (datosVentas.impuestos).toFixed(2): 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 18}}>
                                    <b>I.V.A.:</b> ${datosVentas ? (datosVentas.iva).toFixed(2) : 0}
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" width="100%">
                                <Typography style={{fontSize: 18}}>
                                    <b>Descuento:</b> <b style={{color: "green"}}>${preciosDescuentos?.descuento_general ? (preciosDescuentos?.descuento_general?.cantidad_descontado).toFixed(2) : 0} </b>
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" p={1}>
                            <Typography variant="h4">
                                Total: 
                                <b style={{color: "green"}}>
                                    ${preciosDescuentos?.descuento_general && preciosDescuentos?.descuento_general?.precio_con_descuento > 0? 
                                    (preciosDescuentos?.descuento_general?.precio_con_descuento).toFixed(2) : (
                                        datosVentas ? (datosVentas.total).toFixed(2) : 0
                                    )}
                                </b>
                            </Typography>
                            <Box mt={.5} mr={1}>
                                <MonetizationOnIcon style={{fontSize: 37, color: "green"}} />
                            </Box>
                        </Box>
                        <Box display='flex' justifyContent={'flex-end'}  >
                            <Box mt={6}>
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