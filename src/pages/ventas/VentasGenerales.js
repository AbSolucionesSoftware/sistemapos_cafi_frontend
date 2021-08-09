import { Box, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Select, Switch,  Typography } from '@material-ui/core'
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
                        <img alt="imagen de empresa" src={"https://www.sicar.mx/wp-content/uploads/2014/10/logotipo.png"} className={classes.imagen} />
                    </Box>
                </Grid>
                <Grid item lg={8}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                            <Box mt={2} mr={1}>
                                <img src={codigo} alt="iconoBander" className={classes.iconSize} /> 
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
                                <img src={usuario} alt="iconoBander" className={classes.iconSize} /> 
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
                                <img src={vendedor} alt="iconoBander" className={classes.iconSize} /> 
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
                                <img src={ticket} alt="iconoBander" className={classes.iconSize} /> 
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
                            <img alt="imagen de empresa" src={"https://www.sicar.mx/wp-content/uploads/2014/10/logotipo.png"} className={classes.imagen} />
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
                                <Typography> 
                                    Monedero
                                </Typography>
                                <Switch />
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