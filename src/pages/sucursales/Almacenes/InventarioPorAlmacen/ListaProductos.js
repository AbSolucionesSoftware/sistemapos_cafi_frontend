import React, {useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress } from '@material-ui/core/';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ErrorPage from '../../../../components/ErrorPage'
import ExportarExcel from '../../../../components/ExportExcel'
import { useQuery } from '@apollo/client';
import { OBTENER_ALMACENES } from '../../../../gql/Almacenes/Almacen';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		
		maxHeight: '60vh'
	}
});

export default function ListaAlmacenes(props) {
	const classes = useStyles();
	
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	
	// const almacenesColumnas = [];
	// const productosRows = [];
		/* Queries */
	const { loading, error, refetch } = useQuery(OBTENER_ALMACENES,{
		variables: {
			id: sesion.sucursal._id
		}
	});	
    const dataExcel = [];
	const columns = [
		{ id: 'codigo_barras', label: 'Código de barras', minWidth: 60 , widthPx: 160, },
		//{ id: 'claveAlt', label: 'Clave alterna', minWidth: 100 },
		//{ id: 'tipoProd', label: 'Tipo producto', minWidth: 100 },
		{ id: 'nombre_comercial', label: 'Nombre comercial', minWidth: 170, widthPx: 160, },
		//{ id: 'nombregen', label: 'Nombre génerico', minWidth: 170 },
		//{ id: 'categoria', label: 'Categoría', minWidth: 100 },
		//{ id: 'subCategoria', label: 'Sub Categoría', minWidth: 100 },
		//{ id: 'marca', label: 'Marca', minWidth: 100 },
		//{ id: 'recetaFarm', label: 'Receta farmacia ', minWidth: 100 }
	];

	useEffect(
		() => {
			refetch();
		},
		[ refetch ]
	);
	
	if(props.obtenerAlmacenes){
		// let existencias= []; 
		props.obtenerAlmacenes.forEach(element => {
			columns.push({ id: element._id, label: element.nombre_almacen, minWidth: 60, widthPx: 160,})
			
		}); 
		columns.push({ id: 'total', label: 'Total existencias', minWidth: 60, widthPx: 160,})
	}
	
	const Rowrow = ({producto}) => {
		
		let arrayCantidades=[];
		let row={'codigo_barras' : producto.datos_generales.codigo_barras, "nombre_comercial":producto.datos_generales.nombre_comercial, style: {
                     font: { sz: '12' },
                     alignment: { wrapText: true, horizontal: 'center', vertical: 'top' },
                     border: { bottom: { style: 'thin', color: { rgb: '000000' } } 
                    }}};
		let total=0;
	    let unidad_minima = '';
		let cantidad = 0;
		props.obtenerAlmacenes.forEach((almacenColumna) => {
			const existencias =	producto.existencia_almacenes.filter((existencia) => existencia._id.almacen._id === almacenColumna._id)

			if(existencias.length > 0){
				arrayCantidades.push(existencias[0].cantidad_existente )
				unidad_minima = (existencias[0].unidad_inventario !== null) ? existencias[0].unidad_inventario: 'pz';
				row = {...row, [almacenColumna._id]: existencias[0].cantidad_existente + " " + unidad_minima };
				total += existencias[0].cantidad_existente;
			}
			
			
			else{
				arrayCantidades.push(0);
				row = {...row, [almacenColumna._id]:0   };	
			}
		});	 
		row = {...row, total:total + " " + unidad_minima };	
		
		dataExcel.push(row)
		return(
			<TableRow hover role="checkbox" tabIndex={-1} key={producto._id} >
				<TableCell style={{minWidth:60}} >{producto.datos_generales.codigo_barras}</TableCell>
						
			
				<TableCell style={{minWidth:170}} >{producto.datos_generales.nombre_comercial}</TableCell>
			
			
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
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	if (loading)
	return (
		<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
			<CircularProgress />
		</Box>
	);
	if (error) {
		console.log(error)
		return <ErrorPage error={error} />;
	}

	
	return (
		<div>
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader size={'small'} aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={column.id} align={column.align} style={{textAlign:(index > 1)? 'center': 'left', minWidth: column.minWidth, width: column.minWidth}}>
									{column.label}
								</TableCell>
							))}	
						</TableRow>
					</TableHead>
					<TableBody>
						{props.productos.map((row, index) => {
							return (
								<Rowrow producto={row} key={index} />
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
		{(props.productos.length > 0) ?
			<Box m={2} alignContent="flex-end">
				<ExportarExcel fileName="Inventarios almacen" data={dataExcel} columnName={columns} />
			</Box>
			:
			<div/>
		}
		</div>
	);
}
