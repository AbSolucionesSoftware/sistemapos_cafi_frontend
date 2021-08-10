import React, { Fragment, useContext, useState } from 'react'
import { Box, Divider, FormControl, Grid, makeStyles, MenuItem, Select, TextField, Typography, Button } from '@material-ui/core'
import TablaPreciosPlazos from './tabla_precios';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
    formInputFlex: {
        display: 'flex',
        '& > *': {
            margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
        },
        '& > .precios-box': {
            margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`
        }
    },
}));

export default function PrecioPlazos() {
    const classes = useStyles();
    const { precios, preciosPlazos, setPreciosPlazos, unidadesVenta, unidadVentaXDefecto } = useContext(RegProductoContext);
    const [plazo, setPlazo] = useState({
        plazo: "1",
        unidad: precios.granel ? "COSTALES" : "PIEZAS",
        precio: 0
    });

    const obtenerPlazos = (e) => {
        if (e.target.name === "precio") {
            setPlazo({
                ...plazo,
                [e.target.name]: parseFloat(e.target.value)
            })
            return
        }
        setPlazo({
            ...plazo,
            [e.target.name]: e.target.value
        })
    }

    const guardarPlazo = () => {
        if (!plazo.plazo || !plazo.precio || !plazo.unidad) return
        switch (plazo.unidad) {
            case "PIEZAS":
                setPreciosPlazos({
                    ...preciosPlazos,
                    precio_piezas: [...preciosPlazos.precio_piezas, plazo]
                })
                break;
            case "CAJAS":
                setPreciosPlazos({
                    ...preciosPlazos,
                    precio_cajas: [...preciosPlazos.precio_cajas, plazo]
                })
                break;
            case "COSTALES":
                setPreciosPlazos({
                    ...preciosPlazos,
                    precio_costales: [...preciosPlazos.precio_costales, plazo]
                })
                break;
            default:
                break;
        }
        setPlazo({
            ...plazo,
            precio: 0
        })
    }

    return (
        <Fragment>
            <Box className={classes.formInputFlex}>
                <Typography className="precios-box">
                    Precio venta de <b>{unidadVentaXDefecto.unidad}</b> con impuestos(NETO): <b>${unidadVentaXDefecto.precio}</b>
                </Typography>
                {unidadesVenta.map((unidades, index) => {
                    if (!unidades.default) return (
                        <Typography key={index} className="precios-box">
                            Precio venta de <b>{unidades.unidad}</b> con impuestos(NETO): <b>${unidades.precio}</b>
                        </Typography>
                    )
                    return null
                })}
            </Box>
            <Divider />
            <Box className={classes.formInputFlex} justifyContent="center">
                <Box>
                    <Typography>Plazo</Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" fullWidth size="small" name="plazo">
                            <Select name="plazo" value={plazo.plazo} onChange={obtenerPlazos}>
                                <MenuItem value="1">1 Mes</MenuItem>
                                <MenuItem value="2">2 Meses</MenuItem>
                                <MenuItem value="6">6 Meses</MenuItem>
                                <MenuItem value="8">8 Meses</MenuItem>
                                <MenuItem value="12">12 Meses</MenuItem>
                                <MenuItem value="18">18 Meses</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Typography>Unidad</Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" fullWidth size="small" name="unidad">
                            {precios.granel ? (
                                <Select
                                    name="unidad" value={plazo.unidad} onChange={obtenerPlazos}>
                                    <MenuItem value="COSTALES">COSTALES</MenuItem>
                                </Select>
                            ) : (
                                <Select
                                    name="unidad" value={plazo.unidad} onChange={obtenerPlazos}>
                                    <MenuItem value="CAJAS">CAJAS</MenuItem>
                                    <MenuItem value="PIEZAS">PIEZAS</MenuItem>
                                </Select>
                            )}
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Typography>Precio</Typography>
                    <TextField
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        size="small"
                        name="precio"
                        value={plazo.precio}
                        variant="outlined"
                        onChange={obtenerPlazos}
                    />
                </Box>
                <Box display="flex" alignItems="flex-end">
                    <Button variant="contained" size="large" color="primary" onClick={() => guardarPlazo()}>Agregar</Button>
                </Box>
            </Box>
            <Box>
                <Grid container spacing={2} justify="center">
                    {precios.granel ? (
                        <Fragment>
                            <Grid item lg={3}>
                                <Typography variant="h6" align="center">COSTALES</Typography>
                                <TablaPreciosPlazos precios={preciosPlazos.precio_costales} />
                            </Grid>
                        </Fragment>
                    ) :
                        <Fragment>
                            <Grid item lg={3}>
                                <Typography variant="h6" align="center">PIEZAS</Typography>
                                <TablaPreciosPlazos precios={preciosPlazos.precio_piezas} />
                            </Grid>
                            <Grid item lg={3}>
                                <Typography variant="h6" align="center">CAJAS</Typography>
                                <TablaPreciosPlazos precios={preciosPlazos.precio_cajas} />
                            </Grid>
                        </Fragment>}

                </Grid>
            </Box>
        </Fragment>
    )
}