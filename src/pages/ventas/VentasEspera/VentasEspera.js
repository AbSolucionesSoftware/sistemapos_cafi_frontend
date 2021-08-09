import React from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent, Divider,Grid, IconButton, InputBase,  Paper, Typography } from '@material-ui/core'
import listaEspera from '../../../icons/ventas/lista-de-espera.svg'
import { Search } from '@material-ui/icons';
import ListaVentas from './ListaVentas';

export default function VentasEspera({handleClickOpen}) {

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
                            <img src={listaEspera} alt="icono caja" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h6">
                                Ventas en espera
                            </Typography>
                            
                        </Box>
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