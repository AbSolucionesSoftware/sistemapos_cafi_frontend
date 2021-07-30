import React, { Fragment, useContext, useState } from 'react'
import { Box, Divider, FormControl, Grid, makeStyles, MenuItem, Select, TextField, Typography, Button } from '@material-ui/core'
import TablaPreciosPlazos from './tabla_precios';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
    formInputFlex: {
        display: 'flex',
        '& > *': {
            margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
        }
    },
}));

export default function PrecioPlazos() {
    const classes = useStyles();
    const { precios, preciosPlazos, setPreciosPlazos } = useContext(RegProductoContext);
    const [ plazo, setPlazo ] = useState({
        plazo: "1",
        unidad: "PIEZAS",
        precio: 0
    });

    const obtenerPlazos = (e) => {
        if(e.target.name === "precio"){
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
        if(!plazo.plazo || !plazo.precio || !plazo.unidad) return
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
            case "TARIMAS":
                setPreciosPlazos({
                    ...preciosPlazos,
                    precio_tarimas: [...preciosPlazos.precio_tarimas, plazo]
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
                <Typography>
                    Precio venta sin impuestos: <b>{precios.precio_de_compra.precio_sin_impuesto}</b>
                </Typography>
                <Typography>
                    Precio venta con impuestos(NETO): <b>{precios.precio_de_compra.precio_con_impuesto}</b>
                </Typography>
            </Box>
            <Divider />
            <Box className={classes.formInputFlex} justifyContent="center">
                <Box>
                    <Typography>Plazo</Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" fullWidth size="small" name="plazo">
                            <Select name="unidad" value={plazo.plazo} onChange={obtenerPlazos}>
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
                            <Select
                                name="unidad" value={plazo.unidad} onChange={obtenerPlazos}>
                                <MenuItem value="TARIMAS">TARIMAS</MenuItem>
                                <MenuItem value="CAJAS">CAJAS</MenuItem>
                                <MenuItem value="PIEZAS">PIEZAS</MenuItem>
                                <MenuItem value="COSTALES">COSTALES</MenuItem>
                            </Select>
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
                    <Button variant="contained" size="large" color="primary" onClick={guardarPlazo}>Agregar</Button>
                </Box>
            </Box>
            <Box>
                <Grid container spacing={2}>
                    <Grid item lg={3}>
                        <Typography variant="h6" align="center">PIEZAS</Typography>
                        <TablaPreciosPlazos precios={preciosPlazos.precio_piezas} />
                    </Grid>
                    <Grid item lg={3}>
                        <Typography variant="h6" align="center">CAJAS</Typography>
                        <TablaPreciosPlazos precios={preciosPlazos.precio_cajas} />
                    </Grid>
                    <Grid item lg={3}>
                        <Typography variant="h6" align="center">COSTALES</Typography>
                        <TablaPreciosPlazos precios={preciosPlazos.precio_costales} />
                    </Grid>
                    <Grid item lg={3}>
                        <Typography variant="h6" align="center">TARIMAS</Typography>
                        <TablaPreciosPlazos precios={preciosPlazos.precio_tarimas} />
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}