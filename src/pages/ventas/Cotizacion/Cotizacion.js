import React from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core'
import { FcCurrencyExchange } from 'react-icons/fc';
import ListaCotizacion from './ListaCotizacion';
import { Search } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

export default function Cotizacion({handleClickOpen}) {

    const classes = useStyles();

    return (
        <>
            <DialogContent style={{width: 800}}>
                <Grid container>
                    <Grid item lg={12}>
                        <Box
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <FcCurrencyExchange style={{fontSize: 85}} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box  flexGrow={1}>
                                <Box display="flex">
                                    <Box mt={2}>
                                        <Typography variant="h6">
                                            Cotizacion
                                        </Typography>
                                    </Box>
                                    <Box ml={2} mt={1}  display="flex" justifyContent="flex-end">
                                        <Paper className={classes.rootBusqueda}>
                                            <InputBase
                                                fullWidth
                                                placeholder="Buscar cotizacion..."
                                            />
                                            <IconButton>
                                                <Search />
                                            </IconButton>
                                        </Paper>
                                    </Box>
                                </Box>
                                <Box  mt={1} display="flex" textAlign="right">
                                    <Box textAlign="right">
                                        <Typography variant="caption">
                                            31/12/2021
                                        </Typography>
                                    </Box>
                                    <Box textAlign="right" ml={2}>
                                        <Typography variant="caption">
                                            08:00 hrs.
                                        </Typography>
                                    </Box>
                                    <Box textAlign="right" ml={2}>
                                        <Typography variant="caption">
                                            Caja 3
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item lg={12}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Cliente:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>
                                Vendedor:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                        
                        <Box width="100%">
                            <Typography>
                                Fecha Vencimiento:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    type='number'
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="80%" pt={2}>
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
                        <Box width="50%">
                            <Typography>
                                Tipo de Venta:
                            </Typography>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <Select
                                    id="form-producto-tipo"
                                    name="tipo_producto"
                                >
                                    <MenuItem value="">
                                        <em>Selecciona uno</em>
                                    </MenuItem>
                                    <MenuItem value="Credito">Credito</MenuItem>
                                    <MenuItem value="Contado">Contado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box width="20%">
                            <Typography>
                                Cantidad:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    type='number'
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Box>
                    </div>
                </Grid>
                <ListaCotizacion />
                <div className={classes.formInputFlex}>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <Box textAlign="right">
                            <Typography>
                                <b>SUBTOTAL:</b> $185.00
                            </Typography>
                            <Typography>
                                <b>IMPUESTOS:</b> $185.00
                            </Typography>
                            <Typography>
                                <b>TOTAL:</b> $185.00
                            </Typography>
                        </Box>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                    Aceptar
                </Button>
            </DialogActions>
        </>
    )
}