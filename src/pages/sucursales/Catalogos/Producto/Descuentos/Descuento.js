import React, { useCallback, useState } from 'react';

import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { Button, Dialog, makeStyles, DialogTitle, DialogContent,  Grid, Box, Typography, TextField, Slider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import TablaPreciosDescuentos from './ListaPrecios';

import {  REGISTRAR_DESCUENTOS } from '../../../../../gql/Catalogos/descuentos';
import { useMutation } from '@apollo/client';
import SnackBarMessages from '../../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../../components/Layouts/BackDrop';

const useStyles = makeStyles((theme) => ({
	avatarGroup: {
		'& > .MuiAvatarGroup-avatar': {
			width: theme.spacing(8),
			height: theme.spacing(8)
		}
	},
	root: {
		width: 400
	},
    rootSlice:{
        width: 350
    },
	margin: {
		height: theme.spacing(3)
	},
    rootTable:{
        height: 300
    }
}));

export default function DescuentoProductos({datos, productosRefetch}) {
    const [ CrearDescuentoUnidad ] = useMutation(REGISTRAR_DESCUENTOS);
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const [ openDescuento, setOpenDescuento ] = useState(false);
    const [ cleanList, setCleanList] = useState(false);
    const [ descuentoPresente, setDescuentoPresente] = useState(false);
    const [ validate ] = useState(false);
    const [ loading, setLoading] = useState(false);

    const [ datosPreciosProducto, setDatosPreciosProducto ] = useState([]);
    const [ preciosDescuentos, setPreciosDescuentos] = useState([]);
    const [ preciosProductos, setPreciosProductos ] = useState([]);

    const [ precioPrueba, setPrecioPrueba ] = useState(0);
    const [ value, setValue] =  useState(0);

    const classes = useStyles();

    const handleCloseDescuentos = () => {
        if (datos.medidas_registradas === true) {
            setDatosPreciosProducto(datos.medidas_producto);
        }else{
            setDatosPreciosProducto(datos.unidades_de_venta);
        }
        setOpenDescuento(!openDescuento);
        setPrecioPrueba(0);
        setValue(0);
        preciosDescuentos.splice(0, preciosDescuentos.length);
    };

    const verificarDatos = useCallback(
        (datos) => {
            for (let i = 0; i < datos.length; i++) {
                if (datos[i].descuento) {
                    if ( datos[i].descuento.porciento !== 0) {
                        setValue(datos[i].descuento.porciento);
                        if (datos.length === 1) {
                            setPrecioPrueba(datos[i].descuento.precio_con_descuento);
                        }
                    }
                    
                }
            }
    },
        [datos]
    );
    
    let arrayDescuento = [];

    const obtenerPorcientoSlide = (event, newValue) => {
        setValue(newValue);
        preciosDescuentos.splice(0, preciosDescuentos.length);
        for (let i = 0; i < preciosProductos.length; i++) {
            var porcentaje  =  parseFloat((100 - newValue).toFixed(6));
            var descuento = parseFloat((preciosProductos[i].precio * porcentaje / 100).toFixed(6));
            var dineroDescontado = parseFloat((preciosProductos[i].precio - descuento).toFixed(6));
            arrayDescuento = {
                "_id": preciosProductos[i]._id,
                "descuento_activo": true,
                "descuento":{
                    "porciento": newValue,
                    "dinero_descontado": dineroDescontado,
                    "precio_con_descuento": descuento
                }
            };
            setPrecioPrueba(descuento);
            if (preciosProductos.length !== 1) {
                preciosDescuentos.push(arrayDescuento);
            }else{
                setPreciosDescuentos([arrayDescuento]);
            }
        }
    };
    
    const obtenerPrecioText = (e) => {
        var valorText = parseFloat(e.target.value);
        if (preciosProductos.length === 1) {
            setPrecioPrueba(valorText);
            var porcentaje  = parseFloat(((valorText / preciosProductos[0].precio) * 100).toFixed(6));
            var descuento = parseFloat((100 - porcentaje).toFixed(6));
            var dineroDescontado = parseFloat((preciosProductos[0].precio - valorText).toFixed(6));
            arrayDescuento = {
                "_id": preciosProductos[0]._id,
                "descuento_activo": true,
                "descuento":{
                    "porciento": porcentaje,
                    "dinero_descontado": dineroDescontado,
                    "precio_con_descuento": valorText
                }
            };
            setValue(descuento);
            setPreciosDescuentos([arrayDescuento]);
        }
    };

    function valuetext(e) {
        return `${e}`;
    };

    const saveData = async () => {
        setLoading(true);
		try {
            await CrearDescuentoUnidad({
                variables: {
                    input: {
                        descuentos: preciosDescuentos
                    }
                }
            });
            setLoading(false);
            productosRefetch();
            setValue(0);
            setPreciosProductos([]);
            setPreciosDescuentos([]);
            setCleanList(!cleanList);
            handleCloseDescuentos();
            setAlert({ message: '¡Listo descuentos realizados!', status: 'success', open: true });
		} catch (error) {
		}
	};

    const validacion = () => {
        if (datos.medidas_producto.length > 0 ) {
            for (let i = 0; i < datos.medidas_producto.length; i++) {
                if (datos.medidas_producto[i]?.descuento_activo === true) {
                    return "primary";
                }else{
                    return "default";
                }
            }
        }else{
            for (let i = 0; i < datos.unidades_de_venta.length; i++) {
                if (datos.unidades_de_venta[i]?.descuento_activo === true) {
                    return "primary";
                }else{
                    return "default";
                }
            }
        }
    }

    
    return (
        <div>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            <IconButton
                color={validacion()}
                onClick={handleCloseDescuentos}
            >
               <LocalOfferIcon />
            </IconButton>
            <Dialog open={openDescuento} onClose={handleCloseDescuentos} fullWidth maxWidth="lg">
            <BackdropComponent loading={loading} setLoading={setLoading} />
				<DialogTitle>
                    <Grid container>
                        <Box flexGrow={1} display="flex" alignItems="center">
                            {'Descuento de Producto'}
                        </Box>
                        <Box m={1}>
                            <Button variant="contained" color="secondary" onClick={() => handleCloseDescuentos()} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                    </Grid>
                </DialogTitle>
				<DialogContent>
                    <Box textAlign="center">
                        <Typography>
                            <b>Nombre comercial: </b>
                            {datos.datos_generales.nombre_comercial ? datos.datos_generales.nombre_comercial : '-'}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography>
                            <b>Nombre genérico: </b>
                            {datos.datos_generales.nombre_generico ? datos.datos_generales.nombre_generico : '-'}
                        </Typography>
                    </Box>
                    <Grid container>
                        <Grid item lg={8} md={6} xs={12}> 
                            <Box p={1}>
                                <TablaPreciosDescuentos
                                    verificarDatos={verificarDatos}
                                    productosRefetch={productosRefetch}
                                    datos={datos}
                                    value={value}
                                    cleanList={cleanList}
                                    setCleanList={setCleanList}
                                    setPrecioPrueba={setPrecioPrueba}
                                    datosPrecios={datosPreciosProducto} 
                                    preciosProductos={preciosProductos} 
                                    setPreciosProductos={setPreciosProductos} 
                                    setLoading={setLoading}
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={4} md={6} xs={12}> 
                            <Box mt={5} dislay="flex" justifyContent="center">
                                <div className={classes.root}>
                                    <Box textAlign="center">
                                        <Typography id="discrete-slider-always" gutterBottom>
                                            <b>Porcentaje de descuento</b>
                                        </Typography>
                                    </Box>
                                    <Box my={5} />
                                    <Box display='flex' justifyContent="center" justifyItems="center" className={classes.rootSlice}>
                                        <Slider
                                            disabled={preciosProductos.length === 0 ? true : false}
                                            getAriaValueText={valuetext}
                                            value={value}
                                            aria-labelledby="discrete-slider-small-steps"
                                            valueLabelDisplay="auto"
                                            onChange={obtenerPorcientoSlide} 
                                        />
                                    </Box>
                                </div>
                            </Box>
                            <Box mt={5} display="flex" justifyContent="center">
                                {preciosProductos.length === 1 ? ( 
                                    <div>
                                        <Typography>Precio con Descuento</Typography>
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0} }}
                                            size="small"
                                            variant="outlined"
                                            value={ precioPrueba }
                                            onChange={(e) => obtenerPrecioText(e)}
                                        />
                                    </div>
                                ) : (
                                    null
                                )}

                            </Box>
                            <Box mt={2} display="flex" justifyContent="center">
                                <Button 
                                    disabled={preciosProductos.length === 0 || validate === true ? true : false}
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                    onClick={saveData}
                                >
                                    Guardar 
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
				</DialogContent>
			</Dialog>
        </div>
    )
}
