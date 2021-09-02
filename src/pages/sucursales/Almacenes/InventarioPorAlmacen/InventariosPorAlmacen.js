import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Select,useTheme,FormControl,
Slide, Button, Box, Dialog,Input, TextField, Grid, InputLabel, MenuItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
// import { FcPlus } from 'react-icons/fc';
// import inventarioAlmacen from '../../../../icons/warehouse.svg';
import CloseIcon from '@material-ui/icons/Close';
import ListaProductos from './ListaProductos'
import { OBTENER_PRODUCTOS_ALMACEN } from '../../../../gql/Almacenes/Almacen';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	boxControl: {
        margin: theme.spacing(1),
        minWidth: 220,
        maxWidth: 220,
		
		
    },
    icon: {
		fontSize: 100
	},
	imagen: {
		width: 100
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
	const [ filtro, setFiltro ] = React.useState('');
	const [ tipo, setTipo ] = React.useState('');
	const [ categoria, setCategoria ] = React.useState('');
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let productos = [];
	let tipos = [];
	let categorias = [];
	
	/* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro
		}
	});	
	React.useEffect(
		() => {
			
			refetch();
			
		},
		[ refetch ]
	); 
	React.useEffect(() => {
		console.log('====================================');
		console.log(error);
		console.log('====================================');
	}, [error])
	if(data){
		productos = data.obtenerProductos;
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleChange = (event) => {
        setTipo(event.target.value);
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
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Almacenes
						</Typography>
						<Box mx={3}>
							<Box m={1}>
								<Button variant="contained" color="secondary" onClick={handleClose} size="large">
									<CloseIcon style={{ fontSize: 30}}/>
								</Button>
							</Box>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							
						</IconButton>
					</Toolbar>
				</AppBar>
				<Box mx={3} p={2}>
					<div className={classes.formInputFlex}>
					<Grid container direction="row">
						<Box width="20%">
							<Typography>Código de barras</Typography>
							<Box display="flex">
								<TextField
									fullWidthß
									size="small"
									/* error */
									name="codigo_barras"
									id="form-producto-codigo-barras"
									variant="outlined"
									/* helperText="Incorrect entry." */
								/>
								
							</Box>
						</Box>
						<Box width="20%">
							<Typography>Clave alterna</Typography>
							<Box display="flex">
								<TextField
									fullWidthß
									size="small"
									/* error */
									name="clave_alterna"
									id="form-producto-clave-alterna"
									variant="outlined"
									/* helperText="Incorrect entry." */
								/>
								
							</Box>
						</Box>
						<FormControl className={classes.boxControl} style={{marginTop:10}} mt={5}>
						
							<InputLabel id="tipo-label"  >Tipo</InputLabel>
							<Select
							labelId="tipo-label"
							id="tipo"
							value={tipo}
							onChange={handleChange}
							input={<Input />}
							MenuProps={MenuProps}
							>
							{tipos.map((almacen) => (
								<MenuItem key={almacen} value={almacen} style={getStyles(almacen, tipo, theme)}>
								{almacen}
								</MenuItem>
							))}
							</Select>
							
						</FormControl>
						<Box width="20%">
							<Typography>Nombre comercial</Typography>
							<Box display="flex">
								<TextField
									fullWidthß
									size="small"
									/* error */
									name="clave_alterna"
									id="form-producto-clave-alterna"
									variant="outlined"
									/* helperText="Incorrect entry." */
								/>
								
							</Box>
						</Box>
						<Box width="20%">
							<Typography>Nombre génerico</Typography>
							<Box display="flex">
								<TextField
									fullWidthß
									size="small"
									/* error */
									name="clave_alterna"
									id="form-producto-clave-alterna"
									variant="outlined"
									/* helperText="Incorrect entry." */
								/>
								
							</Box>
						</Box>
						<FormControl className={classes.boxControl} >
						
							<InputLabel id="categoria-label"  >Categoría</InputLabel>
							<Select
							labelId="categoria-label"
							id="categoria"
							value={categoria}
							onChange={handleChange}
							input={<Input />}
							MenuProps={MenuProps}
							>
							{categorias.map((cat) => (
								<MenuItem key={cat} value={cat} style={getStyles(cat, categoria, theme)}>
								{categoria}
								</MenuItem>
							))}
							</Select>
							
						</FormControl>
					</Grid>	
					</div>
					<Button  variant="contained" color="primary" style={{marginTop:10, width:"15%"}} >
						Buscar
					</Button>
				</Box>
				
				<Box mx={5}>
					<ListaProductos productos={productos} />
				</Box>
			</Dialog>
        </div>
    )
}
