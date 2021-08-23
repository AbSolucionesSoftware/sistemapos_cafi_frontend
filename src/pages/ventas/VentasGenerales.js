import { Box, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Select, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons';

import React from 'react';

import useStyles from './styles';
import TablaVentas from './TablaVentas';

import usuario from '../../icons/usuarios.svg';
import codigo from '../../icons/ventas/busqueda-de-codigos-de-barras.svg';
import vendedor from '../../icons/ventas/admin.svg';
import ticket from '../../icons/ventas/publicalo.svg';

import { Fragment } from 'react';
import MonedaCambio from './Operaciones/MonedaCambio';

export default function VentasGenerales() {

    const classes = useStyles();

    return (
        <Fragment>
            <Grid container>
                <Grid item lg={2}>
                    <Box className={classes.containerImage}>
                        <img alt="imagen de empresa" src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fintrepidplan.com%2Fwp-content%2Fuploads%2F2020%2F02%2Fcropped-favicon-150x150_op.png&f=1&nofb=1"} className={classes.imagen} />
                    </Box>
                </Grid>
                <Grid item lg={8}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                            <Box mt={2} mr={1}>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg' alt="iconoBander" className={classes.iconSize} /> 
                            </Box>
                            <Box>
                                <Paper className={classes.rootBusqueda}>
                                    <InputBase
                                        fullWidth
                                        placeholder="Buscar producto..."
                                    />
                                    <IconButton >
                                        <Search />
                                    </IconButton>
                                </Paper>
                            </Box>
                        </Box>
                        <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                            <Box mt={2} mr={1}>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/usuarios.svg' alt="iconoBander" className={classes.iconSize} /> 
                            </Box>
                            <Box>
                                <Paper className={classes.rootBusqueda}>
                                    <InputBase
                                        fullWidth
                                        placeholder="Buscar cliente..."
                                    />
                                    <IconButton >
                                        <Search />
                                    </IconButton>
                                </Paper>
                            </Box>
                        </Box>
                        <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                            <Box mt={2} mr={1}>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg' alt="iconoBander" className={classes.iconSize} /> 
                            </Box>
                            <Box>
                                <Paper className={classes.rootBusqueda}>
                                    <InputBase
                                        fullWidth
                                        placeholder="Buscar vendedor..."
                                    />
                                    <IconButton >
                                        <Search />
                                    </IconButton>
                                </Paper>
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <MonedaCambio />
                        </Box>
                        <Box width="100%" display="flex">
                            <Box mr={1}>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg' alt="iconoBander" className={classes.iconSize} /> 
                            </Box>
                            <Box>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="tipo_documento"
                                        name="tipo_documento"
                                    >
                                        <MenuItem value="TICKET">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        <MenuItem value="TICKET">TICKET</MenuItem>
                                        <MenuItem value="FACTURA">FACTURA</MenuItem>
                                        <MenuItem value="NOTA REMISION">NOTA REMISION</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>  
                    </div>
                </Grid>
                <Grid item lg={2} >
                    <Box display='flex' justifyContent="flex-end"
                    >
                        <Box className={classes.containerImage} >
                            <img alt="imagen de empresa" src={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fintrepidplan.com%2Fwp-content%2Fuploads%2F2020%2F02%2Fcropped-favicon-150x150_op.png&f=1&nofb=1"} className={classes.imagen} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            
            <Grid item lg={12}>
                <TablaVentas />
            </Grid>                                                                                                                                                             
           
            <Grid container item lg={12} justify="flex-end">
                <Box p={1}>
                    <Paper elevation={3}>
                        <Box display="flex">
                            <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                <Typography variant="subtitle1">
                                    Unidades: 25
                                </Typography>
                            </Box>
                            <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                <Typography variant="subtitle1">
                                    Descuento: 25%
                                </Typography>
                            </Box>
                            <Box mr={1} display='flex' justifySelf='center' alignItems='center'>
                                <Typography variant="subtitle1">
                                    Subtotal: $250,000
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" mr={1} >
                            <Typography variant="subtitle1">
                                Impuestos: $15,00
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="row-reverse" mr={1} mt={1}>
                            <Typography variant='h5'>
                                Total: $250,000.00
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>  
            
        </Fragment>
    )
}