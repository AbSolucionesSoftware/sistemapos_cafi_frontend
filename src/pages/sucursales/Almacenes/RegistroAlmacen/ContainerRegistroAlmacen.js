import React, { useState, Fragment, useContext, useCallback } from 'react';
import { 
    Button, 
    Dialog, 
    TextField, 
    Container, 
    Typography, 
    Box, 
    IconButton, 
    DialogTitle, 
    Divider,
    FormControl,
    Select,
    MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CrearAlmacenContext } from '../../../../context/Almacenes/crearAlmacen';
import { useMutation, useQuery } from '@apollo/client';
import { REGISTRO_ALMACEN, ACTUALIZAR_ALMACEN } from '../../../../gql/ALmacenes/Almacen';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import { OBTENER_USUARIOS } from '../../../../gql/Catalogos/usuarios';

import { Edit } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
        '& span': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function ContainerRegistroAlmacen({ accion, datos }) {

    /* const sucursal = {
        _id: "60c8e180340d5d223432a916",
        nombre_sucursal: "Sucursal 1 editada"
    }; */
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const [ CrearAlmacen ] = useMutation(REGISTRO_ALMACEN);
    const [ ActualizarAlmacen ] = useMutation(ACTUALIZAR_ALMACEN);
    const { data } = useQuery(OBTENER_USUARIOS,{
		variables: {
			sucursal: `${sesion.sucursal._id}`
		}
	});	
    let obtenerUsuarios = [];

	const classes = useStyles();
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	// const empresa = '609eb3b4b995884dc49bbffa';
	const [ open, setOpen ] = useState(false);
	const { datosAlmacen, setDatosAlmacen, error, setError, update, setUpdate } = useContext(CrearAlmacenContext);
    const [ loading, setLoading ] = useState(false);
    

    // const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const limpiarCampos = useCallback(
		() => {
			setDatosAlmacen({
                nombre_almacen: '',
                id_usuario_encargado: '',
                direccion: {
                    calle: '',
                    no_ext: '',
                    no_int: '',
                    codigo_postal: '',
                    colonia: '',
                    municipio: '',
                    localidad: '',
                    estado: '',
                    pais: ''
                }
			});
		},
		[ setDatosAlmacen ]
	);
    const toggleModal = () => {
		setOpen(true);
		if (datos) {
            let input = {};
            if(datos.id_usuario_encargado){
                const {id_usuario_encargado, ...datosNew} = datos;
                input = datosNew;
                input.id_usuario_encargado = id_usuario_encargado._id;
            }else{
                input = datos;
            }
			setDatosAlmacen(input);
		}
	};

    const onCloseModal = () => {
		setOpen(false);
		limpiarCampos();
	};

    const obtenerCampos = (e) => {
		setDatosAlmacen({
			...datosAlmacen,
			[e.target.name]: e.target.value
		});
	};

    const obtenerCamposDireccion = (e) => {
        if(e.target.name === "codigo_postal"){
            setDatosAlmacen({
                ...datosAlmacen,
                direccion: { ...datosAlmacen.direccion, [e.target.name]: parseInt(e.target.value) }
            });
        }else{
            setDatosAlmacen({
                ...datosAlmacen,
                direccion: { ...datosAlmacen.direccion, [e.target.name]: e.target.value }
            });
        }
	};

    const saveData = async () => {
        try {
            if(!datosAlmacen.nombre_almacen){
                setError(true);
			    return;
            }else{
                if(accion === "registrar"){
                    let input = {};
                    if(datosAlmacen.id_usuario_encargado === ""){
                        const { id_usuario_encargado, ...input } = datosAlmacen;
                        await CrearAlmacen({
                            variables: {
                                input,
                                id: sesion.sucursal._id
                            }
                        });
                    }else{
                        input = datosAlmacen
                        await CrearAlmacen({
                            variables: {
                                input,
                                id: sesion.sucursal._id
                            }
                        });
                    } 
                }else{
                    console.log("Editar");
                    // console.log(datosAlmacen);
                    const { id_sucursal, _id, ...input } = datosAlmacen;
                    console.log(input);
                    await ActualizarAlmacen({
                        variables: {
                            input,
                            id: datosAlmacen._id
                        }
                    })
                }
                setUpdate(!update);
                setAlert({ message: '¡Listo!', status: 'success', open: true });
                setError(false);
                setLoading(false);
                onCloseModal();
            }
        } catch (error) {
            console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
        }
    }

    if(data){
        obtenerUsuarios = data.obtenerUsuarios;
    }

    return (
        <Fragment>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            {accion === 'registrar' ? (
				<Button color="primary" variant="contained" size="large" onClick={toggleModal}>
                    Nuevo almacen
                </Button>
			) : (
				<IconButton onClick={toggleModal}>
					<Edit />
				</IconButton>
			)}
			<Dialog open={open} onClose={onCloseModal} fullWidth maxWidth="md">
            <BackdropComponent loading={loading} setLoading={setLoading} />
            <DialogTitle id="form-dialog-title">Registro almacen</DialogTitle>
				<Container maxWidth="md">
                <div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography><span>* </span>Nombre Almacen</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            error={error}
                            name="nombre_almacen"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.nombre_almacen}
                            /* helperText="Incorrect entry." */
                            onChange={obtenerCampos}
                        />
					</Box>
					<Box width="100%">
						<Typography>Encargado de almacen</Typography>
                        <FormControl fullWidth size="small"  variant="outlined">
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="id_usuario_encargado"
                            value={datosAlmacen.id_usuario_encargado ? datosAlmacen.id_usuario_encargado : ""}
                            onChange={obtenerCampos}
                            >
                                {
                                    obtenerUsuarios?.map((user, index) => (
                                        <MenuItem key={index} value={user._id}>{user.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
					</Box>
                    <Box width="100%">
						<Typography>Sucursal</Typography>
                        <Typography style={{marginTop:"7px", fontWeight: "bold" }}>{sesion.sucursal.nombre_sucursal}</Typography>
					</Box>
				</div>
                <Box mt={2}>
                    <Typography>
                        <b>Domicilio</b>
                    </Typography>
                    <Divider />
                </Box>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
						<Typography>Calle</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.calle}
                            name="calle"
                            variant="outlined"
                            value={datosAlmacen.direccion.calle}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
					<Box width="100%">
						<Typography>No. exterior</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.no_ext}
                            name="no_ext"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.no_ext}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                    <Box width="100%">
						<Typography>No. interior</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.no_int}
                            name="no_int"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.no_int}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
						<Typography>Codigo Postal</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            // error={error && !datosAlmacen.direccion.codigo_postal}
                            name="codigo_postal"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.codigo_postal}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
					<Box width="100%">
						<Typography>Colonia</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.colonia}
                            name="colonia"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.colonia}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                    <Box width="100%">
						<Typography>Municipio</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.municipio}
                            name="municipio"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.municipio}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                </div>  
                <div className={classes.formInputFlex}>
                    <Box width="100%">
						<Typography>Localidad</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.localidad}
                            name="localidad"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.localidad}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
					<Box width="100%">
						<Typography>Estado</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            // error={error && !datosAlmacen.direccion.estado}
                            name="estado"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.estado}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                    <Box width="100%">
						<Typography>Pais</Typography>
                        <TextField
                            fullWidth
                            size="small"    
                            //  error={error && !datosAlmacen.direccion.pais}
                            name="pais"
                            id="form-producto-codigo-barras"
                            variant="outlined"
                            value={datosAlmacen.direccion.pais}
                            onChange={obtenerCamposDireccion}
                        />
					</Box>
                </div>
                <Box m={1} display="flex" justifyContent="flex-end">
                    <Button color="primary" variant="contained" size="large" onClick={saveData} >
                        Guardar
                    </Button>
                </Box>                
                </Container>
			</Dialog>
		</Fragment>
    )
}
