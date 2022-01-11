import React, { forwardRef, useEffect, useContext, useState,useCallback } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide,
         Button, Box, Dialog, Grid, DialogActions, TextField,Divider,
         InputLabel, Select, Input, MenuItem, FormControl, useTheme, OutlinedInput, InputAdornment,
         Stepper, Step, StepLabel, DialogTitle } from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import ErrorPage from '../../../../components/ErrorPage';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { FcAdvance } from 'react-icons/fc';
import almacenIcon from '../../../../icons/almacen.svg';
import TableSelectProducts from '../../../../components/Traspasos/TableSelectProducts';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CONCEPTOS_ALMACEN} from '../../../../gql/Catalogos/conceptosAlmacen';
import { OBTENER_ALMACENES, REALIZAR_TRASPASO, OBTENER_CATEGORIAS, OBTENER_PRODUCTOS_EMPRESA} from '../../../../gql/Almacenes/Almacen';

import { OBTENER_PRODUCTOS } from "../../../../gql/Catalogos/productos";


import { TraspasosAlmacenContext } from "../../../../context/Almacenes/traspasosAlmacen";

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		fontSize: 50
	},
    imagen: {
        width: 50
    },
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& span': {
			color: 'red'
		}
	},
    subtitle: {
		marginLeft: '10px',
		width:'100%'
	},
    boxUpData:{
        height: 80,

    },
    formControl: {
        margin: theme.spacing(4),
        minWidth: 300,
        maxWidth: 300,
    },
    selected2:{
		width: '50%',
		height: 50,
		
    },
    selected:{
		width: '50%',
		height: 50,
		
    },
    input:{
		width:'100%'	
	},
    inputBox:{
		margin:20,
        marginTop:5,
        marginBottom:10
	},
    button:{
		margin: theme.spacing(3),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0)
	},
    boxControl: {
        margin: theme.spacing(2.5),
		marginTop: 0,
        minWidth: "14%",
        maxWidth: "14%",
        minHeight: 20,
        maxHeight: 20
    },
}));


function getStyles(almacen, almacenName, theme) {
  return {
    fontWeight:
      almacenName.indexOf(almacen) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};


const transportes = [
    'Barco',
    'Moto',
    'Carro',
    'Camioneta'
];

function createData(name, cantidad, precio, unidad) {
    return { name, cantidad, precio, unidad };
    } 


const steps = ['Datos traspaso', 'Seleccionar productos'];

export default function Traspasos() {
    const classes = useStyles();
    const theme = useTheme();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const {
        setProductos,
        productos,
        setProductosTras,
        setProductosTo,
        setProductosEmpTo,
     
        productosTo,
        productosTras
    } = useContext(TraspasosAlmacenContext);
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [ open, setOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ busqueda, setBusqueda ] = useState('');

    const [ filtro, setFiltro ] = useState({  codigo_barras: '',clave_alterna: '',tipo_producto: '',nombre_comercial: '',
        nombre_generico: '',categoria: '',subcategoria: ''});
	
    const [ filtroTo, setFiltroTo ] = useState({});
    const [ categoria ] = useState('');
	const [ subcategoria ] = useState('');
	const [ subcategorias, setSubcategorias ] = useState([]);
    
    const [ haveConcepto, setHaveConcepto ] = useState(false);
    const [ conceptoTraspaso, setConceptoTraspaso ] = useState(null);
    const [ isAlmacenOrigen, setIsAlmacenOrigen ] = useState(false);
    const [ isAlmacenDestino, setIsAlmacenDestino ] = useState(false);

    const [ almacenOrigen, setAlmacenOrigen ] = useState(null);
    const [ almacenDestino, setAlmacenDestino ] = useState(null);
    const [almacenesDestino, setAlmacenesDestino] =useState([])
    const [ transporte, setTransporte ] = useState('');
    const [ placas, setPlacas ] = useState('');
    const [ nombreQuien, setNombreQuien ] = useState('');
  
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [openEnd, setOpenEnd] = useState(false);
 
    const [ CrearTraspaso ] = useMutation(REALIZAR_TRASPASO); 

    let conceptos= [];
    let categorias = [];
   
    let almacenes = [];
 
    const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES,{
        variables: {
            id: sesion.sucursal._id
        },
         fetchPolicy: "network-only"
    });	

	const dataConceptos = useQuery(OBTENER_CONCEPTOS_ALMACEN,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		},
         fetchPolicy: "network-only"
	});
   
    const categoriasQuery = useQuery(OBTENER_CATEGORIAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,	
		},
        fetchPolicy: "network-only"
	});

    const productosQuery = useQuery(
    OBTENER_PRODUCTOS,
    {
      variables: { 
          empresa: sesion.empresa._id, 
          sucursal: sesion.sucursal._id,
          almacen: (almacenOrigen ) ? almacenOrigen._id : "",
          existencias: true
      },
      fetchPolicy: "network-only"

    }
  );

    const productosEmpresaQuery = useQuery(
    OBTENER_PRODUCTOS_EMPRESA,
    {
      variables: { 
          empresa: sesion.empresa._id 
      },
      fetchPolicy: "network-only"

    }
  );
    
    const obtenerAlmacenes= () =>{
        try {
            setAlmacenesDestino(queryObtenerAlmacenes.data.obtenerAlmacenes.filter(element => element._id !== almacenOrigen._id));
        } catch (error) {
           console.log(error)
        }   
    };

    useEffect(() => {
        if(almacenOrigen){
            obtenerAlmacenes();
            obtenerProductosAlmacen();
        }
    }, [almacenOrigen ])


    const obtenerProductosEmpresa = useCallback(async() =>{
        try {
            productosEmpresaQuery.refetch();
        } catch (error) {
            
        }   
    },[productosEmpresaQuery]);

    const obtenerProductosAlmacen = useCallback(async() =>{
        try {
           productosQuery.refetch();
        } catch (error) {
            
        }   
    },[productosQuery]);

    useEffect(() => {
        if(conceptoTraspaso!== null){
            if(conceptoTraspaso.origen === 'N/A'){
                obtenerProductosEmpresa();
            } else{
                obtenerProductosAlmacen();
            }      
        }
    }, [conceptoTraspaso])    

 /*    useEffect(() => {
			dataConceptos.refetch();
	},[ dataConceptos ]);  */

     useEffect(() => {
        if(conceptoTraspaso !== null){
            if(conceptoTraspaso.destino === 'N/A'){
                if(almacenOrigen !== null){
                    setHaveConcepto(true)
                }else{
                     setHaveConcepto(false)
                }
            
            }else{
                if(conceptoTraspaso.origen === 'N/A'){
                    if(almacenDestino !== null){
                        setHaveConcepto(true);
                    }else{
                        setHaveConcepto(false);
                    } 
                }else{
                    if(almacenOrigen !== null && almacenDestino !== null){
                        setHaveConcepto(true);
                    }else{
                        setHaveConcepto(false);
                    } 
                }
                
            }    
        }
       
	},[ conceptoTraspaso, almacenOrigen, almacenDestino, setHaveConcepto ]); 

    

     
    useEffect(
		() => {
			 if(productosEmpresaQuery.data){
             
                //setProductos(productosEmpresaQuery.data.obtenerProductosPorEmpresa);
                //console.log(productosEmpresaQuery.data)
                setProductosEmpTo(productosEmpresaQuery.data.obtenerProductosPorEmpresa);
            }
    },[ productosEmpresaQuery.data, setProductosEmpTo ]);  


     useEffect(
		() => {
		     if(productosQuery.data){
               
                setProductos(productosQuery.data.obtenerProductos);
                setProductosTo(productosQuery.data.obtenerProductos)
         
                return;
            }
            
		},
		[ productosQuery, setProductos, setProductosTo ]
	); 
    
    useEffect(
		() => {
			setLoading(true);
			categoriasQuery.refetch();
			setLoading(false);
		},
		[ categoriasQuery ]
	); 
  

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

     const handleChange = (event) => {
        
        setAlmacenOrigen(event.target.value);
       /*  productosQuery.refetch({
            variables: { 
            
                almacen: event.target.value._id,
                existencias: true
            },
        }); */


        setProductosTras([]);
        return;
    };

    const handleChangeDestino = (event) => {
        //console.log(event)
        setAlmacenDestino(event.target.value);
        setProductosTras([]);
    };

     const handleChangeConcepto = (event) => {
        try {
            
            let concepto = event.target.value;  
            setAlmacenesDestino([]);
            almacenes = [];
            setAlmacenOrigen(null); 
            setAlmacenDestino(null);
            if(concepto.origen === 'N/A'){
               
                
                setAlmacenesDestino( queryObtenerAlmacenes.data.obtenerAlmacenes)
            }else{
                  setAlmacenesDestino([])
            }
          
            setIsAlmacenOrigen((concepto.origen === 'N/A') ? false:true);
            setIsAlmacenDestino((concepto.destino === 'N/A') ? false:true);
           
            setConceptoTraspaso(concepto);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    
      const handleChangeTransporte = (event) => {
        setTransporte(event.target.value);
    };

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        /* if(conceptoTraspaso === null ) {setAlert({message:'No es posible continuar sin seleccionar un concepto.', status: 'error', open: true });  return}
        if( isAlmacenOrigen && almacenOrigen === null)  {setAlert({message:'No es posible continuar sin seleccionar un almacén origen.', status: 'error', open: true });  return }   
        if(isAlmacenDestino && almacenDestino === null) { setAlert({message:'No es posible continuar sin seleccionar un almacén destino.', status: 'error', open: true }); return}    */
        
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        
    };

    const handleBack = () => {
        
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const setValToFilter = (label,value) => {
		try {
			if(label === 'categoria' && value !== ''){
				const cat = categorias.find(element => element.categoria === value);
				setSubcategorias(cat.subcategorias)
			}
			setFiltro({...filtro, [label] : value});
		} catch (error) {
			
		}
    };

    if(categoriasQuery.data){
		categorias = categoriasQuery.data.obtenerCategorias;
	}
   
    if(dataConceptos.data){
		conceptos = dataConceptos.data.obtenerConceptosAlmacen;
	}

    if(queryObtenerAlmacenes.data){
        almacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
       
    }

    const obtenerSelectsProducto = (producto) => {
        if(producto !== null){
            setProductosTo([producto])
        }else{
            setProductosTo(productos) 
        }
    };


    const handleModal = () => {
        setOpenEnd(!openEnd)
    }

    const traspasar = async () => {
        try {
          
            if(productosTras.length){
               setOpenEnd(false)
               setLoading(true)
                //let productTrasTo = productosTras;
             const input =  {
                variables: {
                    input: {
                        concepto_traspaso: {
                            _id: conceptoTraspaso._id, 
                            nombre_concepto: conceptoTraspaso.nombre_concepto,
                            destino: conceptoTraspaso.destino,
                            origen: conceptoTraspaso.origen,
                            editable: conceptoTraspaso.editable,
                        },
                        almacen_origen: (almacenOrigen !== null) ? almacenOrigen._id : '',
                        almacen_destino: (almacenDestino !== null) ? almacenDestino._id : '',
                        productos: productosTras,
                        datos_transporte :{
                            transporte: transporte,
                            placas: placas,
                            nombre_encargado: nombreQuien
                        },
                        sucursalOrigen: sesion.sucursal._id,
                        sucursalDestino: sesion.sucursal._id,
                        fecha_registro: moment().locale("es-mx").format()
                    },
                    usuario: sesion._id,
                    empresa: sesion.empresa._id
                }
            }  
             
             const traspaso =    await CrearTraspaso(input) 
           
                //console.log(traspaso)
                setAlert({message: traspaso.data.crearTraspaso.message, status: traspaso.data.crearTraspaso.resp, open: true })
                if(traspaso.data.crearTraspaso.resp !== 'error'){
                    setProductosTras([]);
                    setAlmacenOrigen(null);
                    setAlmacenDestino(null);
                    setConceptoTraspaso(null);
                    handleBack();
                }
                
            }else{
                
                setAlert({message:'No es posible realizar un traspaso sin agregar productos.', status: 'error', open: true })
           
            }
            
           
           
            setLoading(false);
        } catch (error) {
             setLoading(false);
             setOpenEnd(false)
           if(error.networkError !== undefined){
			  console.log('traspaso networkError', error.networkError)
            }else if(error.graphQLErrors!== undefined){
                console.log('traspaso graphQLErrors', error.graphQLErrors)
            }else{
             
              
            }
             setAlert({message: 'Ocurrió un error al realizar el traspaso...', status: 'error', open: true })
        }
    }

   

    return (
        <Box sx={{ width: '100%' }}>
        
            <Button fullWidth onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <FcAdvance className={classes.icon} />
					</Box>
                    <Grid container spacing={10} justify="center" >
                        <Grid item lg={2} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <img src={almacenIcon} alt="icono almacen" className={classes.imagen}/>
                                    </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={2} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Box display="flex" flexDirection="column">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <img src={almacenIcon} alt="icono almacen" className={classes.imagen} />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    Traspasos
                </Box>
					
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <BackdropComponent loading={loading} setLoading={setLoading} />
                <AppBar className={classes.appBar}>
               
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Traspasos
						</Typography>
						<Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							
						</IconButton>
					</Toolbar>
				</AppBar>
                <Box style={{ width: '50%',alignSelf:'center' }}>
                  
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                    
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                </Box>
                
                <Box style={{ width: '98%',alignSelf:'center', alignContent:'center' }}>
                    
                    {
                        (activeStep === 0) ? 
                            <Grid container>
                                <Box style={{width:'100%'}} >
                                    <Typography className={classes.subtitle}  >
                                        <b>Datos traspaso</b>
                                    </Typography>
                                    <Divider />
                                    <Grid container  justifyContent="space-evenly" >
                                        {/* <FormControl className={classes.formControl}>
                                            <InputLabel id="almacen-origen-label">Unidad de traspaso</InputLabel>
                                            <Select
                                            labelId="almacen-origen-label"
                                            id="almacen-origen-name"
                                            value={almacenOrigen}
                                            onChange={handleChange}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            >
                                            {almacenes.map((almacen) => (
                                                <MenuItem key={almacen} value={almacen} style={getStyles(almacen, almacenOrigen, theme)}>
                                                {almacen}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl> */}
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="concepto-label">Concepto traspaso</InputLabel>
                                            <Select
                                            labelId="concepto-label"
                                            id="concepto-name"
                                            value={(conceptoTraspaso) ? conceptoTraspaso : ""}
                                            onChange={handleChangeConcepto}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            >
                                            {conceptos.map((concepto) => {
                                             
                                                return(
                                                <MenuItem key={concepto._id} value={concepto} >
                                                    {concepto.nombre_concepto}
                                                </MenuItem>
                                                )})
                                            }
                                            </Select>
                                        </FormControl>
                                        {
                                        (conceptoTraspaso !== null) ? 
                                        <div>
                                        {   
                                         
                                            (isAlmacenOrigen) ? 
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="almacen-origen-label">Almacén origen</InputLabel>
                                                    <Select
                                                    labelId="almacen-origen-label"
                                                    id="almacen-origen-name"
                                                    value={(almacenOrigen) ? almacenOrigen : ""}
                                                    onChange={handleChange}
                                                    input={<Input />}
                                                    MenuProps={MenuProps}
                                                    >
                                                    {almacenes.map((almacen) => (
                                                        <MenuItem key={almacen._id} value={almacen}>
                                                            {almacen.nombre_almacen}
                                                        </MenuItem>
                                                    ))}
                                                    </Select>
                                                </FormControl>
                                            :
                                            <div/>
                                        }
                                        
                                          {
                                            (isAlmacenDestino) ? 
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="almacen-destino-label">Almacén destino</InputLabel>
                                                <Select
                                                labelId="almacen-destino-label"
                                                id="almacen-destino-name"
                                                value={(almacenDestino) ? almacenDestino : ""}

                                                onChange={handleChangeDestino}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                                >
                                                {almacenesDestino.map((almacen) => (
                                                    <MenuItem key={almacen._id} value={almacen} >
                                                    {almacen.nombre_almacen}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                            :
                                            <div/>
                                        }
                                    </div>    
                                    :
                                    <div/>
                                    }    
                                    </Grid>
                                </Box>
                                <Box style={{width:'100%'}} mt={5} mb={5} >
                                    <Typography className={classes.subtitle}>
                                        <b>Datos transporte traspaso</b>
                                    </Typography>
                                    <Divider />
                                    <Grid container >
                                        <FormControl className={classes.formControl}>
                                            
                                                <InputLabel id="transporte-label">Transporte</InputLabel>
                                                <Select
                                                labelId="transporte-label"
                                                id="transporte-name"
                                                value={transporte}
                                                onChange={handleChangeTransporte}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                                >
                                                {transportes.map((trans) => (
                                                    <MenuItem key={trans} value={trans} style={getStyles(trans, transporte, theme)}>
                                                    {trans}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            
                                        </FormControl>
                                        <FormControl>
                                            <Box width="300px" ml={4} mt={2}>
                                                <Typography>
                                                    Placas
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    className={classes.input}
                                                    type="text"
                                                    size="small"
                                                    name="placas"
                                                    variant="outlined"
                                                    value={placas}
                                                    
                                                    onChange={(e) => setPlacas(e.target.value)}
                                                />
                                            </Box>
                                            </FormControl>
                                            <Box width="300px"  ml={7} mt={2}>
                                                <Typography>
                                                    Nombre de encargado de transporte
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    className={classes.input}
                                                    type="text"
                                                    size="small"
                                                    name="nombreQuien"
                                                    variant="outlined"
                                                    value={nombreQuien}
                                                    
                                                    onChange={(e) => setNombreQuien(e.target.value)}
                                                />
                                            </Box>
                                    </Grid>
                                </Box>
                               
                            </Grid>
                        :
                         
                        <Box>
                       
                            
                            <Box style={{width:'100%'}} ml={1} >
                                 
                               
                                <Typography className={classes.subtitle}>
                                    <b>Buscar producto</b>
                                </Typography>
                                <Grid  container direction="row" >
                                    <Grid item className={classes.inputBox}>
                                        <Typography>Código de barras</Typography>
                                        <Box width={200}>
                                            <Autocomplete
                                            id="combo-box-producto-codigo"
                                            size="small"
                                            fullWidth
                                            options={productos}
                                            getOptionLabel={(option) =>
                                                option.datos_generales.codigo_barras
                                                ? option.datos_generales.codigo_barras
                                                : "N/A"
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" />
                                            )}
                                            onChange={(_, value) => obtenerSelectsProducto(value)}
                                            getOptionSelected={(option) =>
                                                option.datos_generales.codigo_barras
                                            }

                                         
                                            />
                                        </Box>    
                                    </Grid>
                               
                                    <Grid item className={classes.inputBox}>
                                        <Typography>Clave alterna</Typography>
                                        <Box width={200}>
                                            <Autocomplete
                                            id="combo-box-producto-clave"
                                            size="small"
                                            fullWidth
                                            options={productos}
                                            getOptionLabel={(option) =>
                                                option.datos_generales.clave_alterna
                                                ? option.datos_generales.clave_alterna
                                                : "N/A"
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" />
                                            )}
                                            onChange={(_, value) => obtenerSelectsProducto(value)}
                                            getOptionSelected={(option) =>
                                                option.datos_generales.clave_alterna
                                            }
                                            />
                                        </Box>    
                                    </Grid>

                                    <Grid item className={classes.inputBox}>
                                        <Typography>Nombre comercial</Typography>
                                        <Box width={200}>
                                            <Autocomplete
                                            id="combo-box-producto-nombre-comercial"
                                            size="small"
                                            fullWidth
                                            options={productos}
                                            getOptionLabel={(option) =>
                                                option.datos_generales.nombre_comercial
                                                ? option.datos_generales.nombre_comercial
                                                : "N/A"
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" />
                                            )}
                                            onChange={(_, value) => obtenerSelectsProducto(value)}
                                            getOptionSelected={(option) =>
                                                option.datos_generales.nombre_comercial
                                            }
                                            />
                                        </Box>    
                                    </Grid>
                                    <Grid item className={classes.inputBox}>
                                        <Typography>Nombre génerico</Typography>
                                        <Box width={200}>
                                            <Autocomplete
                                            id="combo-box-producto-nombre-generico"
                                            size="small"
                                            fullWidth
                                            options={productos}
                                            getOptionLabel={(option) =>
                                                option.datos_generales.nombre_generico
                                                ? option.datos_generales.nombre_generico
                                                : "N/A"
                                            }
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" />
                                            )}
                                            onChange={(_, value) => obtenerSelectsProducto(value)}
                                            getOptionSelected={(option) =>
                                                option.datos_generales.nombre_generico
                                            }
                                            />
                                        </Box>    
                                    </Grid>
{/*                                     <FormControl className={classes.boxControl} >
                                    
                                        <InputLabel id="tipo-label"  >Tipo</InputLabel>
                                        <Select
                                        labelId="tipo-label"
                                        id="tipo_producto"
                                        value={filtro.tipo_producto}
                                        onChange={(e) => setValToFilter('tipo_producto', e.target.value )}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        >
                                            <MenuItem value="">
                                                <em>Selecciona uno</em>
                                            </MenuItem>
                                            <MenuItem value="ROPA">Ropa</MenuItem>
                                            <MenuItem value="CALZADO">Calzado</MenuItem>
                                            <MenuItem value="OTROS">Otros</MenuItem>
                                        </Select>
                                        
                                    </FormControl>
                                    <FormControl className={classes.boxControl} >
                                    
                                        <InputLabel id="categoria-label"  >Categoría</InputLabel>
                                        <Select
                                        labelId="categoria-label"
                                        id="categoria"
                                        value={filtro.categoria}
                                        onChange={(e) => setValToFilter('categoria', e.target.value )}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        >
                                        <MenuItem value="">
                                            <em>Selecciona una</em>
                                        </MenuItem>
                                        {categorias.map((cat) => (
                                            <MenuItem key={cat._id} value={cat.categoria}  style={getStyles(cat._id, categoria, theme)}>
                                            {cat.categoria}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                        
                                    </FormControl>
                                    <FormControl className={classes.boxControl} >
                                    
                                        <InputLabel id="subcategoria-label"  >Subcategoría</InputLabel>
                                        <Select
                                        labelId="subcategoria-label"
                                        id="subcategoria"
                                        value={filtro.subcategoria}
                                        onChange={(e) => setValToFilter('subcategoria', e.target.value )}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        >
                                        <MenuItem value="">
                                                <em>Selecciona una</em>
                                            </MenuItem>
                                        {subcategorias.map((subcat) => (
                                            <MenuItem key={subcat._id} value={subcat.subcategoria} style={getStyles(subcat._id, subcategoria, theme)}>
                                            {subcat.subcategoria}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                        
                                    </FormControl>
                                
                                    <Button  variant="contained" color="primary" className={classes.button} style={{width:"20%"}} >
                                        Buscar 
                                    </Button> */}
                                </Grid> 
                          
                                <Box  mt={2}>
                                    <Grid container spacing={2} style={{width:'100%'}}>
                                         <Grid item md={6}>
                                        {
                                            (isAlmacenOrigen) ? 
                                           
                                            <TableSelectProducts title='Productos' add={true} almacenOrigen={almacenOrigen} />
                                            :
                                             <TableSelectProducts title='Productos' add={true} almacenOrigen={null} />   
                                        }
                                        </Grid>
                                        <Grid item md={6}>
                                            <TableSelectProducts title='Productos a traspasar' add={false} almacenOrigen={almacenOrigen}  />
                                        </Grid>
                                    </Grid>
                                </Box>
                                     
                            
                            </Box>
                          
                    </Box>
                    }




                        <Box style={{ display: 'flex', flexDirection: 'row', pt: 2 }} >
                            <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            >
                            Atrás
                            </Button>
                            <Box style={{ flex: '1 1 auto' }} />
                            {/*     {isStepOptional(activeStep) && (
                                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    Skip
                                </Button>
                                )} */}
                            
                                <Button disabled={!haveConcepto} onClick={() => (activeStep < steps.length -1) ? handleNext() : handleModal()}>
                                    {activeStep < steps.length -1   ? 'Siguiente' : 'Terminar'}
                                </Button>
                        
                        </Box>
                  
                </Box>
                
                <Dialog open={openEnd} onClose={handleModal}>
                    <DialogTitle>{'¿Está seguro de realizar este traspaso?'}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => handleModal()} color="primary">
                            Cancelar
                        </Button>
                        <Button color="secondary" autoFocus variant="contained" onClick={() => traspasar()}>
                            Traspasar
                        </Button>
                    </DialogActions>
                </Dialog>
               
	        <SnackBarMessages alert={alert} setAlert={setAlert} />  
            
			</Dialog>
            
               
        </Box>
    )
}