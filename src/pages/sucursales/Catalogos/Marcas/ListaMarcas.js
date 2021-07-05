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
import { OBTENER_MARCAS, } from '../../../../gql/Catalogos/marcas';


const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

export default function ListaMarcas({updateData}) {

    const classes = useStyles();
    const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(8);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let obtenerMarcas = [];

    const { data, refetch } = useQuery(OBTENER_MARCAS,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	


	useEffect(() => {
		refetch();
	}, [refetch, updateData])

    if(data){
		obtenerMarcas = data.obtenerMarcas
	}

    const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

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
								<TableCell>Marca</TableCell>
								<TableCell padding="default">Editar</TableCell>
								<TableCell padding="default">Eliminar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
							obtenerMarcas
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
					count={obtenerMarcas.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
		</div>
    )
}

const RowsRender = ({ datos }) => {
	return (
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>{datos.nombre_marca}</TableCell>
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

