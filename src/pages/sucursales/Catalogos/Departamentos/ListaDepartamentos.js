import React, { useState, useEffect, useContext } from 'react';
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
	TablePagination,
	Dialog,
	DialogTitle,
	DialogActions,
	Button
} from '@material-ui/core/';
 
import { Delete, Edit, Close } from '@material-ui/icons';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_DEPARTAMENTOS, ELIMINAR_DEPARTAMENTO } from '../../../../gql/Catalogos/departamentos';
// import ContainerRegistroAlmacen from './RegistroDepartamento';
 import { CreateDepartamentosContext } from '../../../../context/Catalogos/Departamentos';

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
	const [open, setOpen] = useState(false);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let obtenerDepartamentos = [];

	const { update, setAccion, idDepartamento,setIdDepartamento, setData, setAlert, setLoading } = useContext(CreateDepartamentosContext);
	const [ eliminarDepartamento ] = useMutation(ELIMINAR_DEPARTAMENTO);
	/* Queries */
	const { data, refetch } = useQuery(OBTENER_DEPARTAMENTOS,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

	const handleModal = () => setOpen(!open);
	useEffect(
		() => {
			refetch();
		},
		[ update, refetch ]
	);

	const handleDelete = async () => {
   
		setLoading(true);
		try {
            const resultado = await eliminarDepartamento({
                variables: {
                    id: idDepartamento
                }
            });

			if(resultado.data.eliminarDepartamento.message === 'false'){
				setAlert({ message: 'Departamento eliminado con exito', status: 'success', open: true });
			}else{
				setAlert({ message: resultado.data.eliminarDepartamento.message, status: 'error', open: true });
			};

			refetch();
			setLoading(false);
			setOpen(false)
			setIdDepartamento('');
		
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};

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
								{sesion.accesos.catalogos.departamentos.editar === false ? (null):(
									<TableCell padding="default">Editar</TableCell>
								)}
								{sesion.accesos.catalogos.departamentos.eliminar === false ? (null):(
									<TableCell padding="default">Eliminar</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{obtenerDepartamentos?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row._id}selected={idDepartamento === row._id ? true : false}>
											<TableCell>{row.nombre_departamentos}</TableCell>
											<TableCell padding="checkbox">
											{idDepartamento === row._id ? (
												<IconButton onClick={() => {
													setIdDepartamento("");
													setData({
														nombre_departamentos: ""
													}); 
													}}>
													<Close />
												</IconButton>
											) : (
												<IconButton onClick={() => {
													setAccion(false)
													setData({
														nombre_departamentos: row.nombre_departamentos
													});
													setIdDepartamento(row._id);
												}}>
													<Edit />
												</IconButton>
											)}
											
											</TableCell>
											<TableCell padding="checkbox">
												<IconButton onClick={() => {
													setIdDepartamento(row._id);
													handleModal();
												}}>
													<Delete />
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
							
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
			<Modal handleModal={handleModal} openModal={open} handleDelete={handleDelete} />
		</div>
	);
}


const Modal = ({ handleModal, openModal, handleDelete }) => {
	return (
		<div>
			<Dialog open={openModal} onClose={handleModal}>
				<DialogTitle>{'¿Seguro que quieres eliminar esto?'}</DialogTitle>
				<DialogActions>
					<Button onClick={handleModal} color="primary">
						Cancelar
					</Button>
					<Button color="secondary" autoFocus variant="contained" onClick={handleDelete}>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
