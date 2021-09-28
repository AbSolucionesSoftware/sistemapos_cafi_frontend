import React, { useState, useContext } from 'react';
import { 
    Box, 
    FormControl, 
    Grid, 
    IconButton, 
    InputBase, 
    MenuItem, 
    Paper, 
    Select, 
    Typography,
    CircularProgress,
    TextField
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import useStyles from './styles';
import TablaVentas from './TablaVentas';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_PRODUCTOS } from '../../gql/Catalogos/productos';
import { VentasContext } from '../../context/Ventas/ventasContext';
import { CONSULTA_PRODUCTOS } from '../../gql/Ventas/ventas_generales';


// import usuario from '../../icons/usuarios.svg';
// import codigo from '../../icons/ventas/busqueda-de-codigos-de-barras.svg';
// import vendedor from '../../icons/ventas/admin.svg';
// import ticket from '../../icons/ventas/publicalo.svg';

import { Fragment } from 'react'; 
import MonedaCambio from './Operaciones/MonedaCambio';



export default function VentasGenerales() {

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    console.log(sesion);
    const classes = useStyles();
    const [ filtro, setFiltro ] = useState('');

    const { loading, data, error, refetch } = useQuery(CONSULTA_PRODUCTOS, {
		variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id }
	});

    const {
        datosProductoVentas,
        setDatosProductoVentas,
        productosVentas,
        setProductosVentas,
        datosVentas,
        setDatosVentas
    } = useContext(VentasContext);

    const obtenerValorAutoComplete = (tipo, value) => {
        console.log(tipo,value);
        // if (!value) {
        //   setDatosProducto({ ...datosProducto, [tipo]: {} });
        //   return;
        // }
        // setDatosProducto({ ...datosProducto, [tipo]: value });
      };

    if(loading) 
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="30vh"
            >
                <CircularProgress />
            </Box>
        );

        

    console.log(data);
    const productosBase = data.obtenerConsultaGeneralVentas;
    console.log(productosBase);

    const keyUpEvent = async (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            // const input_value = event.target.value;
            // console.log(input_value, "valor input");
            // const producto_selecionado = await productosBase.filter((producto) => {
            //     if(producto.datos_generales.clave_alterna === input_value || producto.datos_generales.codigo_barras === input_value){
            //         return producto;
            //     }
            // })
            // console.log(producto_selecionado, "retorno filtro");
        }
    }

    

    return (
            <Fragment>
                <Grid container>
                    <Grid item lg={2}>
                        {
                            sesion.empresa.imagen ? (
                                <Box className={classes.containerImage}>
                                    <img alt="imagen de empresa" src={sesion.empresa.imagen} className={classes.imagen} />
                                </Box>
                            ) : null
                        }
                    </Grid>
                    <Grid item lg={8}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/busqueda-de-codigos-de-barras.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    {/* <Autocomplete
                                        id="combo-box-producto"
                                        size="small"
                                        fullWidth
                                        options={productosBase}
                                        getOptionLabel={(option) => option.datos_generales.nombre_comercial ? option.datos_generales.nombre_comercial : 'N/A'}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Producto" variant="outlined" />
                                        )}
                                        onChange={(_, value) =>
                                            obtenerValorAutoComplete("Producto", value)
                                        }
                                        getOptionSelected={(option) => option.datos_generales.nombre_comercial}
                                        value={
                                            datosProductoVentas.producto.datos_generales ? datosProductoVentas.producto : null
                                        }
                                    /> */}
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar producto..."
                                            onKeyUp={keyUpEvent}
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/usuarios.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar cliente..."
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </Box>
                            <Box width="100%" display="flex" justifyItems="center" alignSelf="center" justifySelf="center" alignItems="center">
                                <Box mt={2} mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar vendedor..."
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </Box>
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <MonedaCambio />
                            </Box>
                            <Box width="100%" display="flex">
                                <Box mr={1}>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg' alt="iconoBander" className={classes.iconSize} /> 
                                </Box>
                                <Box>
                                    <FormControl
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    >
                                        <Select
                                            id="tipo_documento"
                                            name="tipo_documento"
                                        >
                                            <MenuItem value="TICKET">
                                                <em>Selecciona uno</em>
                                            </MenuItem>
                                            <MenuItem value="TICKET">TICKET</MenuItem>
                                            <MenuItem value="FACTURA">FACTURA</MenuItem>
                                            <MenuItem value="NOTA REMISION">NOTA REMISION</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>  
                        </div>
                    </Grid>
                    <Grid item lg={2} >
                        <Box display='flex' justifyContent="flex-end"
                        >
                            <Box className={classes.containerImage} >
                                <img alt="imagen de empresa" src={"https://duckduckgo.com/?q=fotos+150x150&atb=v255-1&iax=images&ia=images&iai=https%3A%2F%2Fintrepidplan.com%2Fwp-content%2Fuploads%2F2020%2F02%2Fcropped-favicon-150x150_op.png"} className={classes.imagen} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                
                <Grid item lg={12}>
                    <TablaVentas />
                </Grid>                                                                                                                                                             
            
                <Grid container item lg={12} justify="flex-end">
                    <Box p={1}>
                        <Paper elevation={3}>
                            <Box display="flex">
                                <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Unidades: 25
                                    </Typography>
                                </Box>
                                <Box p={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Descuento: 25%
                                    </Typography>
                                </Box>
                                <Box mr={1} display='flex' justifySelf='center' alignItems='center'>
                                    <Typography variant="subtitle1">
                                        Subtotal: $250,000
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" mr={1} >
                                <Typography variant="subtitle1">
                                    Impuestos: $15,00
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="row-reverse" mr={1} mt={1}>
                                <Typography variant='h5'>
                                    Total: $250,000.00
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>  
            </Fragment>
    )
}