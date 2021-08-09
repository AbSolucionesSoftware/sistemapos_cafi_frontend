import React from 'react'
import useStyles from '../styles';

import { Box, Button, DialogActions, DialogContent, Divider, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import articuloRapido from '../../../icons/ventas/tiempo-rapido.svg'

export default function ArticuloRapido({handleClickOpen}) {

    const classes = useStyles();

    return (
        <>
            <DialogContent style={{width: 800}}>
                <Grid container>
                    <Grid item lg={8}>
                        <Box
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <img src={articuloRapido} alt="icono caja2" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Articulo Rapido
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
                <Grid item lg={12}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Clave Alterna:
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
                                Tipo de producto:
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
                                    <MenuItem value="ROPA">Ropa</MenuItem>
                                    <MenuItem value="CALZADO">Calzado</MenuItem>
                                    <MenuItem value="OTROS">Otros</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box width="100%">
                            <Typography>
                                Nombre Comercial:
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
                                Nombre Generico:
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
                        <Box width="100%">
                            <Typography>
                                Factor Unidad:
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
                                Precio sin impuestos:
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
                        <Box width="100%">
                            <Typography>
                                Precio con impuestos:
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleClickOpen} color="primary" autoFocus>
                    Agregar
                </Button>
            </DialogActions>
        </>
    )
}