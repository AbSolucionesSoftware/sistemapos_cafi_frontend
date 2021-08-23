import React from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent, Divider,Grid, IconButton, InputBase,  Paper, Typography } from '@material-ui/core'
import listaEspera from '../../../icons/ventas/lista-de-espera.svg'
import { Search } from '@material-ui/icons';
import ListaVentas from './ListaVentas';
import CloseIcon from '@material-ui/icons/Close';

export default function VentasEspera({handleClickOpen}) {

    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box
                        display="flex"
                        flexGrow={1}
                    >
                        <Box>
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3} >
                            <Typography variant="h6">
                                Ventas en espera
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
                            <Box width="100%">
                                <Paper className={classes.rootBusqueda}>
                                    <InputBase
                                        fullWidth
                                        placeholder="Buscar venta..."
                                    />
                                    <IconButton >
                                        <Search />
                                    </IconButton>
                                </Paper>
                            </Box>
                        </div>
                        <ListaVentas />
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}