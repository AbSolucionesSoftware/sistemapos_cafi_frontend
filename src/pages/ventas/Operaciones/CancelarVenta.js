import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid, Typography } from '@material-ui/core'

import useStyles from '../styles';
import shoppingcartIcon from '../../../icons/ventas/shopping-cart.svg'
import CloseIcon from '@material-ui/icons/Close';

export default function CancelarVenta({handleClickOpen}) {

    const classes = useStyles();

    return (
        <div>
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
        </div>
    )
}
