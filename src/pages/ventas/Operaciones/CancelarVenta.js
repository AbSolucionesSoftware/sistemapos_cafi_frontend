import React, { useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid, Slide, Typography } from '@material-ui/core'

import useStyles from '../styles';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarVenta() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { 
		setOpen(!open);
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
                            style={{width: 38}}
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
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                            <CloseIcon />
                        </Button>
                    </Box>
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
                        onClick={handleClickOpen} 
                        variant="contained" 
                        color="primary"
                        size="large"
                        autoFocus
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
