import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Select,useTheme,FormControl,
Slide, Button, Box, Dialog,Input, TextField, Grid, InputLabel, MenuItem,CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import {Close} from '@material-ui/icons';
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



	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	
	

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
			<InventarioPorAlmacen open={open} handleClose={handleClose} />
        </div>
    )
}

const InventarioPorAlmacen = (props) =>{
	const classes = useStyles();
	const theme = useTheme();
	const [ loading, setLoading ] = React.useState(true);
	  
	const [ filtro, setFiltro ] = React.useState({  codigo_barras: '',clave_alterna: '',tipo_producto: '',nombre_comercial: '',
        nombre_generico: '',categoria: '',subcategoria: ''});
		
	const [ filtroTo, setFiltroTo ] = React.useState({});

	// const [ almacen, setAlmacen ] = React.useState('');
	const [ categoria ] = React.useState('');
	const [ subcategoria ] = React.useState('');
	const [ categoriaTo, setCategoriaTo ] = React.useState('');
	const [ subcategoriaTo, setSubCategoriaTo ] = React.useState('');
	const [ subcategorias, setSubcategorias ] = React.useState([]);
	const [value] = useDebounce(filtro, 1000);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	let productos = [];
	// let tipos = ['ROPA','CALZADO','OTROS'];
	let categorias = [];
	
	let obtenerAlmacenes = [];
	 	/* Queries */
	//const {  data, error, refetch } = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
    const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
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
		
			productosAlmacenQuery.refetch();
		},
		[ filtroTo ]
	);
	React.useEffect(
		() => {
			queryObtenerAlmacenes.refetch();
		},
		[ queryObtenerAlmacenes.update, queryObtenerAlmacenes ]
	);

	React.useEffect(
		() => {
		
			productosAlmacenQuery.refetch();
			setLoading(false);
		},
		[ ]
	);
	React.useEffect(
		() => {
		console.log(productosAlmacenQuery.error)
		},
		[ productosAlmacenQuery.error]
	);
	React.useEffect(
		() => {
		
			categoriasQuery.refetch();
			
		},
		[ categoriasQuery.refetch ]
	); 


	if(productosAlmacenQuery.data){
		console.log('PRODUCTOS ALMACEN',productosAlmacenQuery.data )
		productos = productosAlmacenQuery.data.obtenerProductosAlmacenes;
	}
	if(categoriasQuery.data){
		categorias = categoriasQuery.data.obtenerCategorias;
	}
	
	if(queryObtenerAlmacenes.data){
		obtenerAlmacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
	}
	
	 const setValToFilter = (label,value) => {
		try {
			setLoading(true);
		
			if(label === 'categoria' && value !== ''){
				const cat = categorias.find(element => element.categoria === value);
				setSubcategorias(cat.subcategorias)
			}

			if(label === 'categoria' ){
				
				let fil = {...filtro, subcategoria : subcategoriaTo, categoria:value}
			
				productosAlmacenQuery.refetch(
					{
						filtro: fil
					}
				)
				setCategoriaTo((value !== '') ? value : '')
				setSubCategoriaTo('');
			} 
			if(label === 'subcategoria'&& value !== '' ){
			
				productosAlmacenQuery.refetch(
					{
						filtro: {...filtro, subcategoria : value, categoria:categoriaTo}
					}
				)
				setSubCategoriaTo((value !== '') ? value : '')
			}
			if(label !== 'categoria' && label !== 'subcategoria' ){
				setFiltro({...filtro, [label] : value, subcategoria : subcategoriaTo, categoria:categoriaTo});
			}
			//setLoading(false)	
		} catch (error) {
			
		}
    };
	return(
		<Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Almacenes
						</Typography>
						<Box mx={3}>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={props.handleClose} size="large">
									<Close style={{ fontSize: 30}}/>
								</Button>
							</Box>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
							
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
                            value={categoriaTo}
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
                            value={subcategoriaTo}
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
                    
                      {/*   <Button  variant="contained" color="primary" className={classes.button} style={{width:"20%"}} >
                            Buscar producto
                        </Button> */}
                    </Grid> 

				{
					(loading) ?
		
					<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
						<CircularProgress />
					</Box>
					: 
						(productosAlmacenQuery.error || categoriasQuery.error) ?
							<ErrorPage error={productosAlmacenQuery.error} />
						:
						<Box mx={5}>
							<ListaProductos productos={productos} obtenerAlmacenes={obtenerAlmacenes} />
						</Box>
					
				}
			</Dialog>
	)
}
