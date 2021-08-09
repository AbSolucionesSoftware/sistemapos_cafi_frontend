import React from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent, Divider, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import cashregisterIcon from '../../../icons/ventas/cash-register.svg'

export default function CerrarCaja({handleClickOpen}) {

    const classes = useStyles();

    return (
        <div>
            <DialogContent>
                <Grid container>
                    <Grid item lg={8}>
                        <Box
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <img src={cashregisterIcon} alt="icono caja" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Corte Caja
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item lg={4}>
                        <Box textAlign="right">
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
                    </Grid>
                </Grid>
                <Grid>
                    <div className={classes.formInputFlex}>
                        {/* <Box width="100%">
                            <Typography>
                                Monto en Corte:
                            </Typography>
                            <Typography variant='h4' style={{color: 'green'}}>
                                $150.000
                            </Typography>
                        </Box> */}
                        <Box width="100%">
                            <Typography>
                                Turno:
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
                                    <MenuItem value="Vespertino">Vespertino</MenuItem>
                                    <MenuItem value="Matutino">Matutino</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Empleado:</Typography>
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
                            <Typography>Monto Entregado:</Typography>
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
                <Button onClick={handleClickOpen} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleClickOpen} color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </div>
    )
}