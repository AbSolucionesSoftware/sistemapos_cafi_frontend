import React from 'react';

import { Box, Button,  DialogActions, DialogContent, Divider, Grid,  IconButton,  InputBase,  Paper,  Typography } from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close';

import useStyles from '../styles';
import { Search } from '@material-ui/icons';


export default function ConsultarPrecio({handleClickOpen}) {
    
    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box
                        display="flex" 
                        textAlign="center"
                        flexGrow={1}
                    >
                        <Box>
                            <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/productos.svg' alt="icono productos" className={classes.iconSizeDialogs} />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h6">
                                Inoformación Producto
                            </Typography>
                        </Box>
                    </Box>
                    <Box displa="flex" justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                            <CloseIcon />
                        </Button>
                    </Box>
                </Grid>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Paper className={classes.rootBusqueda}>
                            <InputBase
                                fullWidth
                                placeholder="Buscar producto..."
                            />
                            <IconButton>
                                <Search />
                            </IconButton>
                        </Paper>
                    </Box>
                </div>
                <Grid container>
                    <Grid item lg={6}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Box className={classes.containerImagenesProducto}>
                                    <img 
                                        alt="Imagen producto" 
                                        src={"https://cheetos.com.mx/imgs/productos/big/cheetos-1.png"} 
                                        className={classes.imagenProducto}
                                    />
                                </Box>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item lg={6}>
                        <Paper elevation={3}>
                            <div className={classes.formInputFlex}>
                                <Box width="100%" textAlign="center">
                                    <Typography>
                                        <b>Codigo:</b>
                                    </Typography>
                                    <Typography>
                                        jksjdhfdjsjdnb
                                    </Typography>
                                </Box>
                            </div>
                            <div className={classes.formInputFlex}>
                                <Box width="100%" textAlign="center">
                                    <Typography>
                                        <b>Nombre:</b>
                                    </Typography>
                                    <Typography>
                                        Sabritones
                                    </Typography>
                                </Box>
                            </div>
                            <div className={classes.formInputFlex}>
                                <Box p={2} width="100%" textAlign="center">
                                    <Typography variant="h3">
                                        <b> $15.00 </b>
                                    </Typography>
                                </Box>
                            </div>
                            <div className={classes.formInputFlex}>
                                <Box width="100%" textAlign="center">
                                    <Typography >
                                        Unidad
                                    </Typography>
                                    <Typography >
                                        <b> Kilos </b>
                                    </Typography>
                                </Box>
                                <Box width="100%" textAlign="center">
                                    <Typography >
                                        Existencia
                                    </Typography>
                                    <Typography >
                                        <b> 8 </b>
                                    </Typography>
                                </Box>
                            </div>
                        </Paper>
                    </Grid>     
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClickOpen} 
                    variant="contained" 
                    color="primary" 
                    size="large"
                >
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}
