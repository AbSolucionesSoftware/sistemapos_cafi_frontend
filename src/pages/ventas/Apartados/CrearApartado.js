import React, { Fragment, useState } from 'react'
import useStyles from '../styles';
import moment from 'moment';
import 'moment/locale/es';
import { Box, Button, Dialog, DialogActions, Divider, Grid, IconButton,  InputBase,  Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { useQuery } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "../../../gql/Catalogos/productos";
import { OBTENER_CLIENTES } from '../../../gql/Catalogos/clientes';
import { Autocomplete } from '@material-ui/lab';
moment.locale('es');


const columns = [
	{ id: 'codigo', label: 'Codigo Barras', minWidth: 20, align: 'center' },
	{ id: 'nombre', label: 'Nombre', minWidth: 160, align: 'center'},
    { id: 'catnidad', label: 'Cantidad', minWidth: 20, align: 'center' },
    { id: 'precio', label: 'Precio', minWidth: 160, align: 'center'},
    { id: 'total', label: 'Total', minWidth: 160, align: 'center'}
];

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearApartado() {
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    const hoy = moment();
    const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
    const classes = useStyles();
    const [ open, setOpen ] = useState(false);
    const [ datosProducto, setDatosProducto ] = useState([]);
    const [ cantidad, setCantidad ] = useState(0);
    const [ productosApartados, setProductosApartados] = useState([]);
    const [ datosApartado, setDatosApartado ] = useState([]);

    const { loading, data, error, refetch } = useQuery(
        OBTENER_PRODUCTOS,
        {
          variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
        }
    );
    const clientes = useQuery(OBTENER_CLIENTES, {
		variables: { tipo:'CLIENTE', filtro: '' }
	});
    if (!clientes) return null;
    if (loading) return null;

    const handleClickOpen = () => { 
		setOpen(!open);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

    const obtenerSelectsProducto = ( value ) => {
        if (!value) {
            setDatosProducto({ ...datosProducto,});
          return;
        }
        setDatosProducto({ ...datosProducto, producto: value});
    };

    const obtenerCliente = (tipo, value) => {
        if (!value) {
            setDatosApartado({ ...datosApartado, [tipo]: {} });
          return;
        }
        setDatosApartado({ ...datosApartado, [tipo]: value });
    };
    
    const obtenerDatosApartado =(e)=>{
        if (e.target.name === 'engancheApartado') {
            setDatosApartado({...datosApartado, [e.target.name]: parseInt(e.target.value)});
        }else{
            setDatosApartado({...datosApartado, [e.target.name]: e.target.value});
        }
    };

    const agregarProductos = () => {
        productosApartados.push({
            producto: datosProducto.producto,
            cantidad: cantidad,
            total: (datosProducto.producto.unidades_de_venta[0].precio * cantidad)
        });

        setDatosProducto([]);
        setCantidad(0);
    }

    console.log(productosApartados);

    const input = {
        cliente: datosApartado.cliente,
        fechaVencimiento: datosApartado.fechaVencimiento,
        engancheApartado: datosApartado.engancheApartado,
        productosApartados,
        fechaApartado: moment().locale('es-mx').format(),
        usuario: sesion.nombre,
        sucursal: sesion.sucursal._id, 
        empresa: sesion.empresa._id,
        abonos: {}
    };

    function borrarProducto(key) {
        productosApartados.forEach(function(elemento, indice, array) {
            if(key === indice){
                productosApartados.splice(key, 1);
            }
        })
        return productosApartados
    };

    return (
        <Fragment>
            <Button 
                className={classes.borderBoton}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/tag.svg' 
                            alt="icono apartados"
                            style={{width: 110}}
                        />
                    </Box>
                    <Box>
                        Apartar Producto
                    </Box>
                </Box>
            </Button>
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <Grid container>
                    <Grid item lg={12}>
                        <Box
                            p={2}
                            display="flex" 
                            textAlign="center" 
                        >
                            <Box>
                                <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/tag.svg' alt="icono apartados" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box flexGrow={1} textAlign="left"mt={2}>
                                <Box>
                                    <Typography variant="h6">
                                        Generar nuevo apartado
                                    </Typography>
                                </Box>
                                <Box display="flex" >
                                    <Box >
                                        <Typography variant="caption">
                                            {hoy.format('dddd D MMMM YYYY hh:mm')}
                                        </Typography>
                                    </Box>
                                    <Box  ml={2}>
                                        <Typography variant="caption">
                                            <b>Caja: </b> 3
                                        </Typography>
                                    </Box>
                                    <Box  ml={2}>
                                        <Typography variant="caption">
                                            <b>Atiende: </b> {sesion.nombre}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box textAlign="right">
                                <Box>
                                    <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                        <CloseIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Grid item lg={12}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Cliente:
                            </Typography>
                            <Box display="flex" alignItems="center" width='auto'>
                                <Autocomplete
                                    id="combo-box-clientes"
                                    size="small"
                                    fullWidth
                                    options={clientes.data.obtenerClientes}
                                    getOptionLabel={(option) => option.nombre_cliente}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" />
                                    )}
                                    onChange={(_, value) =>
                                        obtenerCliente("cliente", value)
                                    }
                                    getOptionSelected={(option) => option.nombre_cliente}
                                    value={
                                        datosApartado?.cliente
                                        ? datosApartado.cliente
                                        : null
                                    }
                                />
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>
                                Anticipo o enganche:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                    name='engancheApartado'
                                    onChange={obtenerDatosApartado}
                                />
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>
                                Fecha Vencimiento:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    type='date'
                                    size="small"
                                    name='fechaVencimiento'
                                    variant="outlined"
                                    onChange={obtenerDatosApartado}
                                />
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Producto</Typography>
                            <Box display="flex" alignItems="center" width='auto'>
                                <Autocomplete
                                    id="combo-box-clientes"
                                    size="small"
                                    fullWidth
                                    options={data?.obtenerProductos}
                                    getOptionLabel={(option) => option?.datos_generales?.nombre_comercial}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" />
                                    )}
                                    onChange={(_, value) =>
                                        obtenerSelectsProducto(value)
                                    }
                                    getOptionSelected={(option) => option?.datos_generales?.nombre_comercial}
                                    value={
                                        datosProducto
                                        ? datosProducto.producto
                                        : null
                                    }
                                />
                            </Box>
                        </Box>
                        <Box width="50%">
                            <Typography>
                                Cantidad:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    type='number'
                                    size="small"
                                    name='fechaVencimiento'
                                    variant="outlined"
                                    onChange={(e) => setCantidad(e.target.value)}
                                />
                            </Box>
                        </Box>
                        <Box ml={2} mr={2} >
                            <Box display="flex" mt={3}>
                                <Button
                                    startIcon={<AddIcon />}
                                    color='primary'
                                    variant='outlined'
                                    size='large'
                                    onClick={() => agregarProductos()}
                                >
                                    Agregar
                                </Button>
                            </Box>
                        </Box>
                    </div>
                    <Paper className={classes.root}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell align='center' style={{ width: 35 }}>
                                            Eliminar
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productosApartados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                <TableCell align='center' >
                                                    {row.producto.datos_generales.codigo_barras}
                                                </TableCell>
                                                <TableCell align='center' >
                                                    {row.producto.datos_generales.nombre_comercial}
                                                </TableCell>
                                                <TableCell align='center' >
                                                    {row.cantidad}
                                                </TableCell>
                                                <TableCell align='center' >
                                                    {row.producto.unidades_de_venta[0].precio}
                                                </TableCell>
                                                <TableCell align='center' >
                                                    {row.total}
                                                </TableCell>
                                                <TableCell align='center' >
                                                    <IconButton aria-label="delete" size='small' onClick={() => borrarProducto(index)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={productosApartados.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
                <div className={classes.formInputFlex}>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <Box textAlign="right" mr={2}>
                            <Typography>
                                <b>SUBTOTAL:</b> $185.00
                            </Typography>
                            <Typography>
                                <b>IMPUESTOS:</b> $185.00
                            </Typography>
                            <Typography>
                                <b>TOTAL:</b> $185.00
                            </Typography>
                        </Box>
                    </Box>
                </div>

                <DialogActions>
                    <Button onClick={handleClickOpen} color="primary" variant="contained" size="large">
                        Generar Apartado
                    </Button>
                </DialogActions>

            </Dialog>
        </Fragment>
    )
}
