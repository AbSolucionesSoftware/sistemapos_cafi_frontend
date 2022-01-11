import React, { useState } from 'react'

import {  Box, Button, Dialog, DialogActions, DialogContent, makeStyles, Slider, TextField, Typography } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { formatoMexico } from '../../../../../../config/reuserFunctions';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    appBar: {
		position: 'relative'
	},
}));

export default function LiquidarCuenta({cuenta}) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0)

    console.log(cuenta);

    const handleClick = () => { 
        setOpen(!open);
    };

    const classes = useStyles();

    const obtenerPorcientoSlide = (event, newValue) => {
        setValue(newValue);
        let porcentaje  =  parseFloat((100 - newValue).toFixed(2));//Porcentaje para calculos de descuento
        let cuenta_descuento = parseFloat((cuenta.saldo_credito_pendiente * porcentaje / 100).toFixed(2));
        let dineroDescontado = parseFloat((cuenta.saldo_credito_pendiente - cuenta_descuento).toFixed(2));

    };

    const obtenerPrecioText = (e) => {
        let valorText = parseFloat(e.target.value);
        // if (preciosProductos.length === 1) {
        //     setPrecioPrueba(valorText);
            
        //     let suma_impuestos = parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) + parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
        //     let PVSI = parseFloat((valorText / (suma_impuestos+1)).toFixed(2));

        //     let cantidad_unidad = preciosProductos[0].precio_unidad.cantidad_unidad;
        //     let dineroDescontado = 0;
        //     let PVCDSI = 0; // Precio venta con descuento sin impuestos
        //     let porcentaje  = parseFloat(((PVSI / preciosProductos[0].precio_unidad.precio_venta) * 100).toFixed(2));
        //     let descuento = parseFloat((100 - porcentaje).toFixed(2));

        //     PVCDSI = parseFloat((preciosProductos[0].precio_unidad.precio_venta * porcentaje / 100).toFixed(2));
        //     dineroDescontado = parseFloat((preciosProductos[0].precio_unidad.precio_venta - PVCDSI).toFixed(2));

        //     let iva_precio = parseFloat((PVCDSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`).toFixed(2)));
        //     let ieps_precio = parseFloat((PVCDSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`).toFixed(2)));
        //     let utilidad = parseFloat((((PVCDSI - PCSI) / PCSI) * 100).toFixed(2));
        //     let precio_neto = parseFloat((PVCDSI + iva_precio + ieps_precio).toFixed(2));
        //     let precio_general = parseFloat((precio_neto * cantidad_unidad).toFixed(2));

        //     setValue(descuento);
        //     setPreciosDescuentos([arrayDescuento]);
        // }
    };
    
    function valuetext(e) {
        return `${e}`;
    };


    return (
        <div>
            <Button
                size="medium"
                variant="outlined"  
                color="primary"
                startIcon={<DoneIcon />}
                onClick={handleClick}
            >
                Liquidar
            </Button>

            <Dialog
                open={open}
                fullWidth
                maxWidth='xs'
                onClose={handleClick}
                aria-labelledby="draggable-dialog-title"
            >
                <Box display="flex">
                    <Box flexGrow={1} p={2}>
                        <Typography variant="h6" className={classes.title}>
                            Liquidar Cuenta
                        </Typography>
                    </Box>
                    <Box p={1}>
                        <Button variant="contained" color="secondary" onClick={handleClick} size="large">
                            <CloseIcon  />
                        </Button>
                    </Box>
				</Box>
                <DialogContent>
                    <Typography>Aplica un descuento por pronto pago a tu cuenta</Typography>
                    <Box mt={1} textAlign="center">
                        <Typography id="discrete-slider-always" gutterBottom>
                            <b>Porcentaje de descuento</b>
                        </Typography>
                    </Box>
                    <Box ml={1} mr={1} mb={2} >
                        <Slider
                            getAriaValueText={valuetext}
                            value={value.toFixed(2)}
                            aria-labelledby="discrete-slider-small-steps"
                            valueLabelDisplay="auto"
                            onChange={obtenerPorcientoSlide} 
                        />
                    </Box>
                    <Box width="100%" textAlign="center">
                        <TextField
                            fullWidth
                            size="small"
                            name="descuento"
                            variant="outlined"
                        />
                    </Box>
                    <Box display="flex" mt={2}>
                        <Box flexGrow={1}>
                            <Typography>Total cuenta: </Typography>
                        </Box>
                        <Box>
                            <Typography>{formatoMexico()}</Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Saldo pendiente: </Typography>
                        </Box>
                        <Box >
                            <Typography>{formatoMexico()}</Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Descuento: </Typography>
                        </Box>
                        <Box >
                            <Typography>{formatoMexico()}</Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Total a pagar:</Typography>
                        </Box>
                        <Box >
                            <Typography>{formatoMexico()}</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClick} 
                        color="primary"
                        variant="contained"
                        size="large"
                    >
                        Liquidar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
