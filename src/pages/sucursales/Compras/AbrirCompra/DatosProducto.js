import { Grid, Box,Container, Button, 
        TextField, Typography, makeStyles,
        FormControlLabel, Checkbox, IconButton, InputBase, Paper
        } from '@material-ui/core';
import RegistroProvedor from './RegistroProvedor';
import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import PreciosProductos from './PreciosProductos';
import RegistroProducto from './RegistroProducto';
import { Search } from '@material-ui/icons';

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
	},
    root: {
		width: '100%'
	},
    rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
}));

export default function DatosProducto() {

    const classes = useStyles();

    return (
        <Container maxWidth="xl">
            <Grid container>
                <Grid item lg={12}>
                <div className={classes.root}>
                    <div className={classes.formInputFlex}>
                        <Box width="80%" m={1} display="flex" justifyContent="space-between">
                            <Box mr={1} minWidth="100%">
                                <Paper className={classes.rootBusqueda}>
                                    <InputBase
                                        fullWidth
                                        placeholder="Buscar productos..."
                                        // onChange={(e) => setValues(e.target.value)}
                                        // onKeyPress={pressEnter}
                                        // value={values}
                                    />
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </Paper>
                            </Box>
                        </Box>
                        <RegistroProducto />
                        <RegistroProvedor />
                        <Box width="100%" mx={3}>
                            <Button 
                                autoFocus
                                color="primary"
                                variant="contained" 
                                size="large" 
                            >
                                Realizar compra
                            </Button>
                        </Box>
                    </div>
                </div>
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
                        type="number"
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
                <Box width="100%" pt={3}>
                    <Button
                        fullWidth
                        size="large"
                        /* error */
                        variant="contained"
                        color="primary"
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    >
                        Agregar a compra
                    </Button>
                </Box>
            </div>

            <Grid container>
                <Grid item lg={12}>
                    <Box p={2}>
                        <PreciosProductos/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}
