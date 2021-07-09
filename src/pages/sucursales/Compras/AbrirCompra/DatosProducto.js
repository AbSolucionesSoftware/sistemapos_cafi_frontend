import { Grid, Box,Container, Button, 
        TextField, Typography, makeStyles,
        FormControlLabel, Checkbox
        } from '@material-ui/core';

import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import PreciosProductos from './PreciosProductos';
import RegistroProducto from './RegistroProducto';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
        paddingTop: 3,
        alignItems: "center",
        justifyItems: "center"
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function DatosProducto() {

    const classes = useStyles();

    return (
        <Container maxWidth="xl">
            <Grid container>
                <Grid item lg={10}>
                    <div className={classes.formInputFlex}>
                        <Box>
                            <Typography>
                                Producto a registrar 
                            </Typography>
                        </Box>
                        <Box width="30%">
                            <TextField
                                fullWidth
                                size="small"
                                /* error */
                                name="clave_alterna"
                                id="form-producto-clave-alterna"
                                variant="outlined"
                                /* value="" */
                                /* helperText="Incorrect entry." */
                                /* onChange={obtenerCampos} */
                            />
                        </Box>
                        <Box>
                            <Button
                                size="large"
                                variant="contained" 
                                color="primary"
                            >
                                Buscar
                            </Button>
                        </Box>
                    </div>
                </Grid>
                <Grid item lg={2}>
                    <RegistroProducto />
                </Grid>
            </Grid>

            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Código de barras</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="codigo-producto"
                        id="form-codigo-producto"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <Typography>Producto</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="producto_nombre"
                        id="form-producto-nombre"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <Typography>Cantidad</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="producto_cantidad"
                        id="form-producto-cantidad"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <Typography>% de descuento</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="producto_descuento"
                        id="form-producto-descuento"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <FormControlLabel
                        control={
                            <Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />
                        }
                        label="I.V.A."
                    />
                </Box>
                <Box width="100%">
                    <Typography>Existencias </Typography>
                    <Typography>
                        500
                    </Typography>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Unidad de Compra</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="producto_unidad_compra"
                        id="form-producto-unidad-compra"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <Typography>Unidades por compra</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="unidad_por_compra"
                        id="form-producto-unidad-por-compra"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
                <Box width="100%">
                    <Typography>Precio unitario</Typography>
                    <Typography>
                        500
                    </Typography>
                </Box>
                <Box width="100%">
                    <Typography>Importe</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="producto_importe"
                        id="form-producto-importe"
                        variant="outlined"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
            </div>

            <Grid container>
                <Grid item lg={10}>
                    <Box p={2}>
                        <PreciosProductos/>
                    </Box>
                </Grid>
                <Grid item lg={2}>
                    <Box p={2}>
                        <Button
                            size="large"
                            variant="contained" 
                            color="primary"
                            startIcon={<AddIcon fontSize="large" />}
                        >
                            Agregar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}
