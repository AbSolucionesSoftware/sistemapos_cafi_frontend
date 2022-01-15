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
    const [value, setValue] = useState(0);
    const [cuentaTotalDescuento, setCuentaTotalDescuento] = useState(0);
    const [dineroDescontado, setDineroDescontado] = useState(0);

    console.log(cuenta);

    const handleClick = () => { 
        setOpen(!open);
    };

    const classes = useStyles();

    const obtenerPorcientoSlide = (event, newValue) => {
        setValue(newValue);
        let porcentaje  =  parseFloat((100 - newValue).toFixed(2));//Porcentaje para calculos de descuento
        let cuenta_con_descuento = parseFloat((cuenta.saldo_credito_pendiente * porcentaje / 100).toFixed(2));
        let dineroDescontado = parseFloat((cuenta.saldo_credito_pendiente - cuenta_con_descuento).toFixed(2));
        setCuentaTotalDescuento(cuenta_con_descuento);
        setDineroDescontado(dineroDescontado);
    };

    const obtenerPrecioText = (e) => {
        let valorText = parseFloat(e.target.value);

        let porcentaje  = parseFloat((((valorText * 100) / cuenta.saldo_credito_pendiente ).toFixed(2)));
        let dineroDescontado = parseFloat((cuenta.saldo_credito_pendiente - valorText).toFixed(2));

        setCuentaTotalDescuento(valorText);
        setDineroDescontado(dineroDescontado);
        setValue(porcentaje);

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
                            value={cuentaTotalDescuento ? cuentaTotalDescuento : ''}
                            onChange={obtenerPrecioText}
                        />
                    </Box>
                    <Box display="flex" mt={2}>
                        <Box flexGrow={1}>
                            <Typography>Total cuenta: </Typography>
                        </Box>
                        <Box>
                            <Typography><b>${formatoMexico(cuenta.total)}</b></Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Saldo pendiente: </Typography>
                        </Box>
                        <Box >
                            <Typography><b>${formatoMexico(cuenta.saldo_credito_pendiente)}</b></Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Dinero Descontado: </Typography>
                        </Box>
                        <Box >
                            <Typography><b>${formatoMexico(dineroDescontado)}</b></Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography>Porciento Descontado: </Typography>
                        </Box>
                        <Box >
                            <Typography><b>{formatoMexico(value)}%</b></Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <Typography variant="h6" >Total a pagar:</Typography>
                        </Box>
                        <Box >
                            <Typography variant="h6" ><b style={{color: 'green'}}>${formatoMexico(cuentaTotalDescuento)}</b></Typography>
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
