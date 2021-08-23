import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {
	Box,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Divider,
	DialogActions,
	Button,
	Avatar
} from '@material-ui/core';
import { CropOriginal, Dehaze } from '@material-ui/icons';
import CrearProducto from './crearProducto';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '70vh'
	},
	avatar: {
		width: 130,
		height: 130
	}
});

export default function ListaProductos({obtenerProductos}) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
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
							<TableCell>Codigo barras</TableCell>
							<TableCell>Clave alterna</TableCell>
							<TableCell>Nombre comercial</TableCell>
							<TableCell>Nombre genérico</TableCell>
							<TableCell>Descripción</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Más información</TableCell>
							<TableCell>Editar</TableCell>
							{/* <TableCell>Eliminar</TableCell> */}
						</TableRow>
					</TableHead>
					<TableBody>
						{obtenerProductos
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((producto, index) => {
								return (
									<RenderTableRows key={index} producto={producto} />
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={obtenerProductos.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

const RenderTableRows = ({producto}) => {

	return (
		<TableRow hover>
			<TableCell>{producto.datos_generales.codigo_barras}</TableCell>
			<TableCell>{producto.datos_generales.clave_alterna}</TableCell>
			<TableCell>{producto.datos_generales.nombre_comercial}</TableCell>
			<TableCell>{producto.datos_generales.nombre_generico}</TableCell>
			<TableCell>{producto.datos_generales.descripcion}</TableCell>
			<TableCell>{producto.datos_generales.tipo_producto}</TableCell>
			<TableCell align="center">
				<ModalDetalles producto={producto} />
			</TableCell>
			<TableCell align="center">
				<CrearProducto accion={true} datos={producto} />
			</TableCell>
			{/* <TableCell align="center">Eliminar</TableCell> */}
		</TableRow>
	);
}

const ModalDetalles = ({ producto }) => {
	const classes = useStyles();
	const { datos_generales, imagenes } = producto;
	const [ openDetalles, setOpenDetalles ] = useState(false);

	const handleDetalles = () => setOpenDetalles(!openDetalles);

	return (
		<div>
			<IconButton onClick={handleDetalles}>
				<Dehaze />
			</IconButton>
			<Dialog open={openDetalles} onClose={handleDetalles} fullWidth maxWidth="md">
				<DialogTitle>{'Información completa del producto'}</DialogTitle>
				<DialogContent>
					<Box mt={1}>
						<Typography variant="h6">Datos generales</Typography>
						<Divider />
					</Box>
					<Box display="flex">
						<Box mt={3} height={120} width={120} display="flex" justifyContent="center" alignItems="center">
							{imagenes.length > 0 ? (
								<Avatar className={classes.avatar} src={imagenes[0].url_imagen} />
							) : (
								<Avatar className={classes.avatar}>
									<CropOriginal />
								</Avatar>
							)}
						</Box>
						<ul>
							<Typography>
								<b>Código de barras: </b>
								{datos_generales.codigo_barras ? datos_generales.codigo_barras : '-'}
							</Typography>
							<Typography>
								<b>Clave alterna: </b>
								{datos_generales.clave_alterna ? datos_generales.clave_alterna : '-'}
							</Typography>
							<Typography>
								<b>Clave producto del SAT: </b>
								{datos_generales.clave_producto_sat ? datos_generales.clave_producto_sat : '-'}
							</Typography>
							<Typography>
								<b>Nombre comercial: </b>
								{datos_generales.nombre_comercial ? datos_generales.nombre_comercial : '-'}
							</Typography>
							<Typography>
								<b>Nombre genérico: </b>
								{datos_generales.nombre_generico ? datos_generales.nombre_generico : '-'}
							</Typography>
							<Typography>
								<b>Descripción: </b>
								{datos_generales.descripcion ? datos_generales.descripcion : '-'}
							</Typography>
						</ul>
						<ul>
							<Typography>
								<b>Tipo de producto: </b>
								{datos_generales.tipo_producto ? datos_generales.tipo_producto : '-'}
							</Typography>
							<Typography>
								<b>Categoria: </b>
								{datos_generales.categoria ? datos_generales.categoria : '-'}
							</Typography>
							<Typography>
								<b>Subcategoria: </b>
								{datos_generales.subcategoria ? datos_generales.subcategoria : '-'}
							</Typography>
							<Typography>
								<b>Departamento: </b>
								{datos_generales.departamento ? datos_generales.departamento : '-'}
							</Typography>
							<Typography>
								<b>Marca: </b>
								{datos_generales.marca ? datos_generales.marca : '-'}
							</Typography>
						</ul>
					</Box>
					{imagenes.length > 1 ? (
						<Fragment>
							<Box mt={1}>
								<Typography variant="h6">Más imagenes</Typography>
								<Divider />
							</Box>
							{imagenes.map((res, index) => {
								return (
									<Box
										mt={1}
										key={index}
										height={120}
										width={120}
										display="flex"
										justifyContent="center"
										alignItems="center"
									>
										<Avatar className={classes.avatar} src={res.url_imagen} />
									</Box>
								);
							})}
						</Fragment>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDetalles} color="primary" variant="contained" size="large">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
