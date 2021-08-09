import React, { useState } from 'react'
import useStyles from '../styles';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid,  Paper,  Slide,  TextField, Typography } from '@material-ui/core'
import cartIcon from '../../../icons/ventas/cart.svg'
import money from '../../../icons/ventas/money.svg';
import tarjeta from '../../../icons/ventas/tarjeta-de-credito.svg';
import transfer from '../../../icons/transferencia-bancaria.svg';
import { FcDonate } from 'react-icons/fc';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CerrarVenta({handleClickOpen}) {

    const classes = useStyles();
    const [cambio, setCambio] = useState(false);

    const abrirCajon = () => {setCambio(!cambio)};

    return (
        <div>
            <DialogContent>
                    <Grid container item lg={12} justify="center">
                        <Box
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <img src={cartIcon} alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                            <Box width="50%" textAlign="center">
                                <Box>
                                    <img src={money} alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                            <Box width="50%" textAlign="center">
                                <Box>
                                    <img src={tarjeta} alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                            <Box width="50%" textAlign="center">
                                <Box p={0}>
                                    <img src={transfer} alt="icono ventas" className={classes.iconSizeDialogsPequeno} />
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
                                    <Typography variant='subtitle1'>
                                        <b>Puntos:</b>
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
                    variant="outlined" 
                    color="primary" 
                    autoFocus
                >
                    Aceptar
                </Button>
                <Button 
                    onClick={handleClickOpen} 
                    variant="outlined" 
                    color="secondary"
                    size="large"
                >
                    Cancelar
                </Button>
            </DialogActions>

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
                        size="large"
                        onClick={handleClickOpen}
                        variant="outlined" 
                        color="primary" 
                        autoFocus
                    >
                        Aceptar
                    </Button>
                    <Button 
                        onClick={handleClickOpen} 
                        variant="outlined" 
                        color="secondary"
                        size="large"
                    >
                        Cancelar
                    </Button>
                </DialogActions>
			</Dialog>

        </div>
    )
}
