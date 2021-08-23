import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    makeStyles, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
	IconButton,
	TablePagination
} from '@material-ui/core/';

import { Delete, Edit } from '@material-ui/icons';

import { useQuery } from '@apollo/client';
import { OBTENER_DEPARTAMENTOS } from '../../../../gql/Catalogos/departamentos';
// import ContainerRegistroAlmacen from './RegistroDepartamento';
// import { CreateDepartamentosContext } from '../../../../context/Catalogos/Departamentos';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function TablaDepartamentos({ updateData }) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(8);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let obtenerDepartamentos = [];

	// const { update } = useContext(CreateDepartamentosContext);

	/* Queries */
	const { data, refetch } = useQuery(OBTENER_DEPARTAMENTOS,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

	useEffect(
		() => {
			refetch();
		},
		[ updateData, refetch ]
	);

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
