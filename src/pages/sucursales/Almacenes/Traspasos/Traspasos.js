import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide,
         Button, Box, Dialog, Grid, DialogActions, CircularProgress, TextField,Divider,
         InputLabel, Select, Input, MenuItem, FormControl, useTheme } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { FcAdvance } from 'react-icons/fc';
import almacenIcon from '../../../../icons/almacen.svg';
import TableSelectProducts from '../../../../components/Traspasos/TableSelectProducts';

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
        height: 120,
    },
    formControl: {
        margin: theme.spacing(1),
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
const almacenes = [
    'Almacén 1',
    'Almacén 2'
];

const transportes = [
    'Barco',
    'Moto',
    'Carro',
    'Camioneta'
];
function createData(name, cantidad, precio) {
    return { name, cantidad, precio };
    }
const data = [
    createData('Mermelada', 200, 25.50),
    createData('Cacahuates', 452, 25.0),
    createData('Galletas', 262, 16.0),
    createData('Salsa de chipotle', 452, 25.0),
    createData('Perro negro', 262, 16.0),
    createData('Kakacafé', 200, 25.50),
    createData('Pitayas', 452, 25.0),
    createData('Leche', 262, 16.0),
    createData('Salsa de habanero', 452, 25.0),
    createData('Perro blanco', 262, 16.0),
];
export default function Traspasos() {
    const classes = useStyles();
    const theme = useTheme();
	const [ open, setOpen ] = React.useState(false);
    const [ loading, setLoading ] = React.useState(false);
    const [ almacenOrigen, setAlmacenOrigen ] = React.useState('');
    const [ almacenDestino, setAlmacenDestino ] = React.useState('');
    const [ transporte, setTransporte ] = React.useState('');
    const [ placas, setPlacas ] = React.useState('');
    const [ nombreQuien, setNombreQuien ] = React.useState('');
    const [ productos, setProductos ] = React.useState([]);
    const [ productosTras, setProductosTras ] = React.useState([]);

    
    React.useEffect(() => {
        
        setProductos(data);
    }, [productos]);
    React.useEffect(() => {
        
        console.log(productosTras);
    }, [productosTras]);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

     const handleChange = (event) => {
        setAlmacenOrigen(event.target.value);
    };
    const handleChangeDestino = (event) => {
        setAlmacenDestino(event.target.value);
    };
      const handleChangeTransporte = (event) => {
        setTransporte(event.target.value);
    };
    return (
        <div>
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
                
                    <Box  className={{width:50}}>    
                  
                    <Grid >
                    <Box  flexDirection="row" className={classes.boxUpData}>
                        <Grid container>
                            
                                <Box mt={2} className={classes.selected} >
                                    <Typography className={classes.subtitle}>
                                        <b>Datos traspaso</b>
                                    </Typography>
                                    <Divider />
                                <Grid container  justifyContent="space-evenly">
                                    <FormControl className={classes.formControl}>
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
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="almacen-destino-label">Concepto traspaso</InputLabel>
                                        <Select
                                        labelId="almacen-destino-label"
                                        id="almacen-destino-name"
                                        value={almacenDestino}
                                        onChange={handleChangeDestino}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        >
                                        {almacenes.map((almacen) => (
                                            <MenuItem key={almacen} value={almacen} style={getStyles(almacen, almacenOrigen, theme)}>
                                            {almacen}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="almacen-origen-label">Almacén origen</InputLabel>
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
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="almacen-destino-label">Almacén destino</InputLabel>
                                        <Select
                                        labelId="almacen-destino-label"
                                        id="almacen-destino-name"
                                        value={almacenDestino}
                                        onChange={handleChangeDestino}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        >
                                        {almacenes.map((almacen) => (
                                            <MenuItem key={almacen} value={almacen} style={getStyles(almacen, almacenOrigen, theme)}>
                                            {almacen}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                </Box>
                           
                           
                                <Box mt={2} className={classes.selected} >
                                    <Typography className={classes.subtitle}>
                                        <b>Datos transporte traspaso</b>
                                    </Typography>
                                    <Divider />
                                    <Grid container  justifyContent="space-evenly">
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
                                            <Box width="300px">
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
                                            <Box width="300px"  ml={1}>
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
                    </Box>
                    
                    <Box ml={2} mt={8} justifyContent="center">
                        <Grid container>
                            <TableSelectProducts title='Productos' add={true} data={productos} productosTras={productosTras} setProductosTras={setProductosTras} />
                            <TableSelectProducts title='Productos a traspasar' add={false} data={productosTras}  />
                        </Grid>
                    </Box>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancelar
                            </Button>
                            <Button
                                onClick={()=>console.log('')}
                                color="primary"
                                variant="contained"
                                autoFocus
                                endIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
                            >
                                Traspasar
                            </Button>
                        </DialogActions>
                    </Grid>
                </Box>     
			
			</Dialog>
        </div>
    )
}
