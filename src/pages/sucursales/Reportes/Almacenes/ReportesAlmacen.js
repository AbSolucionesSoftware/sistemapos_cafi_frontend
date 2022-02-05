import React, { useState,  Fragment } from 'react';

import { AppBar, Box, Button, Dialog, FormControl, 
Grid, MenuItem, Select, Slide, TextField, Toolbar, 
Typography } from '@material-ui/core';
import {CircularProgress} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from '@material-ui/styles';
import { OBTENER_USUARIOS } from '../../../../gql/Catalogos/usuarios';
import CloseIcon from '@material-ui/icons/Close';
import { ClearOutlined } from "@material-ui/icons";
import ExportarTraspasos from "./ExportarTraspasos";
import TablaAlmacenFiltradas from './TablaAlmacenFiltradas';
import { useQuery } from '@apollo/client';


import { OBTENER_ALMACENES, OBTENER_TRASPASOS  } from '../../../../gql/Almacenes/Almacen';
import { useDebounce } from 'use-debounce';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		width: 100
	},
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& .obligatorio': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
    margin: {
		margin: theme.spacing(1)
	},
    CircularProgress:{
         width: '100%',
        height: 200,
        marginTop:100,
        display: 'flex',
        justifyContent: 'center'
    },
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	},
}));

export default function ReportesAlmacen() {

    const classes = useStyles();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	
    const [open, setOpen] = useState(false);
    const [almacenOrigen, setAlmacenOrigen] = useState(null);
    const [almacenDestino, setAlmacenDestino] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputFilter, setFilter] = useState({
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
        producto: '',
        fecha_inicio: '',
        fecha_final: '',
        usuario: ''
    });

    const [encargado, setEncargado] = useState('');
    const [value] = useDebounce(inputFilter, 1000);

    let almacenes = [];
    let traspasos = [];
    let usuarios = [];


    const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES,{
        variables: {
            id: sesion.sucursal._id
        },
         fetchPolicy: "network-only"
    });	
    
    const queryObtenerUsuarios =  useQuery(OBTENER_USUARIOS,{
        variables: {
            sucursal: `${sesion.sucursal._id}`
        },
        
         fetchPolicy: "network-only"
    })
    const traspasosAlmacenes = useQuery(OBTENER_TRASPASOS,{
        variables:{
            input: value
        },
        fetchPolicy: "network-only"
    });	
	

  /*   useEffect(() => {
        try {
            
            traspasosAlmacenes.refetch({
                  input: inputFilter
            }) 
        } catch (error) {
            console.log('traspasosAlmacenes',error)
        }
        
    }, []); */
    
    const limpiarFiltros = () => {
        try {
            let filt = {
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
                producto: '',
                fecha_inicio: '',
                fecha_final: '',
                usuario: ''
            };
          
        
            setFilter(filt);
            setLoading(true);
            traspasosAlmacenes.refetch(
                {
                    input: filt
                }
            )
            setEncargado('');
            setAlmacenOrigen(null);
            setAlmacenDestino(null);
            setLoading(false);
        } catch (error) {
            
        }
  

  };
    const handleClickOpen =()=>{setOpen(!open)};
    
    if(queryObtenerAlmacenes.data){
        almacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
       
    }
     
    const setDatosInput = (e) =>{
      
          let fil = {...inputFilter, [e.target.name]: e.target.value,almacen_destino:almacenDestino,almacen_origen : almacenOrigen}
        setFilter(fil)
    }
    const setQueryAlmacenOrigen = (alm) =>{
           
        let almDes = (almacenDestino !== null ) ? almacenDestino._id : '';
        
        if(alm._id !== ''){
             setLoading(true);
            let fil = {...inputFilter, almacen_origen : alm._id, almacen_destino: almDes}
        
            traspasosAlmacenes.refetch(
                {
                    input: fil
                }
            )
           
        }
         setAlmacenOrigen(alm)
          setLoading(false);
    }
     const setQueryAlmacenDestino = (alm) =>{
        let almOri = (almacenOrigen !== null ) ? almacenOrigen._id : '';  
        if(alm._id !== ''){
      
            let fil = {...inputFilter, almacen_origen : almOri, almacen_destino : alm._id}
            setLoading(true);
            traspasosAlmacenes.refetch(
                {
                    input: fil
                }
            )
            
        }
        
        setAlmacenDestino(alm);
         setLoading(false);
    }
    const setEncargadoInput = ( enc) =>{
       try {
            let almDes = (almacenDestino !== null ) ? almacenDestino._id : '';
            let almOri = (almacenOrigen !== null ) ? almacenOrigen._id : '';
            let encId = ( enc!== '' ) ? enc._id : ''; 
            let fil ={...inputFilter, usuario: encId, almacen_destino:almDes,almacen_origen : almOri};
        
        traspasosAlmacenes.refetch(
                {
                    input: fil
                }
            )
         setEncargado(enc)  
          setLoading(false);  
       } catch (error) {
           
       }
        
    }

    if(traspasosAlmacenes.data){
       try {
           
            traspasos = traspasosAlmacenes.data.obtenerTraspasos;   
       } catch (error) {
           
       }
      
       
    }

    if(queryObtenerUsuarios.data){
        try {
             usuarios = queryObtenerUsuarios.data.obtenerUsuarios;
        } catch (error) {
            
        }
       
    }

    return (
        <>
            <Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/almacen.svg' 
                            alt="icono almacen" 
                            style={{width: 100}}
                        />
					</Box>
					Reportes Almacen
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Reportes Almacen
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
                <Grid container>
                    
                    <Grid item lg={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Fecha inicio:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fecha_inicio"
                                    variant="outlined"
                                    value={inputFilter.fecha_inicio}
                                    type="date"
                                    onChange={(e) => setDatosInput(e)}
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Fecha fin:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fecha_final"
                                    variant="outlined"
                                    type="date"
                                    onChange={(e) => setDatosInput(e)}
                                    value={inputFilter.fecha_final}
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>Encargado</Typography>
                                <Box display="flex">
                                    <Autocomplete
                                        id="encargado"
                                        size="small"
                                        options={usuarios}
                                       
                                        getOptionLabel={(option) =>
                                            option.nombre ? `${option.nombre}` : ""
                                        }
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                <Fragment>
                                                  
                                                    {params.InputProps.endAdornment}
                                                </Fragment>
                                                ),
                                            }}
                                            
                                            />
                                        )}
                                        renderOption={(option) => (
                                            <Fragment>
                                            {`${option.nombre}`}
                                            </Fragment>
                                        )}
                                        onChange={ (_, data) =>  setEncargadoInput(data)}
                                        getOptionSelected={(option, value) =>
                                            option.nombre === value.nombre
                                        }
             
                                        value={(encargado.nombre) ? encargado: null }
                                    />
                                </Box>
                            </Box>
                             <Box width="100%">
                                <Typography>Producto:</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="producto"
                                    variant="outlined"
                                    placeholder="Nombre, código, clave..."
                                    onChange={(e) => setDatosInput(e)}
                                    value={inputFilter.producto}
                                />
                            </Box>
                           
                            <Box width="100%">
                                <Typography>
                                    Almacen origen:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-almacen-origen"
                                        name="almacen_origen"
                                        onChange={(e) => setQueryAlmacenOrigen(e.target.value)}
                                        value={(almacenOrigen !== null) ? almacenOrigen : ''} 
                                    >   
                                       
                                        {almacenes.map((almacen) => (
                                            <MenuItem key={almacen._id} value={almacen} >
                                                {almacen.nombre_almacen}
                                            </MenuItem>
                                        ))}
                                      
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Almacen destino:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    
                                >
                                    <Select
                                        id="form-almacen-destino"
                                        name="almacen_destino"
                                        onChange={(e) => setQueryAlmacenDestino(e.target.value)}
                                        value={(almacenDestino !== null) ? almacenDestino: ''} 
                                    >
                                     
                                          {almacenes.map((almacen) => (
                                            <MenuItem key={almacen._id} value={almacen} >
                                            {almacen.nombre_almacen}
                                            </MenuItem>
                                        ))}
                                       
                                    </Select>
                                </FormControl>
                            </Box>
                           
                        </div>
                        <div className={classes.formInputFlex}>
                            <Box mt={1} display="flex">
                                <Button
                                color="primary"
                                startIcon={<ClearOutlined />}
                                onClick={() => limpiarFiltros()}
                                >
                                Limpiar filtros
                                </Button>
                                <Box mx={1} />
                                <ExportarTraspasos data= {traspasos} />
                            </Box>
                        </div>    
                    </Grid> 
                    {
                        (traspasosAlmacenes.loading || loading) ?
                        <div className={classes.CircularProgress}>
                        <CircularProgress/>
                        </div>
                        :
                        <Grid item lg={12}>
                         <TablaAlmacenFiltradas data={traspasos} />
                        </Grid>
                    }
                 
                    
                </Grid>            
			</Dialog> 
        </>
    )   
}
