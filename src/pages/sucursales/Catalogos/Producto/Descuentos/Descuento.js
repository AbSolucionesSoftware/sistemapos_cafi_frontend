import React, { useState } from 'react'

import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { Button, Dialog, makeStyles, DialogTitle, DialogContent,  Grid, Box, Typography, TextField, Slider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

import TablaPreciosDescuentos from './ListaPrecios';

const useStyles = makeStyles((theme) => ({
	avatarGroup: {
		'& > .MuiAvatarGroup-avatar': {
			width: theme.spacing(8),
			height: theme.spacing(8)
		}
	},
	root: {
		width: 300
	},
	margin: {
		height: theme.spacing(3)
	}
}));

export default function DescuentoProductos({datos}) {

    const [ openDescuento, setOpenDescuento ] = useState(false);
    const [ activeDescount, setActiveDescount ] = useState(false);

    const [ preciosProductos, setPreciosProductos ] = useState([]);

    const [preciosDescuentos, setPreciosDescuentos] = useState([]);

    const [ inputValue, setInputValue] = useState(0);

    const classes = useStyles();

    const handleDescuentos = () => {
        setOpenDescuento(!openDescuento);
    }

    let arrayDescuento = [];

    const obtenerPorciento = (value) => {
        setInputValue(value);
        preciosDescuentos.splice(0, preciosDescuentos.length);
        for (let i = 0; i < preciosProductos.length; i++) {
            var porcentaje  = 100 - inputValue;
            var descuento = ( preciosProductos[i].precio * porcentaje / 100);
            arrayDescuento = 
                {
                    "porciento": '',
                    "dineroDescontado": '',
                    "precioConDescuento": descuento,
                    "descuentoActivo": false
                }
            preciosDescuentos.push(arrayDescuento);
        }
     };

    return (
        <div>
            <Button
                size="small"
                color="primary"
                onClick={handleDescuentos}
            >
               <LocalOfferIcon />
            </Button>
            <Dialog open={openDescuento} onClose={handleDescuentos} maxWidth="lg">
				<DialogTitle>
                    <Grid container>
                        <Box flexGrow={1} display="flex" alignItems="center">
                            {'Descuento de Producto'}
                        </Box>
                        <Box m={1}>
                            <Button variant="contained" color="secondary" onClick={() => handleDescuentos()} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                    </Grid>
                </DialogTitle>
				<DialogContent>
                    <Box textAlign="center">
                        <Typography>
                            <b>Nombre comercial: </b>
                            {datos.datos_generales.nombre_comercial ? datos.datos_generales.nombre_comercial : '-'}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography>
                            <b>Nombre genérico: </b>
                            {datos.datos_generales.nombre_generico ? datos.datos_generales.nombre_generico : '-'}
                        </Typography>
                    </Box>
                    <Grid container>
                        <Grid item lg={6}>
                            <Box p={1}>
                                <TablaPreciosDescuentos 
                                    activeDescount={activeDescount}
                                    setActiveDescount={setActiveDescount}
                                    precios={datos.unidades_de_venta} 
                                    preciosProductos={preciosProductos} 
                                    setPreciosProductos={setPreciosProductos} 
                                />
                            </Box>
                        </Grid>
                        <Grid item lg={6}>
                            <Box mt={5} display="flex" justifyContent="center">
                                <div className={classes.root}>
                                    <Typography id="discrete-slider-always" gutterBottom>
                                        Porcentaje de descuento
                                    </Typography>
                                    <Box my={5} />
                                    <Slider
                                        getAriaValueText={inputValue}
                                        aria-labelledby="discrete-slider-always"
                                        valueLabelDisplay="on"
                                        getAriaValueText={obtenerPorciento}
                                    />
                                </div>
                            </Box>
                            <Box mt={5} display="flex" justifyContent="center">
                                {preciosProductos.length === 1 ? ( 
                                    <div>
                                        <Typography>Precio con Descuento</Typography>
                                        <TextField
                                            /* fullWidth */
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            size="small"
                                            disabled={true}
                                            /* error */
                                            /* name="precio_neto"
                                            /* id="form-producto-nombre-comercial" */
                                            variant="outlined"
                                            // defaultValue={ precioPromocion ? precioPromocion : precioProducto }
                                            // value={precioPromocion}
                                            /* helperText="Incorrect entry." */
                                            // onChange={obtenerPrecio}
                                        />
                                    </div>
                                ) : (
                                    null
                                )}

                            </Box>
                            <Box p={2} display="flex" justifyContent="center">
                                <Button variant="contained" color="primary" size="large">
                                    Guardar 
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
				</DialogContent>
			</Dialog>
        </div>
    )
}
