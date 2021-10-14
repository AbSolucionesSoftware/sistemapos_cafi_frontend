import React, { useContext, useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Chip, IconButton, Tooltip, Zoom , TextField} from '@material-ui/core';
import { Cached, Close, Edit } from '@material-ui/icons';
import { TraspasosAlmacenContext } from "../../context/Almacenes/traspasosAlmacen";
import { fade } from '@material-ui/core/styles/colorManipulator';

const compareFunction = (a, b) => {
	if (a.medida.talla && b.medida.talla) {
		return a.medida.talla.localeCompare(b.medida.talla);
	}
};


const useStyles = makeStyles((theme) => ({
	root: {
		alignSelf:'center',
		width:'90%',
		paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
		
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		
		minWidth: '100%',
		maxWidth: '100%',
		
	},
	container: {
		maxHeight: '65vh'
	},
	tableRow: {
    
		'&.Mui-selected, &.Mui-selected:hover': {
			backgroundColor: fade(theme.palette.primary.main, 0.1)
		}
	},
    cell:{
       align:'center'     
    },
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	},
	colorContainer: {
		border: '1px solid rgba(0,0,0, .3)',
		height: 30,
		width: 30,
		borderRadius: '15%'
	}
}));


function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function TablaPresentaciones({ producto, setOnUpdate, onUpdate, newMedidas, setNewMedidas }) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState(undefined);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
 

 
const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer >
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell >Medida</TableCell>
								<TableCell >Color</TableCell>
								<TableCell >Cantidad existente</TableCell>
                                <TableCell >Cantidad a traspasar</TableCell>
                            </TableRow>
						</TableHead>
						<TableBody>
							{stableSort(producto.medidas_producto, getComparator(order, orderBy))
                			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((item, index) => {
								
								return (
									<RenderPresentacionesRows
										idProducto={producto._id}
										key={index}
										medida={item}
										index={index}
										setOnUpdate={setOnUpdate}
										onUpdate={onUpdate}
										newMedidas={newMedidas}
										setNewMedidas={setNewMedidas}
									/>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={producto.medidas_producto.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					// onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}


const RenderPresentacionesRows = ({ medida, index, setOnUpdate, onUpdate,newMedidas, setNewMedidas, idProducto}) => {

	const [ disabledInput, setDisabledInput ] = useState(true);
	const classes = useStyles();
	const [ cantidad, setCantidad ] = useState(0);
	const [ cantidadAnt, setCantidadAnt ] = useState(0);
	const copy_medida = { ...medida };
	const {productosTras} = useContext(TraspasosAlmacenContext);
	//const [productInTras, setProductInTras] =  useState(null);
	let productInTras = null;
	//let productInTras = productosTras.find(element => element.productSelected._id === idProducto);
	const productosTrasContext = productosTras;
 
	useEffect(() => {
		productosTras.forEach(producto => {
			//console.log(producto)
		if(producto.productSelected._id === idProducto){
			let newMedidasCopia = [];
			let element = null;
			for (const med in producto.newMedidas) {
				if (Object.hasOwnProperty.call(producto.newMedidas, med)) {
					element = producto.newMedidas[med];
					
					newMedidasCopia.push(element)
					
					if(medida._id === element.medida._id){
						console.log(element.nuevaCantidad)	
						setCantidad( element.nuevaCantidad);		
					}
					
				}
			
			}
			
			setNewMedidas(producto.newMedidas);
			return;
		}
		
	});
		return () => {
			<div/>
		}
	}, [productosTras])
	


	

	/* if(from && from === 'compra'){
		copy_producto.cantidad_nueva = 0
	} */
	
	const obtenerDatos = (value) => {
		let cant = (cantidadAnt > 0) ? parseInt(value - cantidadAnt)   : value;
		console.log("CANT",cantidad)
		if(cant <= medida.cantidad){
			setCantidad(value);
		
			setNewMedidas({...newMedidas, [index] : {medida, nuevaCantidad: parseInt(cant)}})
		}
		/* 
		const unidades = {cantidad:} 
		copy_producto.push() */
		//Tengo que obtener los datos que se van a enviar se debe agregar un elemento al array 
		
		//setPresentaciones(copy_presentaciones);
	};


	return (
		<TableRow  selected={!disabledInput} className={classes.tableRow} >
			<TableCell >
				{copy_medida.medida._id ? <Chip label={copy_medida.medida.talla} color="primary" /> : ''}
			</TableCell>
			<TableCell  style={{width:'20%'}}>
				{copy_medida.color._id ? (
					<Tooltip title={copy_medida.color.nombre} placement="top" arrow TransitionComponent={Zoom}>
						<div
							className={classes.colorContainer}
							style={{
								backgroundColor: copy_medida.color.hex
							}}
						/>
					</Tooltip>
				) : null}
			</TableCell>
			
		
			<TableCell className={classes.cell}  style={{width:'25%'}}>
				{medida.cantidad}
			</TableCell>
		 
			<TableCell  style={{width:'25%'}}>
				<TextField
					size="small"
					variant="outlined"
					InputProps={{ inputProps: { min: 0 } }}
					inputMode="numeric"
					type="number"
					value={cantidad}
					onChange={(value) => obtenerDatos(value.target.value)}
					name="cantidad_nueva"
				/>
            </TableCell>    
		</TableRow>
	);
};