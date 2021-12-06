import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid,  IconButton,  Paper,  Slide,  TextField, Typography } from '@material-ui/core'
import tarjeta from '../../../icons/ventas/tarjeta-de-credito.svg';
import { FcDonate, FcShop } from 'react-icons/fc';
import { Search } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CerrarVenta() {

    const classes = useStyles();
    const [cambio, setCambio] = useState(false);

    const abrirCajon = () => {setCambio(!cambio)};
    const [open, setOpen] = useState(false);

    const [totalVenta, setTotalVenta] = useState(0);
    const [valorActual, setValorActual] = useState('EFECTIVO')
    const [totalARestar, setTotalARestar] = useState(0);
    
    const handleClickOpen = () => { 
        let venta = JSON.parse(localStorage.getItem("DatosVentas"));
        const total = venta === null ? 0 : venta.total;
        // console.log(venta);
        setTotalVenta(total.toFixed(2))
        setTotalARestar(total.toFixed(2));
		setOpen(!open);
	};

    // console.log(totalVenta);
    // console.log(totalARestar);

    function funcion_tecla(event) {
		const tecla_escape = event.keyCode;
		if(tecla_escape === 27){
            handleClickOpen();
		}
	}

    const changeValue = (e) => {
        setValorActual(e)
    }

    const handlerChangeValue = (e) => {
        setTotalARestar(e);
    }

	window.onkeydown = funcion_tecla;

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg' 
                            alt="icono ventas" 
                            style={{width: 38}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Pagar</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>ESC</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    <Grid container item lg={12} justify="center">
                        <Box display="flex" justifyContent="center" flexGrow={1}>
                            <Box> 
                                <img 
                                    src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg' 
                                    alt="icono ventas" className={classes.iconSizeDialogsPequeno} 
                                />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={1} textAlign="center">
                                <Typography variant="h4">
                                    Ticket
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                    </Grid>
                    <Grid>
                        <div className={classes.formInputFlex}>
                            <Box width="100%" textAlign="center">
                                <Typography>
                                    Total a pagar:
                                </Typography>
                                <Typography variant='h3' style={{color: 'green'}}>
                                    ${totalVenta}
                                </Typography>
                                <Typography variant='caption'>
                                    (CIENTO CICUENTA PESOS 00/100 MNX)
                                </Typography>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="25%" textAlign="center">
                                <Box>
                                    <img
                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/money.svg' 
                                        alt="icono ventas" className={classes.iconSizeDialogsPequeno} 
                                        onClick={() => changeValue("EFECTIVO")}
                                        style={{cursor: 'pointer'}}
                                    />
                                </Box>
                                <Typography variant='caption'>
                                    Efectivo
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="efectivo"
                                        id="form-producto-efectivo"
                                        variant="outlined"
                                        value={valorActual === "EFECTIVO" ?  totalVenta : ''}
                                        onChange={(e) => handlerChangeValue(e)}
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box>
                                    <img
                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/tarjeta-de-credito.svg' 
                                        alt="icono ventas" className={classes.iconSizeDialogsPequeno} 
                                        onClick={() => changeValue("TARJETA")}
                                        style={{cursor: 'pointer'}}
                                    />
                                </Box>
                                <Typography variant='caption'>
                                    Tarjeta
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                        value={valorActual === "TARJETA" ?  totalVenta : ''}
                                        onChange={(e) => handlerChangeValue(e)}
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box> 
                                    <FcShop 
                                        style={{fontSize: 50,cursor: 'pointer'}} 
                                        onClick={() => changeValue("PUNTOS")}
                                    />
                                </Box>
                                <Typography variant='caption'>
                                    Puntos
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                        value={valorActual === "PUNTOS" ?  totalVenta : ''}
                                        onChange={(e) => handlerChangeValue(e)}
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box 
                                    p={0}
                                >
                                    <img 
                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/transferencia-bancaria.svg' 
                                        alt="icono ventas" className={classes.iconSizeDialogsPequeno} 
                                        onClick={() => changeValue("TRANSFERENCIA")}
                                        style={{cursor: 'pointer'}}
                                    />
                                </Box>
                                <Typography variant='caption'>
                                    Transferencia
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                        value={valorActual === "TRANSFERENCIA" ?  totalVenta : ''}
                                        onChange={(e) => handlerChangeValue(e)}
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box 
                                    p={0}
                                >
                                    <img 
                                        src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/cheque.png' 
                                        alt="icono ventas" className={classes.iconSizeDialogsPequeno} 
                                        onClick={() => changeValue("CHEQUE")}
                                        style={{cursor: 'pointer'}}
                                    />
                                </Box>
                                <Typography variant='caption'>
                                    Cheque
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                        value={valorActual === "CHEQUE" ?  totalVenta : ''}
                                        onChange={(e) => handlerChangeValue(e)}
                                    />
                                </Box>
                            </Box>
                        </div>
                        <Paper elevation={3} >
                            <div className={classes.formInputFlex}>
                                <Box width="40%">
                                    <Typography variant='caption'>
                                        <b>Puntos Generados:</b>
                                    </Typography>
                                    <Box>
                                        <Typography variant='subtitle1'>
                                        800
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box width="100%">
                                    <Typography variant='caption'>
                                        <b>Cliente:</b>
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant='caption'>
                                            Jerusalen Martinez
                                        </Typography>
                                        <IconButton>
                                            <Search />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box width="40%">
                                    <Typography variant='caption'>
                                        <b>Puntos Dsiponibles:</b>
                                    </Typography>
                                    <Box>
                                        <Typography variant='subtitle1'>
                                        800
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box width="100%">
                                    <Button
                                        color="primary" 
                                        variant="outlined"
                                        startIcon={<img src={tarjeta} alt="icono ventas" style={{width: 30}} />}
                                    >
                                        Venta a Credito
                                    </Button>
                                </Box>
                                <Box width="100%" textAlign="right">
                                    <Typography variant='caption'>
                                        <b>Su cambio:</b>
                                    </Typography>
                                    <Typography variant='h4' style={{color: 'red'}}>
                                        {totalVenta > 0 && totalARestar > 0 ? totalARestar - totalVenta : 0}
                                    </Typography>
                                    <Typography variant='caption'>
                                        (CIENTO CICUENTA PESOS 00/100 MNX)
                                    </Typography>
                                </Box>
                            </div>
                        </Paper>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        size="large"
                        onClick={() => {
                            abrirCajon()
                        }}
                        variant="contained" 
                        color="primary" 
                        autoFocus
                    >
                        Terminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
				open={cambio} 
				onClose={abrirCajon} 
				TransitionComponent={Transition}
			> 
                <DialogContent>
                    <Box textAlign="center" >
                        <Box>
                            <FcDonate style={{fontSize: 80}} />
                        </Box>
                        <Box textAlign="center">
                            <Typography variant="h5">
                                Su cambio
                            </Typography>
                        </Box>
                    </Box>
                    <Grid item lg={12}>
                        <Paper elevation={3}>
                            <Box p={3} width="100%" textAlign="center">
                                <Typography variant='h3' style={{color: 'red'}}>
                                    $150.000
                                </Typography>
                                <Typography variant='caption'>
                                    (CIENTO CICUENTA PESOS 00/100 MNX)
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button 
                        onClick={handleClickOpen}
                        variant="contained" 
                        size="large"
                        color="primary" 
                        autoFocus
                    >
                        Aceptar
                    </Button>
                </DialogActions>
			</Dialog>
        </>
    )
}
