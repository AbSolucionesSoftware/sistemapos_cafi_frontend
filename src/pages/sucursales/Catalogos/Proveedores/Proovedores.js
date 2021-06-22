import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import proveedoresIcon from '../../../../icons/distribution.svg';
import TablaProovedores from './ListaProveedores';
import CrearCliente from '../Cliente/CrearCliente';
import { ClienteProvider } from '../../../../context/Catalogos/crearClienteCtx';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		width: 100
	},
	root: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Proveedores() {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);
	const [ filtro, setFiltro ] = useState('');
	const [ values, setValues ] = useState('');

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const pressEnter = (e) => {
		if (e.key === 'Enter') setFiltro(e.target.defaultValue);
	};

	return (
		<div>
			<ClienteProvider>
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<img src={proveedoresIcon} alt="icono numero calzado" className={classes.icon} />
						</Box>
						Proveedores
					</Box>
				</Button>
				<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								Proveedores
							</Typography>
							<Button
								autoFocus
								color="inherit"
								size="large"
								onClick={handleClose}
								startIcon={<CloseIcon />}
							>
								Cerrar
							</Button>
						</Toolbar>
					</AppBar>
					<Box m={3} display="flex" justifyContent="space-between">
						<Box mr={5} minWidth="70%">
							<Paper className={classes.root}>
								<InputBase
									fullWidth
									placeholder="Buscar proveedor..."
									onChange={(e) => setValues(e.target.value)}
									onKeyPress={pressEnter}
									value={values}
								/>
								<IconButton onClick={() => setFiltro(values)}>
									<Search />
								</IconButton>
							</Paper>
						</Box>
						<CrearCliente tipo="PROVEEDOR" accion="registrar" />
					</Box>
					<Box mx={4}>
						<TablaProovedores tipo="PROVEEDOR" filtro={filtro} />
					</Box>
				</Dialog>
			</ClienteProvider>
		</div>
	);
}
