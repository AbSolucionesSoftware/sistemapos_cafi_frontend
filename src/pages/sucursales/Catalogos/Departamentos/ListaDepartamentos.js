import React, { useState } from 'react';
import { 
    Paper, 
    makeStyles, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    CircularProgress,
    Box,
    Typography,
	IconButton,
	TablePagination
} from '@material-ui/core/';

import { Delete, Edit } from '@material-ui/icons';

import { useQuery } from '@apollo/client';
import { OBTENER_DEPARTAMENTOS } from '../../../../gql/Catalogos/departamentos';
import ContainerRegistroAlmacen from './RegistroDepartamento';
import { CrearAlmacenContext } from '../../../../context/Catalogos/createDepartamentos';

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

const rows = [
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Donut', 452, 25.0, 51, 4.9),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
	createData('Honeycomb', 408, 3.2, 87, 6.5),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Jelly Bean', 375, 0.0, 94, 0.0),
	createData('KitKat', 518, 26.0, 65, 7.0),
	createData('Lollipop', 392, 0.2, 98, 0.0),
	createData('Marshmallow', 318, 0, 81, 2.0),
	createData('Nougat', 360, 19.0, 9, 37.0),
	createData('Oreo', 437, 18.0, 63, 4.0)
];

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function TablaDepartamentos() {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(8);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let obtenerDepartamentos = [];

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_DEPARTAMENTOS,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if(data){
		obtenerDepartamentos = data.obtenerDepartamentos
	}

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="medium"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell>Departamentos</TableCell>
								<TableCell padding="default">Editar</TableCell>
								<TableCell padding="default">Eliminar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
							obtenerDepartamentos
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								?.map((row, index) => {
									return <RowsRender key={index} datos={row} />;
								})
							}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={obtenerDepartamentos.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
	);
}


const RowsRender = ({ datos }) => {
	return (
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>{datos.nombre_departamentos}</TableCell>
			<TableCell padding="checkbox">
				<IconButton>
					<Edit />
				</IconButton>
			</TableCell>
			<TableCell padding="checkbox">
				<IconButton>
					<Delete />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
