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
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    return (
        <div>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg' 
                            alt="icono ventas" 
                            style={{width: 40}}
                        />
                    </Box>
                    <Box>
                        Pagar
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
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart.svg' alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                                    $150.000
                                </Typography>
                                <Typography variant='caption'>
                                    (CIENTO CICUENTA PESOS 00/100 MNX)
                                </Typography>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="25%" textAlign="center">
                                <Box>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/money.svg' alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
                                </Box>
                                <Typography variant='caption'>
                                    Efectivo
                                </Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/tarjeta-de-credito.svg' alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box> 
                                    <FcShop style={{fontSize: 40}} />
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
                                    />
                                </Box>
                            </Box>
                            <Box width="25%" textAlign="center">
                                <Box p={0}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/transferencia-bancaria.svg' alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                                        $150.000
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

        </div>
    )
}
