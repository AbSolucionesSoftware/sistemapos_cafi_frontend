import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid, Typography } from '@material-ui/core'

import useStyles from '../styles';
import shoppingcartIcon from '../../../icons/ventas/shopping-cart.svg'

export default function CancelarVenta({handleClickOpen}) {

    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box
                        display="flex" 
                        textAlign="center" 
                        justifyContent="center" 
                        alignContent="center" 
                        alignSelf="center"
                        justifySelf="center"
                    >
                        <Box>
                            <img src={shoppingcartIcon} alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h5">
                                Cancelar Venta
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Box p={2}>
                    <Typography variant='h5'>
                        Esta seguro que desea cancelar esta venta?
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="outlined" color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleClickOpen} variant="outlined" color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}
