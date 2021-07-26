import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { Box, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
    precioTitle: {
        width: theme.spacing(20),
    },
    marginInput: {
        marginTop: 19
    }
}));

export default function Precio1({ data }) {
    const classes = useStyles();
    const { preciosP, precios } = useContext(RegProductoContext);
    const [precio_venta, setPrecioVenta] = useState(0);
    const [precio_neto, setPrecioNeto] = useState(0);
    const [utilidad, setUtilidad] = useState(0);

    const obtenerUtilidad = (value) => {
        for (let i = 0; i < preciosP.length; i++) {
            const element = preciosP[i];
            if (element.numero_precio === data.numero_precio) {
                preciosP[i].utilidad = parseFloat(value)
                setUtilidad(parseFloat(value))
                let utilidad;
                utilidad = parseFloat("1." + value);
                if (value < 10) utilidad = parseFloat("1.0" + value);

                const ganancia_utilidad_sin_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto) * utilidad);
                preciosP[i].precio_venta = parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2));
                setPrecioVenta(parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2)));


                if (precios.iva_activo || precios.ieps_activo) {
                    const ganancia_utilidad_con_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto) * utilidad);
                    preciosP[i].precio_neto = parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
                    setPrecioNeto(parseFloat(ganancia_utilidad_con_impuestos.toFixed(2)));
                } else {
                    const ganancia_utilidad_con_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto) * utilidad);
                    preciosP[i].precio_neto = parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
                    setPrecioNeto(parseFloat(ganancia_utilidad_con_impuestos.toFixed(2)));
                }
            }
        }
    }

    const obtenerPrecioNeto = (value) => {
        for (let i = 0; i < preciosP.length; i++) {
            const element = preciosP[i];
            if (element.numero_precio === data.numero_precio) {
                preciosP[i].precio_neto = parseFloat(value)
                setPrecioNeto(value)
                let new_utilidad

                if (precios.iva_activo || precios.ieps_activo) {
                    new_utilidad = parseFloat(value) / parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto)
                } else {
                    new_utilidad = parseFloat(value) / parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto)
                }

                let porcent = (new_utilidad - 1) * 100;
                /* if(isNaN(porcent)) return */
                preciosP[i].utilidad = parseFloat(porcent.toFixed(2))
                setUtilidad(parseFloat(porcent.toFixed(2)));
            }
        }
    }

    const obtenerMayoreo = (value) => {
        for (let i = 0; i < preciosP.length; i++) {
            const element = preciosP[i];
            if (element.numero_precio === data.numero_precio) {
                preciosP[i].unidad_mayoreo = parseInt(value)
            }
        }
    }

    const calculos = useCallback(
        () => {
            if (!precios.unidad_de_compra.precio_unitario_sin_impuesto) return
        for (let i = 0; i < preciosP.length; i++) {
            const element = preciosP[i];
            if (element.numero_precio === data.numero_precio) {
                if (!data.utilidad) {
                    preciosP[i].precio_venta = precios.unidad_de_compra.precio_unitario_sin_impuesto
                    setPrecioVenta(precios.unidad_de_compra.precio_unitario_sin_impuesto);
                }
                if (!precios.iva_activo && !precios.ieps_activo) {
                    preciosP[i].precio_neto = precios.unidad_de_compra.precio_unitario_sin_impuesto
                    setPrecioNeto(precios.unidad_de_compra.precio_unitario_sin_impuesto);
                } else {
                    preciosP[i].precio_neto = precios.unidad_de_compra.precio_unitario_con_impuesto
                    setPrecioNeto(precios.unidad_de_compra.precio_unitario_con_impuesto);
                }
                let new_utilidad = utilidad < 10 ? parseFloat("1.0" + utilidad) : parseFloat("1." + utilidad);
                const ganancia_utilidad_sin_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto) * new_utilidad);
                preciosP[i].precio_venta = parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2));
                setPrecioVenta(parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2)));

                if (precios.iva_activo || precios.ieps_activo) {
                    const ganancia_utilidad_con_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto) * new_utilidad);
                    preciosP[i].precio_neto = parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
                    setPrecioNeto(parseFloat(ganancia_utilidad_con_impuestos.toFixed(2)));
                } else {
                    const ganancia_utilidad_con_impuestos = (parseFloat(precios.unidad_de_compra.precio_unitario_con_impuesto) * new_utilidad);
                    preciosP[i].precio_neto = parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
                    setPrecioNeto(parseFloat(ganancia_utilidad_con_impuestos.toFixed(2)));
                }
            }
        }
        },
        [   precios.unidad_de_compra.precio_unitario_con_impuesto,
            precios.unidad_de_compra.precio_unitario_sin_impuesto,
            data.numero_precio,
            /* data.utilidad, */
            precios.ieps_activo,
            precios.iva_activo,
            preciosP,
            /* utilidad */
        ],
    )

    useEffect(() => {
        calculos();
    }, [calculos])

    return (
        <Fragment>
            <Box>
                <Box display="flex" my={1} mx={1}>
                    <Box alignItems="flex-end" display={data.numero_precio > 1 ? "none" : "flex"}>
                        <Typography className={classes.precioTitle}>
                            <b>Utilidad</b>
                        </Typography>
                    </Box>
                    <Box width="100px">
                        <Typography>Precio {data.numero_precio}</Typography>
                        <Box mb={2} />
                        <TextField
                            disabled={!(parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto))}
                            fullWidth
                            type="number"
                            InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
                            size="small"
                            value={utilidad}
                            name="utilidad"
                            variant="outlined"
                            onChange={(e) => obtenerUtilidad(e.target.value)}
                        /* onChange={obtenerCampos} */
                        />
                    </Box>
                </Box>
                <Box display="flex" my={2} mx={1}>
                    <Box alignItems="flex-end" display={data.numero_precio > 1 ? "none" : "flex"}>
                        <Box alignItems="flex-end" flexDirection="column" display={data.numero_precio > 1 ? "none" : "flex"}>
                            <Typography className={classes.precioTitle}>
                                <b>Precio de venta</b>
                            </Typography>
                            <Typography className={classes.precioTitle} variant="caption" color="textSecondary">(precio sin impuestos)</Typography>
                        </Box>
                    </Box>
                    <Box width="100px">
                        <Typography><b>{precio_venta}</b></Typography>
                    </Box>
                </Box>
                <Box display="flex" my={1} mx={1}>
                    <Box alignItems="flex-end" flexDirection="column" display={data.numero_precio > 1 ? "none" : "flex"}>
                        <Typography className={classes.precioTitle}>
                            <b>Precio venta neto</b>
                        </Typography>
                        <Typography className={classes.precioTitle} variant="caption" color="textSecondary">(precio con impuestos)</Typography>
                    </Box>
                    <Box width="100px" className={data.numero_precio > 1 ? classes.marginInput : ''}>
                        <TextField
                            disabled={!(parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto))}
                            fullWidth
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            size="small"
                            name="precio_neto"
                            variant="outlined"
                            value={precio_neto}
                            onChange={(e) => obtenerPrecioNeto(e.target.value)}
                        />
                    </Box>
                </Box>

                <Box display="flex" my={1} mx={1}>
                    <Box alignItems="flex-end" display={data.numero_precio > 1 ? "none" : "flex"}>
                        <Typography className={classes.precioTitle}>
                            <b>Unidad por mayoreo</b>
                        </Typography>
                    </Box>
                    {data.numero_precio > 1 ? (
                        <Box width="100px">
                            <TextField
                                disabled={!(parseFloat(precios.unidad_de_compra.precio_unitario_sin_impuesto))}
                                fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 }, }}
                                size="small"
                                name="unidad_mayoreo"
                                variant="outlined"
                                onChange={(e) => obtenerMayoreo(e.target.value)}
                            />
                        </Box>) : null}
                </Box>
            </Box>
        </Fragment>
    );
}
