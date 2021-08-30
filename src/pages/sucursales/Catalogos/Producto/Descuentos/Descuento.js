import React, { useState } from 'react'

import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { Button, Dialog, makeStyles, DialogTitle, DialogContent,  Grid, Box, Typography, TextField, Slider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

import TablaPreciosDescuentos from './ListaPrecios';

import {  ACTUALIZAR_DESCUENTOS, REGISTRAR_DESCUENTOS } from '../../../../../gql/Catalogos/descuentos';
import { useMutation } from '@apollo/client';
import SnackBarMessages from '../../../../../components/SnackBarMessages';

const useStyles = makeStyles((theme) => ({
	avatarGroup: {
		'& > .MuiAvatarGroup-avatar': {
			width: theme.spacing(8),
			height: theme.spacing(8)
		}
	},
	root: {
		width: 300
	},
	margin: {
		height: theme.spacing(3)
	}
}));

export default function DescuentoProductos({datos}) {

    const [ openDescuento, setOpenDescuento ] = useState(false);
	// const [ loading,  setLoading ] = useState(false);
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

    const [ preciosProductos, setPreciosProductos ] = useState([]);
    const [ preciosDescuentos, setPreciosDescuentos] = useState([]);

    const [ value, setValue] =  useState(0);

    const [ precioPrueba, setPrecioPrueba ] = useState(0);

    const classes = useStyles();

    const handleDescuentos = () => {
        setOpenDescuento(!openDescuento);
        setPrecioPrueba(0);
        setValue(0);
        setPreciosDescuentos([]);
        preciosDescuentos.splice(0, preciosDescuentos.length);
    };
    
    const guardarDatos = () => {
        setValue(0);
        setOpenDescuento(!openDescuento);
        setPrecioPrueba(0);
        setPreciosDescuentos([]);
        preciosDescuentos.splice(0, preciosDescuentos.length);
    }

    let arrayDescuento = [];

    const obtenerPorciento = (event, newValue) => {
        setValue(newValue);
        preciosDescuentos.splice(0, preciosDescuentos.length);
        for (let i = 0; i < preciosProductos.length; i++) {
            var porcentaje  =  Math.round(100 - value);
            var descuento = Math.round(preciosProductos[i].precio * porcentaje / 100);
            var dineroDescontado = preciosProductos[i].precio - descuento;
            arrayDescuento = {
                "porciento": value,
                "dineroDescontado": dineroDescontado,
                "precioConDescuento": descuento,
                "descuentoActivo": true
            }
            setPrecioPrueba(descuento);
            preciosDescuentos.push(arrayDescuento);
        }
    };
    
    const obtenerPrecio = (e) => {
        if (preciosProductos.length === 1) {
            setPrecioPrueba(e.target.value);
            var porcentaje  = Math.round((e.target.value / preciosProductos[0].precio) * 100);
            var descuento =  Math.round(100 - porcentaje);
            var dineroDescontado = preciosProductos[0].precio - e.target.value;
            arrayDescuento = {
                "porciento": porcentaje,
                "dineroDescontado": dineroDescontado,
                "precioConDescuento": e.target.value,
                "descuentoActivo": true
            };
            setValue(descuento);
            setPreciosDescuentos([arrayDescuento]);
        }
    };

    function valuetext(e) {
        return `${e}°C`;
    };

    const [ CrearDescuentoUnidad ] = useMutation(REGISTRAR_DESCUENTOS);

    const saveData = async () => {
		try {
            // if(){
                const input = preciosDescuentos
                await CrearDescuentoUnidad({
                    variables: {
                        input,
                    }
                });
            // }else{
                /* await ActualzarDepartamentos({
                    variables: {
                        
                    }
                }) */
            // }
            // setUpdateData(!updateData);
            // setUpdate(!update);
            setAlert({ message: '¡Listo!', status: 'success', open: true });
            // setError(false);
		} catch (error) {
			console.log(error);
		}
	}

    return (
        <div>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            <Button
                size="small"
                color="default"
                onClick={handleDescuentos}
            >
               <LocalOfferIcon />
            </Button>
            <Dialog open={openDescuento} onClose={handleDescuentos} maxWidth="lg">
				<DialogTitle>
                    <Grid container>
                        <Box flexGrow={1} display="flex" alignItems="center">
                            {'Descuento de Producto'}
                        </Box>
                        <Box m={1}>
                            <Button variant="contained" color="secondary" onClick={() => handleDescuentos()} size="large">
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
                        <Grid item lg={6}>
                            <Box p={1}>
                                <TablaPreciosDescuentos
                                    value={value}
                                    setPrecioPrueba={setPrecioPrueba}
                                    precios={datos.unidades_de_venta} 
                                    preciosProductos={preciosProductos} 
                                    setPreciosProductos={setPreciosProductos} 
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={6}>
                            <Box mt={5} display="flex" justifyContent="center">
                                <div className={classes.root}>
                                    <Typography id="discrete-slider-always" gutterBottom>
                                        Porcentaje de descuento
                                    </Typography>
                                    <Box my={5} />
                                    <Slider
                                        getAriaValueText={valuetext}
                                        value={value}
                                        aria-labelledby="discrete-slider-small-steps"
                                        valueLabelDisplay="auto"
                                        onChange={obtenerPorciento} 
                                    />
                                </div>
                            </Box>
                            <Box mt={5} display="flex" justifyContent="center">
                                {preciosProductos.length === 1 ? ( 
                                    <div>
                                        <Typography>Precio con Descuento</Typography>
                                        <TextField
                                            /* fullWidth */
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            size="small"
                                            /* error */
                                            /* name="precio_neto"
                                            /* id="form-producto-nombre-comercial" */
                                            variant="outlined"
                                            // defaultValue={ precioPrueba }
                                            value={ precioPrueba }
                                            /* helperText="Incorrect entry." */
                                            onChange={(e) => obtenerPrecio(e)}
                                        />
                                    </div>
                                ) : (
                                    null
                                )}

                            </Box>
                            <Box p={2} display="flex" justifyContent="center">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                    onClick={guardarDatos}
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
