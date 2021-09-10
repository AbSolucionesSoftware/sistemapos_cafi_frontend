import React from 'react';

import { Box, Button, DialogActions, DialogContent, Divider, Grid, Typography } from '@material-ui/core'

import useStyles from '../styles';

import cajon from '../../../icons/ventas/cajon.svg'


export default function AbrirCajon({handleClickOpen}) {

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
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cajon.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h5">
                                Cajon Abierto
                            </Typography>
                        </Box>
                    </Box>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClickOpen} 
                    variant="contained" 
                    color="primary"
                >
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}
