import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';



const columns = [
	{ id: 'codBarras', label: 'Código de barras', minWidth: 100 },
	{ id: 'claveAlt', label: 'Clave alterna', minWidth: 100 },
	{ id: 'tipoProd', label: 'Tipo producto', minWidth: 100 },
	{ id: 'nombreCome', label: 'Nombre comercial', minWidth: 170 },
	{ id: 'nombregen', label: 'Nombre génerico', minWidth: 170 },
	{ id: 'categoria', label: 'Categoría', minWidth: 100 },
	{ id: 'subCategoria', label: 'Sub Categoría', minWidth: 100 },
	{ id: 'marca', label: 'Marca', minWidth: 100 },
	{ id: 'recetaFarm', label: 'Receta farmacia ', minWidth: 100 }
];



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
	const [ rowsPerPage, setRowsPerPage ] = React.useState(3);
	
	
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{props.productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
							console.log(row)
							
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
									<TableCell>{row.datos_generales.codigo_barras}</TableCell>
									<TableCell>{row.datos_generales.clave_alterna}</TableCell>			
									<TableCell>{row.datos_generales.tipo_producto}</TableCell>
									<TableCell>{row.datos_generales.nombre_comercial}</TableCell>
									<TableCell>{row.datos_generales.nombre_generico}</TableCell>
									<TableCell>{row.datos_generales.categoria}</TableCell>
									<TableCell>{row.datos_generales.subcategoria}</TableCell>
									<TableCell>{row.datos_generales.marca}</TableCell>
									<TableCell style={{textAlign: 'center',}} >{(row.datos_generales.receta_farmacia) ? "SI" : "NO"}</TableCell>
								</TableRow>
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
