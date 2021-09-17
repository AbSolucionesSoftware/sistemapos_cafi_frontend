import React, { useContext, useState, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ComprasContext } from '../../../../context/Compras/comprasContext';

const useStyles = makeStyles({
	root: {
		width: '100%',
	}
});

export default function ListaCompras() {
	const classes = useStyles();
	const { productosCompra } = useContext(ComprasContext);

	const productos_ordernados = [ ...productosCompra].reverse();

	return (
		<Paper className={classes.root}>
			<TableContainer>
				<Table stickyHeader size="small">
				{/* <caption>A basic table example with a caption</caption> */}
					<TableHead>
						<TableRow>
							<TableCell>Código de barras</TableCell>
							<TableCell>Producto</TableCell>
							<TableCell>Precio de compra</TableCell>
							<TableCell>IVA</TableCell>
							<TableCell>IEPS</TableCell>
							<TableCell>Remover</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{productos_ordernados.map((producto, index) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={index}>
									<TableCell>
										{producto.producto.datos_generales ? producto.producto.datos_generales
											.codigo_barras ? (
											producto.producto.datos_generales.codigo_barras
										) : (
											'-'
										) : (
											'-'
										)}
									</TableCell>
									<TableCell>{producto.producto.datos_generales.nombre_comercial}</TableCell>
									<TableCell width={180}>
										<b>$ {producto.producto.precios.precio_de_compra.precio_con_impuesto}</b>
									</TableCell>
									<TableCell>{producto.producto.precios.iva}%</TableCell>
									<TableCell>{producto.producto.precios.ieps}%</TableCell>
									<TableCell>
										<ModalDeleteProducto index={index} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDeleteProducto = ({ index }) => {
	const { productosCompra, setProductosCompra } = useContext(ComprasContext);
	const [ open, setOpen ] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const eliminarCompra = () => {
		let copy_compras = [ ...productosCompra ].reverse();
		copy_compras.splice(index, 1);
		setProductosCompra([...copy_compras].reverse())
		handleClose();
	}

	return (
		<div>
			<IconButton color="secondary" size="small" onClick={handleClickOpen}>
				<RemoveCircleOutlineIcon />
			</IconButton>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="modal-eliminar-compra"
			>
				<DialogTitle id="modal-eliminar-compra">{'Seguro que quiere eliminar esto de la lista?'}</DialogTitle>

				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancelar
					</Button>
					<Button onClick={eliminarCompra} color="secondary">
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
