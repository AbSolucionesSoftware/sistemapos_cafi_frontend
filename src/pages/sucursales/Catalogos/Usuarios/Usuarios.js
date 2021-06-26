import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Search } from '@material-ui/icons';
import Slide from '@material-ui/core/Slide';
import { Box, Paper, InputBase, IconButton } from '@material-ui/core';
import usuariosIcon from '../../../../icons/usuarios.svg';
import ListaUsuarios from './ListaUsuario';
import CrearUsuario from './CrearUsuario';
import { UsuarioProvider } from '../../../../context/Catalogos/usuarioContext';

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

export default function Usuarios() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ filtro, setFiltro ] = useState('');
	const [ values, setValues ] = useState('');
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

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
			<UsuarioProvider>
				<Button fullWidth onClick={handleClickOpen}>
					<Box display="flex" flexDirection="column">
						<Box display="flex" justifyContent="center" alignItems="center">
							<img src={usuariosIcon} alt="icono numero calzado" className={classes.icon} />
						</Box>
						Usuarios
					</Box>
				</Button>
				<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								Usuarios
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
									placeholder="Buscar cliente..."
									onChange={(e) => setValues(e.target.value)}
									onKeyPress={pressEnter}
									value={values}
								/>
								<IconButton onClick={() => setFiltro(values)}>
									<Search />
								</IconButton>
							</Paper>
						</Box>
						<CrearUsuario accion="registrar" />
					</Box>
					<Box mx={4}>
						<ListaUsuarios sucursal={sesion.sucursal} filtro={filtro} />
					</Box>
				</Dialog>
			</UsuarioProvider>
		</div>
	);
}
