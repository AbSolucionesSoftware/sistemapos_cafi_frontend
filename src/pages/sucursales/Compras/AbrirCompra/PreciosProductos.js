import React from 'react'

import { Accordion, AccordionSummary, Typography, 
        makeStyles, AccordionDetails, Box,
        Container, FormControlLabel, Checkbox,
        MenuItem, TextField, FormControl, Select} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import RegistroUtilidades from './PreciosVenta/utilidades';
import RegistroPrecioNeto from './PreciosVenta/precioNeto';
import RegistroPrecioMayoreo from './PreciosVenta/precioMayoreo';
import MostrarPrecioVenta from './PreciosVenta/precioVenta';

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

    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>PRECIOS DEL PRODUCTO</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Container maxWidth="xl">
                    <div className={classes.formInputFlex}>
                        <Box>
                            <div className={classes.formInputFlex}>
                                <FormControlLabel
                                    control={
                                        <Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
                                    }
                                    label="Precio neto"
                                />
                                <Box width="150px">
                                    <Typography>Unidad de venta</Typography>
                                    <Box display="flex">
                                        <FormControl variant="outlined" fullWidth size="small">
                                            <Select id="form-producto-categoria" /* value={age} */ /* onChange={handleChange} */>
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box width="150px">
                                    <Typography>Inventario mínimo</Typography>
                                    <TextField
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        size="small"
                                        /* error */
                                        name="inventario_minimo"
                                        id="form-producto-inventario_minimo"
                                        variant="outlined"
                                        /* value="" */
                                        /* helperText="Incorrect entry." */
                                        /* onChange={obtenerCampos} */
                                    />
                                </Box>
                                <Box width="150px">
                                    <Typography>Inventario máximo</Typography>
                                    <TextField
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        size="small"
                                        /* error */
                                        name="inventario_maximo"
                                        id="form-producto-inventario_maximo"
                                        variant="outlined"
                                        /* value="" */
                                        /* helperText="Incorrect entry." */
                                        /* onChange={obtenerCampos} */
                                    />
                                </Box>
                                <Box width="230px" boxShadow={1} p={1} borderRadius={5}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
                                        }
                                        label="Monedero electrónico"
                                    />
                                    <TextField
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        size="small"
                                        label="Valor por punto"
                                        /* error */
                                        name="monedero_electronico"
                                        id="form-producto-monedero_electronico"
                                        variant="outlined"
                                        /* value="" */
                                        /* helperText="Incorrect entry." */
                                        /* onChange={obtenerCampos} */
                                    />
                                </Box>
                            </div>
                            <Box className={classes.formInputFlex}>
                                <Typography className={classes.precioTitle}>
                                    <b>% Utilidad</b>
                                </Typography>
                                <RegistroUtilidades />
                            </Box>
                            <Box className={classes.formInputFlex}>
                                <Typography className={classes.precioTitle}>
                                    <b>Precio venta neto</b>
                                </Typography>
                                <RegistroPrecioNeto />
                            </Box>
                            <Box className={classes.formInputFlex}>
                                <Typography className={classes.precioTitle}>
                                    <b>Unidades por Mayoreo</b>
                                </Typography>
                                <RegistroPrecioMayoreo />
                            </Box>
                            <Box className={classes.formInputFlex}>
                                <Typography className={classes.precioTitle}>
                                    <b>Precio venta</b>
                                </Typography>
                                <MostrarPrecioVenta />
                            </Box>
                        </Box>
                    </div>
                </Container>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
