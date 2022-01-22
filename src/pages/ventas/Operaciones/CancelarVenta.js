import React, { useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid, Slide, Typography } from '@material-ui/core'

import useStyles from '../styles';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarVenta() {
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        if(sesion.accesos.ventas.cancelar_venta.ver === true){
            setOpen(!open);
        }
	};
    
    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 118){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shopping-cart.svg' 
                            alt="icono cancelarventa" 
                            style={{width: 35}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Cancelar Venta</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F7</b>
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
                    <Grid container item lg={12}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shopping-cart.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box>
                                <Typography variant="h5">
                                    Cancelar Venta
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Box p={2}>
                        <Typography variant='h5'>
                            ¿Esta seguro que desea cancelar esta venta?
                        </Typography>
                    </Box> 
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={()=>{
                            localStorage.removeItem('DatosVentas');
                            handleClickOpen();
                        }} 
                        variant="contained" 
                        color="primary"
                        size="large"
                        autoFocus
                    >
                        Aceptar
                    </Button>
                    <Button 
                        onClick={handleClickOpen} 
                        variant="contained" 
                        color="secondary"
                        size="large"
                        autoFocus
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
