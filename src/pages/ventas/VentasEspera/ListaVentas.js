import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { VentasContext } from '../../../context/Ventas/ventasContext';
import { AccesosContext } from '../../../context/Accesos/accesosCtx';
import { useEffect } from 'react';

const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 20, align: 'center' },
	{ id: 'fecha', label: 'Fecha', minWidth: 20, align: 'center' },
	{ id: 'cliente', label: 'Cliente', minWidth: 330, align: 'center' },
	{ id: 'productos', label: 'Productos', minWidth: 20, align: 'center' },
	{ id: 'total', label: 'Total', minWidth: 200, align: 'center'},
];

const useStyles = makeStyles({
	root: {
		width: "100%"
	},
	container: {
		height: "45vh",
    	'& ::-webkit-scrollbar': {
      		display: 'none'
    	}
	}
});

export default function ListaVentas() {

	const classes = useStyles();

	let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));

	return (
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
								Regresar
							</TableCell>
							
							<TableCell align='center' style={{ width: 35 }}>
								Eliminar
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{listaEnEspera?.map((row, index) => {
							return (
								<RowsVentas venta={row} index={index} /> 
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};


const RowsVentas = ({ venta, index }) => {

	const { 
		reloadEliminarVentaEspera, 
        setReloadEliminarVentaEspera,
		setAbrirPanelAcceso,
        abrirPanelAcceso,
		setDepartamentos
	} = useContext(AccesosContext);
	
    const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
	const [ open, setOpen] = useState(false);
	const [ keyIndex, setKeyIndex ] = useState('');
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

	let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));
	let VentaEnEspera = JSON.parse(localStorage.getItem("DatosVentas"));

	function borrarVenta(key) {
		if(sesion.accesos.ventas.eliminar_ventas.ver === true){
			listaEnEspera.forEach(function(elemento, indice, array) {
				if(key === indice){
					listaEnEspera.splice(key, 1);
				}
			});
			setUpdateTablaVentas(!updateTablaVentas);
			localStorage.setItem("ListaEnEspera", JSON.stringify(listaEnEspera));
		}else{
			return null
		}
    };

	const AgregarVentaDeNuevo = (key) => {
		if(VentaEnEspera === null){
			listaEnEspera.forEach((element, index) => {
				if (index === key) {
					localStorage.setItem("DatosVentas", JSON.stringify(element.VentaEnEspera));
					listaEnEspera.splice(key, 1);
				}
			localStorage.setItem("ListaEnEspera", JSON.stringify(listaEnEspera));
			});
			setUpdateTablaVentas(!updateTablaVentas);
		}else{
			setOpen(!open);
		}
	};

	const handleClickOpen = () => {
		setOpen(!open);
	};

	const verificarPermisos = (key) => {
		setKeyIndex(key)
		if(sesion.accesos.ventas.eliminar_ventas.ver === true){
			setKeyIndex(''); 
            borrarVenta(key);
        }else{
			setAbrirPanelAcceso(!abrirPanelAcceso);
			setDepartamentos({departamento: 'ventas', subDepartamento: 'eliminar_ventas', tipo_acceso: 'ver'})
		}
	};	

	useEffect(() => {
		if (reloadEliminarVentaEspera === true) {	
			borrarVenta(keyIndex);
			setReloadEliminarVentaEspera(false);
		}
	}, [reloadEliminarVentaEspera]);
	

	return(
		<>
			<TableRow 
				hover 
				tabIndex={-1} 
				key={index} 
			>
				<TableCell align='center'>
					{index + 1}
				</TableCell>
				<TableCell align='center'>
					{venta.fecha ? venta.fecha : ""}
				</TableCell>
				<TableCell align='center'>
					{venta.VentaEnEspera.cliente ? venta.VentaEnEspera.cliente.nombre_cliente : "Pub. General"}
				</TableCell>
				<TableCell align='center'>
					{venta.VentaEnEspera.productos.length}
				</TableCell>
				<TableCell align='center'>
					$ {(venta.VentaEnEspera.total).toFixed(4)}
				</TableCell>
				<TableCell align='center' >
					<IconButton 
						aria-label="regresar" 
						color="primary"
						size='small'
						onClick={() => AgregarVentaDeNuevo(index)}
					>
						<AutorenewIcon fontSize="medium" />
					</IconButton>
				</TableCell>
				<TableCell align='center' >
					<IconButton 
						aria-label="delete" 
						size='small'
						onClick={() => verificarPermisos(index)}
					>
						<DeleteIcon fontSize="medium" />
					</IconButton>
				</TableCell>
			</TableRow>

			<Dialog
				open={open} 
				onClose={handleClickOpen} 
				fullWidth
				maxWidth='xs'
			>
				
				<DialogContent>
					<Box p={1} display='flex'>
						<Typography variant="h6">
							No puedes agregar una venta, cuando ya esta una en curso.
						</Typography>
						<Box display='flex' justifyContent={'flex-end'} p={2}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon />
							</Button>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</>

	);
}