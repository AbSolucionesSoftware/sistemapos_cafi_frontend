import React, { useState } from 'react';
import { Box, Button, DialogActions, Dialog, 
        DialogContent, Divider, Grid, 
        Typography, Slide, InputBase, Paper, 
        IconButton} from '@material-ui/core'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import useStyles from '../styles';
import { useDebounce } from 'use-debounce/lib';
import { FcSearch } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';
import { Search } from '@material-ui/icons';
import ListaProductos from './ListaProductos';
import { useQuery } from '@apollo/client';
import { CONSULTA_PRODUCTOS_VENTAS } from '../../../gql/Ventas/ventas_generales';
import InformacionProducto from './InformacionProducto';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function BuscarProducto() {
    const classes = useStyles();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const [open, setOpen] = useState(false);
    const [ searchProducto, setSearchProducto ] = useState([]);
    const [ productoSeleccionado, setProductoSeleccionado ] = useState([]);
    
	const [ value ] = useDebounce(searchProducto, 500);

    const { data, refetch, loading } = useQuery(CONSULTA_PRODUCTOS_VENTAS, {
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
            input: {
                producto: value.producto ? value.producto : ""
            }
		}
	});
    
    let productosBusqueda = [];

    if(data) productosBusqueda = data.obtenerProductosVentas;

    const obtenerDatos = (e) => {
        setSearchProducto({...searchProducto, [e.target.name]: e.target.value})
    };

    const keyUpEvent = async (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            setSearchProducto({...searchProducto, [e.target.name]: e.target.value});
            refetch();
        }   
    };

    const handleClickOpen = () => { 
        setProductoSeleccionado([]);
        refetch();
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.altKey && e.keyCode === 80){ 
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
                        <FcSearch style={{fontSize: 45}} />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Productos</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>Alt + P</b>
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
                <DialogContent>
                    <Grid container>
                        <Grid item lg={3}>
                            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                                {productoSeleccionado?.id_producto?.imagenes.length > 0 ? (
                                    <Box className={classes.containerImage}>
                                        <img 
                                            alt="Imagen producto" 
                                            src={productoSeleccionado?.id_producto?.imagenes[0].url_imagen} 
                                            className={classes.imagen}
                                        />
                                    </Box>
                                ) : (
                                    <Box p={8} display="flex" justifyContent="center" alignItems="center">
                                        <PhotoLibraryIcon style={{fontSize: 40}} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                        <Grid item lg={9}>
                            <Box display="flex">
                                <Box
                                    display="flex"
                                    flexGrow={1}
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            Buscar Productos
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                        <CloseIcon />
                                    </Button>
                                </Box>
                            </Box>
                            <div className={classes.formInputFlex}>
                                <Box width="50%">
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            name="producto"
                                            placeholder="Buscar producto..."
                                            onChange={obtenerDatos}
                                            onKeyUp={keyUpEvent}
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                    <InformacionProducto productoSeleccionado={productoSeleccionado} />
                    <Grid>
                        <ListaProductos 
                            productosBusqueda={productosBusqueda}
                            setProductoSeleccionado={setProductoSeleccionado}
                            loading={loading}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                        AGREGAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
};
