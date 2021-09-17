import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Select,useTheme,FormControl,
Slide, Button, Box, Dialog,Input, TextField, Grid, InputLabel, MenuItem,CircularProgress, OutlinedInput, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
// import { FcPlus } from 'react-icons/fc';
// import inventarioAlmacen from '../../../../icons/warehouse.svg';
import {Close, Search} from '@material-ui/icons';
import ListaProductos from './ListaProductos'
import ErrorPage from '../../../../components/ErrorPage'
import { useDebounce } from 'use-debounce';
import { OBTENER_PRODUCTOS_ALMACEN, OBTENER_CATEGORIAS,OBTENER_ALMACENES } from '../../../../gql/Almacenes/Almacen';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	boxControl: {
        margin: theme.spacing(2.5),
		marginTop: 0,
        minWidth: "20%",
        maxWidth: "20%",
    },
    icon: {
		fontSize: 100
	},
	imagen: {
		width: 100
	},
	inputBox:{
		margin:20
	},
	button:{
		margin: theme.spacing(3),
	}
}));

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
function getStyles(tipo, tipoName, theme) {
  return {
    fontWeight:
      tipoName.indexOf(tipo) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function InventariosPorAlmacen() {
    const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(false);
	const [ loading, setLoading ] = React.useState(false);
	  
	const [ filtro, setFiltro ] = React.useState({  codigo_barras: '',clave_alterna: '',tipo_producto: '',nombre_comercial: '',
        nombre_generico: '',categoria: '',subcategoria: ''});
	const [ filtroTo, setFiltroTo ] = React.useState({});
	const [ tipo, setTipo ] = React.useState('');
	const [ almacen, setAlmacen ] = React.useState('');
	const [ categoria, setCategorias ] = React.useState('');
	const [ subcategoria, setSubcategoria ] = React.useState('');
	const [ subcategorias, setSubcategorias ] = React.useState([]);
	const [value] = useDebounce(filtro, 1000);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	let productos = [];
	let tipos = ['ROPA','CALZADO','OTROS'];
	let categorias = [];
	
	let obtenerAlmacenes = [];

	/* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro: value
		}
	});	

	const categoriasQuery = useQuery(OBTENER_CATEGORIAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,	
		}
	});
	
	const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES,{
		variables: {
			id: sesion.sucursal._id
		}
	});	
	React.useEffect(
		() => {

			setFiltroTo(value)
		},
		[ value ]
	);

	React.useEffect(
		() => {
		
			refetch();
		},
		[ filtroTo ]
	);
	React.useEffect(
		() => {
			queryObtenerAlmacenes.refetch();
		},
		[ queryObtenerAlmacenes.update, queryObtenerAlmacenes.refetch ]
	);

	React.useEffect(
		() => {
			setLoading(true);
			refetch();
			setLoading(false);
		},
		[ refetch ]
	);

	React.useEffect(
		() => {
			setLoading(true);
			categoriasQuery.refetch();
			setLoading(false);
		},
		[ categoriasQuery.refetch ]
	); 


	if(data){
		//console.log(data.obtenerProductosAlmacenes)
		productos = data.obtenerProductosAlmacenes;
	}
	if(categoriasQuery.data){
		categorias = categoriasQuery.data.obtenerCategorias;
	}
	
	if(queryObtenerAlmacenes.data){
		//console.log(queryObtenerAlmacenes.data.obtenerAlmacenes)
		obtenerAlmacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
	}
	
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	
	const setValToFilter = (label,value) => {
		try {
			if(label == 'categoria' && value != ''){
			
				const cat = categorias.find(element => element.categoria == value);
				setSubcategorias(cat.subcategorias)
				
			}

			setFiltro({...filtro, [label] : value});
		} catch (error) {
			console.log(error)
		}
    };

	if (loading)
	return (
		<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
			<CircularProgress />
		</Box>
	);


    return (
        <div>
            <Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src={'https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/conceptosAlmacen.svg'} alt="icono almacen" className={classes.imagen}/>
					</Box>
					Inventario por almacen
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Almacenes
						</Typography>
						<Box mx={3}>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClose} size="large">
									<Close style={{ fontSize: 30}}/>
								</Button>
							</Box>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							
						</IconButton>
					</Toolbar>
				</AppBar>
				<Grid container direction="row">
                        <Box width="20%" className={classes.inputBox} >
                            <Typography>Código de barras</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    /* error */
                                    name="codigo_barras"
                                    id="form-producto-codigo-barras"
                                    variant="outlined"
                                    /* helperText="Incorrect entry." */
                                    onChange={(e) =>  setValToFilter('codigo_barras', e.target.value)}
                                />
                            </Box>
                        </Box>
                        <Box width="20%" className={classes.inputBox} >
                            <Typography>Clave alterna</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    /* error */
                                    name="clave_alterna"
                                    id="form-producto-clave-alterna"
                                    variant="outlined"
                                    /* helperText="Incorrect entry." */
									onChange={(e) =>  setValToFilter('clave_alterna', e.target.value)}
                                />
                            </Box>
                        </Box>
                        
                        <Box width="20%" className={classes.inputBox} >
                            <Typography>Nombre comercial</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    /* error */
                                    name="clave_alterna"
                                    id="form-producto-clave-alterna"
                                    variant="outlined"
                                    /* helperText="Incorrect entry." */
									onChange={(e) =>  setValToFilter('nombre_comercial', e.target.value)}
                                />
                            </Box>
                        </Box>
                        <Box width="20%" className={classes.inputBox} >
                            <Typography>Nombre génerico</Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    /* error */
                                    name="nombre_generico"
                                    id="form-producto-nombre-generico"
                                    variant="outlined"
                                    /* helperText="Incorrect entry." */
									onChange={(e) =>  setValToFilter('nombre_generico', e.target.value)}
                                />
                            </Box>
                        </Box>
                        <FormControl className={classes.boxControl} >
                        
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
                            Buscar producto
                        </Button>
                    </Grid> 

				{
					(error || categoriasQuery.error) ?
						<ErrorPage error={error} />
					:
					<Box mx={5}>
						<ListaProductos productos={productos} obtenerAlmacenes={obtenerAlmacenes} />
					</Box>
					
				}
			</Dialog>
        </div>
    )
}
