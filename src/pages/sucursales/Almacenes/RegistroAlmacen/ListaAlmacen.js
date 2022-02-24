import React, { useEffect, useContext } from 'react'
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
import { Delete } from '@material-ui/icons';
import ErrorPage from '../../../../components/ErrorPage'


import { useQuery } from '@apollo/client';
import { OBTENER_ALMACENES } from '../../../../gql/Almacenes/Almacen';
import ContainerRegistroAlmacen from './ContainerRegistroAlmacen';
import { CrearAlmacenContext } from '../../../../context/Almacenes/crearAlmacen';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
	root: {
		width: '100%',
		heigth: '75%'
	},
	container: {
		maxHeight: "77vh",
		'& ::-webkit-scrollbar': {
			display: 'none'
		}
  	},
  });

  const columns = [
	{ id: 1, label: 'Nombre', minWidth: 100 },
	{ id: 2, label: 'Encargado', minWidth: 100 },
	{ id: 3, label: 'Sucursal', minWidth: 150 },
	{ id: 4, label: 'Calle', minWidth: 150 },
	{ id: 5, label: 'No. exterior', minWidth: 150 },
	{ id: 6, label: 'No. interior', minWidth: 100 },
	{ id: 7, label: 'Codigo postal', minWidth: 100 },
	{ id: 8, label: 'Colonia', minWidth: 100 },
	{ id: 9, label: 'Municipio', minWidth: 50, align: 'right' },
	{ id: 10, label: 'Localidad', minWidth: 50, align: 'right' },
	{ id: 11, label: 'Estado', minWidth: 50, align: 'right' },
	{ id: 12, label: 'Pais', minWidth: 50, align: 'right' },
	{ id: 13, label: 'Editar', minWidth: 50, align: 'right' },
	{ id: 14, label: 'Eliminar', minWidth: 50, align: 'right' }
];

export default function ListaAlmacen() {

    const classes = useStyles();
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
	const { update } = useContext(CrearAlmacenContext);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	
	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_ALMACENES,{
		variables: {
			id: sesion.sucursal._id
		}
	});	
	
	useEffect(
		() => {
			refetch();
		},
		[ update, refetch ]
	);

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

	const { obtenerAlmacenes } = data;

    // const classes = useStyles();

    return (
		<Paper className={classes.root}>
			<TableContainer component={Paper}  className={classes.container}>
				<Table className={classes.table}  aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerAlmacenes
							?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							?.map((row, index) => {
								return <RowsRender key={index} datos={row} />;
							})}
					</TableBody>
				</Table>
			</TableContainer>
		{/* 	<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={obtenerAlmacenes.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/> */}
		</Paper>
    )
}

const RowsRender = ({ datos }) => {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));	

	return (
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>
				<Typography>{datos.nombre_almacen}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{!datos.id_usuario_encargado ? "Sin encargado" : datos.id_usuario_encargado.nombre}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.id_sucursal.nombre_sucursal}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.calle ? datos.direccion.calle : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.no_ext ? datos.direccion.no_ext : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.no_int ? datos.direccion.no_int : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.codigo_postal ? datos.direccion.codigo_postal : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.colonia ? datos.direccion.colonia : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.municipio ? datos.direccion.municipio : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.localidad ? datos.direccion.localidad : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.estado ? datos.direccion.estado : ""}</Typography>
			</TableCell>
			<TableCell>
				<Typography>{datos.direccion.pais ? datos.direccion.pais : ""}</Typography>
			</TableCell>
			<TableCell width={50}>
				{sesion.accesos.almacenes.almacen.editar === false ? (null):(
					<ContainerRegistroAlmacen accion="actualizar" datos={datos} />
				)}
			</TableCell>
			<TableCell width={50}>
				{sesion.accesos.almacenes.almacen.eliminar === false ? (null):(
					<IconButton color="secondary">
						<Delete />
					</IconButton>
				)}
			</TableCell>
			{/* <TableCell width={50}>
				<ModalDetalles openDetalles={openDetalles} handleDetalles={handleDetalles} datos={datos} />
			</TableCell>
			<TableCell width={50}>
				<CrearCliente tipo="CLIENTE" accion="actualizar" datos={datos} />
			</TableCell>
			<TableCell width={50}>
				<IconButton color="secondary">
					<Delete />
				</IconButton>
			</TableCell> */}
		</TableRow>
	);
};
