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
import { useQuery } from '@apollo/client';
import { OBTENER_ALMACENES } from '../../../../gql/Almacenes/Almacen';





const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '70vh'
	}
});

export default function ListaAlmacenes(props) {
	const classes = useStyles();
	
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	
	const almacenesColumnas = [];
	const productosRows = [];
		/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_ALMACENES,{
		variables: {
			id: sesion.sucursal._id
		}
	});	

	const columns = [
		{ id: 'codBarras', label: 'Código de barras', minWidth: 60 },
		//{ id: 'claveAlt', label: 'Clave alterna', minWidth: 100 },
		//{ id: 'tipoProd', label: 'Tipo producto', minWidth: 100 },
		{ id: 'nombreCome', label: 'Nombre comercial', minWidth: 170 },
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
		let existencias= []; 
		props.obtenerAlmacenes.forEach(element => {
			columns.push({ id: element._id, label: element.nombre_almacen, minWidth: 60 })
			
		}); 
		columns.push({ id: 'total', label: 'Total existencias', minWidth: 60 })
	}
	
	const Rowrow = ({producto}) => {
		let arrayCantidades=[];
		let total=0;
		
		 props.obtenerAlmacenes.forEach((almacenColumna) => {
			const existencias =	producto.existencia_almacenes.filter((existencia) => existencia._id.almacen._id == almacenColumna._id)
			if(existencias.length > 0){
				arrayCantidades.push(existencias[0].cantidad_existente)
				total += existencias[0].cantidad_existente;
			}else{
				arrayCantidades.push(0);			
			}
		});	 
		
		return(
			<TableRow hover role="checkbox" tabIndex={-1} key={producto._id} >
				<TableCell style={{minWidth:60}} >{producto.datos_generales.codigo_barras}</TableCell>
						
			
				<TableCell style={{minWidth:170}} >{producto.datos_generales.nombre_comercial}</TableCell>
			
			
				{/* <TableCell style={{textAlign: 'center',}} >{(producto.datos_generales.receta_farmacia) ? "SI" : "NO"}</TableCell> */}
				{ 
					arrayCantidades.map((cantidad) => {
						return(<TableCell style={{backgroundColor:'rgba(255, 253, 150, 0.1)', color:'black',fontSize:17, textAlign:'center',minWidth:60 }}>{cantidad}</TableCell>)	
					})	
				}
				<TableCell  style={{backgroundColor:'rgba(255, 253, 150, 0.1)', color:'black', fontSize:18,fontWeight:'bold', textAlign:'center' ,minWidth:60}}>{total}</TableCell>
				
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
		return <ErrorPage error={error} />;
	}

	
	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
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
						{props.productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<Rowrow producto={row} />
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[ 10, 25, 100 ]}
				component="div"
				count={props.productos.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
				labelRowsPerPage={"Renglones por página"}
			/>
		</Paper>
	);
}
