import React, { useContext } from 'react'

import { Accordion, AccordionSummary, Typography, 
        makeStyles, AccordionDetails, Box,
        Container, FormControlLabel, Checkbox,
        MenuItem, TextField, FormControl, Select, Divider, InputAdornment, Grid} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';
import Precio1 from '../../../sucursales/Catalogos/Producto/PreciosVenta/Precios';

import { Alert } from '@material-ui/lab';
import PreciosDeCompra from '../../Catalogos/Producto/PreciosVenta/preciosCompra';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {

      fontSize: theme.typography.pxToRem(15),
      fontWeight: "bolder",
    },
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
	},
	precioTitle: {
		width: theme.spacing(20),
		display: 'flex',
		alignItems: 'center'
	}
  }));

export default function PreciosProductos() {

    const classes = useStyles();
	const { preciosP } = useContext(RegProductoContext);

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>INFORMACIÓN DE PRODUCTO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Container maxWidth="xl">
                            <Box>
                                <Typography>
                                    <b>Impuestos</b>
                                </Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" alignItems="center" my={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox name="iva_activo" />
                                    }
                                    label="IVA"
                                />
                                <Box width={180}>
                                    <TextField
                                        // disabled={!precios.iva_activo}
                                        label="porcentaje IVA"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
                                        size="small"
                                        name="iva"
                                        id="form-producto-iva"
                                        variant="outlined"
                                        // value={precios.iva}
                                        // onChange={obtenerIva}
                                    />
                                </Box>
                                <Box mx={5} />
                                <FormControlLabel
                                    control={
                                        <Checkbox name="ieps_activo" />
                                    }
                                    label="IEPS"
                                />
                                <Box width={180}>
                                    <TextField
                                        // disabled={!precios.ieps_activo}
                                        label="porcentaje IEPS"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 }, endAdornment: <InputAdornment position="start">%</InputAdornment>, }}
                                        size="small"
                                        name="ieps"
                                        id="form-producto-ieps"
                                        variant="outlined"
                                        // value={precios.ieps}
                                        // onChange={obtenerIeps}
                                    />
                                </Box>
                                <Box display="flex" alignItems="center" ml={1}>
                                    <Alert severity="info">Selecciona los impuestos aplicables</Alert>
                                </Box>
                            </Box>
                            <Grid container>
                                <Grid item lg={7}>
                                    <Box>
                                        <Typography>
                                            <b>Precios de compra</b>
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box className={classes.formInputFlex} >
                                        <Box>
                                            <Typography><span className="obligatorio">* </span>Precio sin impuestos</Typography>
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                size="small"
                                                // error={validacion.error && !precios.precio_de_compra.precio_sin_impuesto}
                                                name="precio_sin_impuesto"
                                                id="form-producto-precio_sin_impuesto"
                                                variant="outlined"
                                                // value={precios.precio_de_compra.precio_sin_impuesto}
                                                // helperText={validacion.message}
                                                // onChange={obtenerPreciosCompra}
                                            />
                                        </Box>
                                        <Box width="120px">
                                            <Typography align="center">IVA</Typography>
                                            <Typography align="center" variant="h6">
                                                <b>$ 150</b>
                                            </Typography>
                                        </Box>
                                        <Box width="120px">
                                            <Typography align="center">IEPS</Typography>
                                            <Typography align="center" variant="h6">
                                                <b>$ 150</b>
                                            </Typography>
                                        </Box>
                                        <Box >
                                            <Typography><span className="obligatorio">* </span>Precio con impuestos</Typography>
                                            <TextField
                                                // disabled={!precios.iva_activo && !precios.ieps_activo}
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                size="small"
                                                // error={validacion.error && !precios.precio_de_compra.precio_con_impuesto}
                                                name="precio_con_impuesto"
                                                id="form-producto-precio_con_impuesto"
                                                variant="outlined"
                                                // value={precios.precio_de_compra.precio_con_impuesto}
                                                // helperText={validacion.message}
                                                // onChange={obtenerPreciosCompra}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item lg={5}>
                                    <Box>
                                        <Typography>
                                            <b>Unidades de compra</b>
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box className={classes.formInputFlex} >
                                        <Box width="130px">
                                            <Typography><span className="obligatorio">* </span>Unidad de compra</Typography>
                                            <Box display="flex">
                                                <FormControl variant="outlined" fullWidth size="small" 
                                                    // error={validacion.error && !precios.unidad_de_compra.unidad}
                                                >
                                                    {/* {!precios.granel ? (
                                                        <Select id="form-producto-categoria"
                                                            name="unidad" value={precios.unidad_de_compra.unidad}
                                                            onChange={obtenerUnidadCompra}>
                                                            <MenuItem value="">
                                                                <em>NINGUNA</em>
                                                            </MenuItem>
                                                            <MenuItem value="LITROS">LITROS</MenuItem>
                                                            <MenuItem value="CAJAS">CAJAS</MenuItem>
                                                            <MenuItem value="PIEZAS">PIEZAS</MenuItem>
                                                            <MenuItem value="TARIMAS">TARIMAS</MenuItem>
                                                        </Select>
                                                    ) : ( */}
                                                        <Select id="form-producto-categoria"
                                                            name="unidad" 
                                                            // value={precios.unidad_de_compra.unidad}
                                                            // onChange={obtenerUnidadCompra}
                                                        >
                                                            <MenuItem value="">
                                                                <em>NINGUNA</em>
                                                            </MenuItem>
                                                            <MenuItem value="KILOGRAMOS">KILOGRAMOS</MenuItem>
                                                            <MenuItem value="COSTALES">COSTALES</MenuItem>
                                                        </Select>
                                                    {/* )} */}
                                                    {/* <FormHelperText>{validacion.message}</FormHelperText> */}
                                                </FormControl>
                                            </Box>
                                        </Box>
                                        <Box width="120px">
                                            <Typography><span className="obligatorio">* </span>Factor por Unidad</Typography>
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                size="small"
                                                // error={validacion.error && !precios.unidad_de_compra.cantidad}
                                                name="cantidad"
                                                id="form-producto-cantidad"
                                                variant="outlined"
                                                // value={precios.unidad_de_compra.cantidad}
                                                // helperText={validacion.message}
                                                // onChange={obtenerUnidadCompra}
                                            />
                                        </Box>
                                        <Box width="160px">
                                            <Typography align="center">Precio unitario sin impuestos</Typography>
                                            <Typography align="center">
                                                <b>$ 100</b>
                                            </Typography>
                                        </Box>
                                        <Box width="160px">
                                            <Typography align="center">Precio unitario con impuestos</Typography>
                                            <Typography align="center">
                                                <b>$100</b>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box>
                                <Typography>
                                    <b>Precios de venta</b>
                                </Typography>
                            </Box>
                            <Divider />
                            <Container maxWidth="xl">
                                <Grid container>
                                    <Grid item md={12} lg={8}>
                                            Componente Reutilizado OJO al programar
                                            <br/>
                                        <Box display="flex">
                                            {preciosP.map((res, index) => (<Precio1 key={index} data={res} />))}
                                        </Box>
                                    </Grid>
                                    <Grid item md={12} lg={4}>
                                        <Box display="flex">
                                            <Divider orientation="vertical" style={{ height: 300 }} />
                                            <Box>
                                                Componente Reutilizado OJO al programar
                                                <br/>
                                                <PreciosDeCompra />
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                    </Container>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
