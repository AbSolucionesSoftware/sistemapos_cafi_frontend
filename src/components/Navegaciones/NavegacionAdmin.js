import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Button, Typography, Toolbar, AppBar } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { withRouter } from 'react-router-dom';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	appbar: {
		backgroundColor: theme.palette.navbar,
        color: grey[800]
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1,
		marginLeft: theme.spacing(2),
	}
}));

function NavegacionAdmin(props) {
	const classes = useStyles();
	const token = localStorage.getItem('sesionCafi');
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	let usuario;
	
	if (token !== null) usuario = JSON.parse(localStorage.getItem('sesionCafi'));

    const signOut = () => {
		localStorage.removeItem('sesionCafi');
		localStorage.removeItem('tokenCafi');
		props.history.push('/');
	};

	return (
		<div>
			<AppBar position="fixed" className={classes.appbar} elevation={0}>
				<Toolbar>
					<Avatar alt="Remy Sharp" src={usuario.imagen} />
					<Box className={classes.title}>
						<Typography variant="h6" color="inherit">Bienvenido {`${usuario.nombre}`}</Typography>
					</Box>
					{/* <Button
						component={Link}
						to="/home"
						size="large"
						className={classes.menuButton}
						startIcon={<HomeIcon />}
					>
						Inicio
					</Button> */}
					{
						sesion.turno_en_caja_activo === true ? (
							<Button
								color="secondary"
								size="large"
								className={classes.menuButton}
								variant="contained"
								disabled={true}
							>
								TURNO ACTIVO
							</Button>
						):(
							<Button
								color="secondary"
								size="large"
								className={classes.menuButton}
								startIcon={<PowerSettingsNewIcon />}
								variant="contained"
								onClick={signOut}
							>
								Cerrar sesión
							</Button>
						)
					}
				</Toolbar>
			</AppBar>
		</div>
	);
}


export default withRouter(NavegacionAdmin)