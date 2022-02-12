import React, {useEffect, useState, useContext} from 'react';
import { TraspasosAlmacenContext } from "../../../../context/Almacenes/traspasosAlmacen";
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core/';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ErrorPage from '../../../../components/ErrorPage'

import { useQuery } from '@apollo/client';
import { OBTENER_ALMACENES } from '../../../../gql/Almacenes/Almacen';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		
		maxHeight: '76vh'
	}
});

const Rowrow = (rowProps) => {
	const {dataExcel, setDataExcel} = useContext(TraspasosAlmacenContext);	
	const [dataExcelHere, setDataExcelHere] = useState([]);	
	const [arrayCantidades , setArrayCantidades] = useState([]);
	const [row, setRow] = useState({'codigo_barras' : rowProps.producto.datos_generales.codigo_barras, "nombre_comercial":rowProps.producto.datos_generales.nombre_comercial, style: {
					font: { sz: '12' },
					alignment: { wrapText: true, horizontal: 'center', vertical: 'top' },
					border: { bottom: { style: 'thin', color: { rgb: '000000' } } 
				}}});
	const [total , setTotal] = useState(0)
	const [unidad_minima , setUnidad_Minima] = useState('')
		
		
		useEffect(() => {
			let tot= 0;
			let r = row;
			let datExc = dataExcel;
			rowProps.obtenerAlmacenes.forEach((almacenColumna) => {
				const existencias =	rowProps.producto.existencia_almacenes.filter((existencia) => existencia._id.almacen._id === almacenColumna._id)

				if(existencias.length > 0){
					arrayCantidades.push(existencias[0].cantidad_existente )
					setUnidad_Minima((existencias[0].unidad_inventario !== null) ? existencias[0].unidad_inventario: 'pz');
					r = {...r, [almacenColumna._id]: existencias[0].cantidad_existente + " " + unidad_minima };
					tot +=  existencias[0].cantidad_existente;
				}
				
				
				else{
					arrayCantidades.push(0);
					r = {...r, [almacenColumna._id]:0   };	
				}
			});	 
			r = {...r, total:tot + " " + unidad_minima };

			setTotal(tot)
			setRow(r);
			datExc.push(r);
			//console.log( 'DATA EXCEL LISTA PROductos' , datExc)
			
		
		 	
			if(rowProps.index === rowProps.productosLength -1){
				
				setDataExcelHere(datExc);
			} 
		
		}, []);

		useEffect(() => {
			console.log(dataExcelHere)
			if(dataExcelHere){
				setDataExcel(dataExcelHere);
			}
		
		}, [dataExcelHere])
		
		return(
			<TableRow hover role="checkbox" tabIndex={-1} key={rowProps.producto._id} >
				<TableCell style={{minWidth:60}} >{rowProps.producto.datos_generales.codigo_barras}</TableCell>
						
			
				<TableCell style={{minWidth:170}} >{rowProps.producto.datos_generales.nombre_comercial}</TableCell>
			
			
				{/* <TableCell style={{textAlign: 'center',}} >{(producto.datos_generales.receta_farmacia) ? "SI" : "NO"}</TableCell> */}
				{ 
					arrayCantidades.map((cantidad, index) => {
						return(<TableCell key={index} style={{backgroundColor:'rgba(255, 253, 150, 0.1)', color:'black',fontSize:17, textAlign:'center',minWidth:60 }}>{cantidad + " " + unidad_minima}</TableCell>)	
					})	
				}
				<TableCell  style={{backgroundColor:'rgba(255, 253, 150, 0.1)', color:'black', fontSize:18,fontWeight:'bold', textAlign:'center' ,minWidth:60}}>{total + " " + unidad_minima }</TableCell>
				
			</TableRow>
		)
	}
export default function ListaAlmacenes(props) {
	const classes = useStyles();
	
	
	//const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	
	// const almacenesColumnas = [];
	// const productosRows = [];
		/* Queries */
	/* const { loading, error, refetch } = useQuery(OBTENER_ALMACENES,{
		variables: {
			id: sesion.sucursal._id
		}
	});	 */
   
	

	/* useEffect(
		() => {
			refetch();
		},
		[ refetch ]
	); */
	

	
	
/* 	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	}; */

	/* if (loading)
	return (
		<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
			<CircularProgress />
		</Box>
	);
	if (error) {
		console.log(error)
		return <ErrorPage error={error} />;
	} */

	
	return (
		<div>
		
		<Paper className={classes.root}>
		
			<TableContainer className={classes.container}>
				<Table stickyHeader size={'small'} aria-label="a dense table">
					<TableHead>
						<TableRow>
							{props.columns.map((column, index) => (
								<TableCell key={column.id} align={column.align} style={{textAlign:(index > 1)? 'center': 'left', minWidth: column.minWidth, width: column.minWidth}}>
									{column.label}
								</TableCell>
							))}	
						</TableRow>
					</TableHead>
					<TableBody>
						{props.productos.map((row, index) => {
						    let key =  index;
							
							return (
								<Rowrow producto={row} index={key} key={index} productosLength={props.productos.length} dataExcel ={props.dataExcel} setDataExcel={props.setDataExcel} obtenerAlmacenes={props.obtenerAlmacenes} />
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			{/* <TablePagination
				rowsPerPageOptions={[ 10, 25, 100 ]}
				component="div"
				count={props.productos.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				labelRowsPerPage={"Renglones por página"}
			/> */}
			
		</Paper>
		
		</div>
	);
}
