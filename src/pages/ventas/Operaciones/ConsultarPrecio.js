import React, { useState } from 'react';
import { Box, Button,  CircularProgress,  Dialog,  DialogActions, DialogContent, Divider, Grid,  IconButton,  InputBase,  Paper,  Slide,  Typography } from '@material-ui/core'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../styles';
import { Search } from '@material-ui/icons';
import { useLazyQuery } from '@apollo/client';
import { CONSULTA_PRODUCTO_UNITARIO } from '../../../gql/Ventas/ventas_generales';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConsultarPrecio() {
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

    const [obtenerProductos, { data, loading }] = useLazyQuery(
        CONSULTA_PRODUCTO_UNITARIO,
        {
          variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
          fetchPolicy: "network-only",
        }
    );

    let productoBase = null;
    if (data) productoBase = data.obtenerUnProductoVentas;

    const [open, setOpen] = useState(false);
    
    const classes = useStyles();

    const handleClickOpen = () => { 
		setOpen(!open);
        productoBase = [];
	};

    const keyUpEvent = async (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            const input_value = event.target.value;
            console.log(input_value)
            obtenerProductos({
                variables: {
                    datosProductos: input_value,
                    sucursal: sesion.sucursal._id,
                    empresa: sesion.empresa._id
                },
                fetchPolicy: "network-only"
            });
        }
    };

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 120){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/precios.svg' 
                            alt="icono ventas" 
                            style={{width: 36}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Consultar Precio</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F9</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>
            <Dialog
                maxWidth='md'
                fullWidth
                open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
            >
                <DialogContent
                    open={open} 
                    onClose={handleClickOpen} 
                    TransitionComponent={Transition}
                >
                    <Grid container item lg={12}>
                        <Box
                            display="flex" 
                            textAlign="center"
                            flexGrow={1}
                        >
                            <Box>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/productos.svg' alt="icono productos" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Precio Producto
                                </Typography>
                            </Box>
                        </Box>
                        <Box displa="flex" justifyContent="center">
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                    </Grid>
                    <div className={classes.formInputFlex}>
                        <Box width="50%">
                            <Paper className={classes.rootBusquedaProductos}>
                                <InputBase
                                    fullWidth
                                    onKeyUp={keyUpEvent}
                                    placeholder="Buscar producto..."
                                />
                                <IconButton>
                                    <Search />
                                </IconButton>
                            </Paper>
                        </Box>
                    </div>
                    {loading ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="40vh"
                        >
                            <CircularProgress />
                        </Box>
                    ) : (<>
                        <Grid container>
                            <Grid item lg={6} md={6}>
                                <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                                    {productoBase?.id_producto?.imagenes.length > 0 ? (
                                        <Box className={classes.containerImagenesProducto}>
                                            <img 
                                                alt="Imagen producto" 
                                                src={productoBase?.id_producto?.imagenes[0].url_imagen} 
                                                className={classes.imagenProducto}
                                            />
                                        </Box>
                                    ) : (
                                        <Box p={1} display="flex" justifyContent="center" alignItems="center">
                                            <PhotoLibraryIcon style={{fontSize: 40}} />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6}>
                                <Paper elevation={3} className={classes.rootPrecioProductos}>
                                    <div className={classes.formInputFlex}>
                                        <Box width="100%" textAlign="center">
                                            <Typography >
                                                <b>{productoBase?.codigo_barras}</b>
                                            </Typography>
                                        </Box>
                                    </div>
                                    <div className={classes.formInputFlex}>
                                        <Box width="100%" textAlign="center">
                                            <Typography variant="h6">
                                                <b>{productoBase?.id_producto?.datos_generales.nombre_comercial}</b>
                                            </Typography>
                                        </Box>
                                    </div>
                                    <div className={classes.formInputFlex}>
                                        <Box width="100%" textAlign="center">
                                            <Typography>
                                                {productoBase?.descuento_activo === true ? (<b>Precio Promoción</b>) : null}
                                            </Typography>
                                            <Typography variant="h3">
                                                {productoBase?.descuento_activo === true ? 
                                                    (<b style={{color: "red"}}>${productoBase?.descuento?.precio_con_descuento.toFixed(2)}</b>) :
                                                    (<b style={{color: "green"}}>${productoBase?.precio}</b>)}
                                            </Typography>
                                        </Box>
                                    </div>
                                    {productoBase?.descuento_activo === true ? (
                                        <div className={classes.formInputFlex}>
                                            <Box width="100%" textAlign="center">
                                                <Typography>
                                                    <b>Precio S/D</b>
                                                </Typography>
                                                <Typography variant="h5" style={{color: "green"}}>
                                                    <b> ${productoBase?.precio} </b>
                                                </Typography>
                                            </Box>
                                        </div>
                                    ) : null}
                                    <div className={classes.formInputFlex}>
                                        <Box width="100%" textAlign="center">
                                            <Typography >
                                                Unidad
                                            </Typography>
                                            <Typography >
                                                <b>{productoBase?.unidad}</b>
                                            </Typography>
                                        </Box>
                                        <Box width="100%" textAlign="center">
                                            <Typography >
                                                Existencia
                                            </Typography>
                                            <Typography >
                                                <b> {productoBase?.inventario_general ? 
                                                        productoBase?.inventario_general[0]?.cantidad_existente :
                                                        0
                                                    } 
                                                </b>
                                            </Typography>
                                        </Box>
                                    </div>
                                </Paper>
                            </Grid>     
                        </Grid>
                    </>) } 
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClickOpen} 
                        variant="contained" 
                        color="primary" 
                        size="large"
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        
        </>
    )
}
