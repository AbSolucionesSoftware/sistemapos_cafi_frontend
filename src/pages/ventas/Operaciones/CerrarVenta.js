import React, { useState } from 'react'
import useStyles from '../styles';

import { 
    Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Divider, 
    Grid,  
    IconButton,  
    Paper,  
    Slide,  
    TextField, 
    Typography 
} from '@material-ui/core'
import tarjeta from '../../../icons/ventas/tarjeta-de-credito.svg';
import { FcDonate, FcShop } from 'react-icons/fc';
import { Search } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

import {
    Edit
  } from "@material-ui/icons";

import { FcBusinessman, FcSalesPerformance } from 'react-icons/fc';


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
    const [cambioVenta, setCambioVenta] = useState(0);
    const [datosCliente, setDatosCliente] = useState({});
    const [monedero, setMonedero] = useState();
    
    const handleClickOpen = () => { 
        let venta = JSON.parse(localStorage.getItem("DatosVentas"));
        const total = venta === null ? 0 : venta.total;
        // console.log(venta);
        setTotalVenta(total.toFixed(2))
        setTotalARestar(total.toFixed(2));
		setOpen(!open);
        setDatosCliente(venta === null ? {} : venta.cliente);
        setMonedero(venta === null ? 0 : venta.monedero);
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

    const handlerChangeValue = (e,location) => {
        if(valorActual === location){
            setTotalARestar(e.target.value);
            setCambioVenta(e.target.value - parseFloat(totalVenta));
        }
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
                                        value={valorActual === "EFECTIVO" ?  totalARestar : '0.00'}
                                        onChange={(e) => handlerChangeValue(e,"EFECTIVO")}
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
                                        value={valorActual === "TARJETA" ?  totalARestar : '0.00'}
                                        onChange={(e) => handlerChangeValue(e,"TARJETA")}
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
                                        value={valorActual === "PUNTOS" ?  totalARestar : '0.00'}
                                        onChange={(e) => handlerChangeValue(e,"PUNTOS")}
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
                                        value={valorActual === "TRANSFERENCIA" ?  totalARestar : '0.00'}
                                        onChange={(e) => handlerChangeValue(e,"TRANSFERENCIA")}
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
                                        value={valorActual === "CHEQUE" ?  totalARestar : '0.00'}
                                        onChange={(e) => handlerChangeValue(e,"CHEQUE")}
                                    />
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="40%">
                                <Box
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Box mt={.5} mr={.5} >
                                        <FcBusinessman style={{fontSize: 19}} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption">
                                            <b>Cliente:</b>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant='subtitle1' >
                                        <b style={{fontSize: 16}} >{datosCliente ? datosCliente.nombre_cliente : "Sin cliente" }</b>
                                    </Typography> 
                                </Box>
                            </Box>

                            <Box width="60%">
                                <Box
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Box mt={.5} mr={.5} >
                                        <FcSalesPerformance style={{fontSize: 19}} />
                                    </Box>
                                    <Box 
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Typography variant="caption" align="center" >
                                            <b>Puntos Generados:</b>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant='subtitle1'>
                                        $ {monedero}
                                    </Typography> 
                                </Box>
                            </Box>

                            <Box width="60%">
                                <Box
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Box mt={.5} mr={.5} >
                                        <FcSalesPerformance style={{fontSize: 19}} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption">
                                            <b>Puntos Disponibles:</b>
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant='subtitle1'>
                                        $ 800
                                    </Typography> 
                                </Box>
                            </Box>


                            {/* <Box width="50%">
                                <Typography variant='caption'>
                                    <b>Puntos Dsiponibles:</b>
                                </Typography>
                                <Box>
                                    <Typography variant='subtitle1'>
                                        $ 800
                                    </Typography>
                                </Box>
                            </Box> */}
                            
                            <Box width="100%" textAlign="right">
                                <Typography variant='caption'>
                                    <b>Su cambio:</b>
                                </Typography>
                                <Typography variant='h4' style={{color: 'green'}}>
                                    $ { cambioVenta }
                                </Typography>
                                <Typography variant='caption'>
                                    (CIENTO CICUENTA PESOS 00/100 MNX)
                                </Typography>
                            </Box>
                        </div>

                        <Box>
                            <Box width="100%">
                                <Button
                                    color="primary" 
                                    variant="outlined"
                                    startIcon={<img src={tarjeta} alt="icono ventas" style={{width: 30}} />}
                                >
                                    Venta a Credito
                                </Button>
                            </Box>
                        </Box>
                        
                        <div className={classes.formInputFlex}>
                            <Box width="20%">
                                <Typography variant='caption'>
                                    <b>Dias de Crédito:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box width="20%">
                                <Typography variant='caption'>
                                    <b>Límite de Crédito:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box width="20%">
                                <Typography variant='caption'>
                                    <b>Crédito Disponible:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <Box width="100%" mt={2.5} >
                                    <Button
                                        color="primary" 
                                        variant="outlined"
                                        size="large"
                                        startIcon={<Edit />}
                                    >
                                        Editar
                                    </Button>
                                </Box>
                            </Box>
                        </div>

                        <div className={classes.formInputFlex}>
                            <Box width="20%">
                                <Typography variant='caption'>
                                    <b>Total a Crédito:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>

                            <Box width="20%" >
                                <Typography variant='caption'>
                                    <b>Dias de Crédito:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>

                            <Box width="20%">
                                <Typography variant='caption'>
                                    <b>Fecha de Vencimiento:</b>
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                        type="date"
                                    />
                                </Box>
                            </Box>
                        </div>

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
