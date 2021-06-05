import { Box, Button, Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/logochafa.PNG';
import adminIcon from '../../icons/ventas/admin.svg';
import cartIcon from '../../icons/ventas/cart-add.svg';
import PowerSettingsNewRoundedIcon from '@material-ui/icons/PowerSettingsNewRounded';

const useStyles = makeStyles((theme) => ({
	icon: {
		width: 150,
        fontSize: 150
	},

}));

export default function LayoutHome(props) {
	const sesion = localStorage.getItem('sesionCafi');
	const classes = useStyles();

	if (sesion === 'false') props.history.push('/');

    const signOut = () => {
		localStorage.setItem('sesionCafi', false);
		props.history.push('/');
	};

	return (
		<Container maxWidth="md">
			<Box height="90vh">
				<Box display="flex" justifyContent="center">
					<img alt="logo ab" src={logo} />
				</Box>
				<Box display="flex" justifyContent="center" my={6}>
					<Button component={Link} to="/admin/inicio">
						<Box display="flex" flexDirection="column" textAlign="center">
							<Box display="flex" justifyContent="center">
								<img src={adminIcon} alt="icono numero calzado" className={classes.icon} />
							</Box>
							Admin
						</Box>
					</Button>
					<Button component={Link} to="/ventas/venta-general">
						<Box display="flex" flexDirection="column" textAlign="center">
							<Box display="flex" justifyContent="center">
								<img src={cartIcon} alt="icono numero calzado" className={classes.icon} />
							</Box>
							Ventas
						</Box>
					</Button>
                    <Button component={Link} to="/ventas/venta-general" color="secondary" onClick={signOut}>
						<Box display="flex" flexDirection="column" textAlign="center">
							<Box display="flex" justifyContent="center">
								<PowerSettingsNewRoundedIcon className={classes.icon} />
							</Box>
							Cerrar sesion
						</Box>
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
