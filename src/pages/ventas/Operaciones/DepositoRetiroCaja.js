import React from 'react';

import { Box, Button,  DialogActions, DialogContent, Divider, FormControl, Grid,  MenuItem, Select, TextField, Typography } from '@material-ui/core'

import cashregister2Icon from '../../../icons/ventas/cash-register2.svg'

import useStyles from '../styles';


export default function DepositoRetiroCaja({handleClickOpen}) {
    
    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container item lg={12}>
                    <Box 
                        display="flex" 
                        textAlign="center" 
                    >
                        <Box
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <img src={cashregister2Icon} alt="icono caja" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Deposito / Retiro Caja
                                </Typography>
                            </Box>
                        </Box>
                        <Box ml={7} textAlign="right">
                            <Box textAlign="right">
                                <Typography variant="caption">
                                    31/12/2021
                                </Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption">
                                    08:00 hrs.
                                </Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption">
                                    Caja 3
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    </Grid>
                    <Grid>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Movimiento
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
                                        <MenuItem value="ENTRADA">Entrada</MenuItem>
                                        <MenuItem value="RETIRO">Retiro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Tipo:
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
                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                                        <MenuItem value="Transferencia">Transferencia</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>Monto:</Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box width="100%">
                                <Typography>Moneda:</Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        value="Moneda Local"
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>Comentarios:</Typography>
                                <Box display="flex">
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        name="codigo_barras"
                                        id="form-producto-codigo-barras"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        </div>
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
