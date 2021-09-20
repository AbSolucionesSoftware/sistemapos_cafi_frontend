import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import DatosProducto from './productos/DatosProducto';

import { FcPlus } from 'react-icons/fc';
import { Box } from '@material-ui/core';
import ListaCompras from './TablaCompras';
import { Grid } from '@material-ui/core';
import { ComprasContext, ComprasProvider } from '../../../../context/Compras/comprasContext';
import { Done } from '@material-ui/icons';
import { formatoMexico } from '../../../../config/reuserFunctions';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		fontSize: 100
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		paddingTop: 3,
		alignItems: 'center',
		justifyItems: 'center'
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCompra({ status }) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(!open);
	};

	return (
		<div>
			{status === 'enEspera' ? (
				<Button fullWidth onClick={handleClickOpen} color="primary" variant="contained" size="large">
					continuar compra
				</Button>
			) : (
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<FcPlus className={classes.icon} />
						</Box>
						Abrir una compra
					</Box>
				</Button>
			)}
			<ComprasProvider>
				<ModalCompra open={open} handleClickOpen={handleClickOpen} />
			</ComprasProvider>
		</div>
	);
}

const ModalCompra = ({ open, handleClickOpen }) => {
	const classes = useStyles();
	const { productosCompra, datosCompra, setDatosCompra } = useContext(ComprasContext);
	

	const calcularCostoCompra = () => {
		let subtotal = 0
		let impuestos = 0
		let total = 0

		productosCompra.forEach(element => {
			const { precio_de_compra } = element.producto.precios

			subtotal += precio_de_compra.precio_sin_impuesto
			impuestos += precio_de_compra.iva + precio_de_compra.ieps;
			total += precio_de_compra.precio_con_impuesto
		});

		setDatosCompra({
			...datosCompra, 
			subtotal: parseFloat(subtotal.toFixed(2)),
			impuestos: parseFloat(impuestos.toFixed(2)),
			total: parseFloat(total.toFixed(2))
		})
	}

	const realizarCompraBD = () => {
		console.log(productosCompra);
		
	};

	useEffect(() => {
		return () => {
			calcularCostoCompra();
		}
	}, [])

	return (
		<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
			<DialogTitle style={{ padding: 0 }}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Nueva compra
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{ fontSize: 30 }} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
			</DialogTitle>
			<DialogContent>
				<DatosProducto />
				<Box my={2} />
				<ListaCompras />
			</DialogContent>

			<DialogActions>
				<Box display="flex" justifyContent="space-between" alignItems="center" flexGrow={1} mx={2}>
					<Box>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
								<Typography style={{ fontSize: 18 }}>
									Subtotal: <b>${formatoMexico(datosCompra.subtotal)}</b>
								</Typography>
							</Grid>
							<Grid item>
								<Typography style={{ fontSize: 18 }}>
									Impuestos:  <b>${formatoMexico(datosCompra.impuestos)}</b>
								</Typography>
							</Grid>
							<Grid item>
								<Typography style={{ fontSize: 18 }}>
									<b>Total:  <b>${formatoMexico(datosCompra.total)}</b></b>
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Button color="inherit" size="large" onClick={() => handleClickOpen()}>
					Cancelar
				</Button>
				<Button
					autoFocus
					color="primary"
					variant="text"
					size="large"
					onClick={() => realizarCompraBD()}
					disabled={!productosCompra.length}
				>
					Poner esta compra en espera
				</Button>
				<Button
					autoFocus
					color="primary"
					variant="contained"
					size="large"
					onClick={() => realizarCompraBD()}
					disabled={!productosCompra.length}
					startIcon={<Done />}
				>
					Realizar compra
				</Button>
			</DialogActions>
		</Dialog>
	);
};
