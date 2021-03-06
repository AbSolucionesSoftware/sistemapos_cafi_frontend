import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import { LOGEAR_USUARIO } from '../../gql/Catalogos/usuarios';
import SnackBarMessages from '../SnackBarMessages';
import jwt_decode from 'jwt-decode';
import { FormControl } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { OutlinedInput } from '@material-ui/core';
import { InputAdornment } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ab from '../../img/abLogo.jpeg'

const useStyles = makeStyles((theme) => ({
	margin: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	},
	containerImagen:{
		maxWidth: 170,
		maxHeight: 170
	},
	imagen:{
		width: '100%',
		height: '100%'
	},
	input: {
		"& input[type=number]": {
		  "-moz-appearance": "textfield",
		},
		"& input[type=number]::-webkit-outer-spin-button": {
		  "-webkit-appearance": "none",
		  margin: 0,
		},
		"& input[type=number]::-webkit-inner-spin-button": {
		  "-webkit-appearance": "none",
		  margin: 0,
		},
	  },
}));

export default function LayoutLogin(props) {
	const classes = useStyles();
	const sesion = localStorage.getItem('sesionCafi');
	const [ datos, setDatos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [ showPassword, setShowPassword ] = useState(false);

	if (sesion) props.history.push('/ventas/venta-general');

	const [ logearUsuario ] = useMutation(LOGEAR_USUARIO);

	const signin = async (e) => {
		e.preventDefault();
		if (!datos.numero_usuario || !datos.password) {
			setAlert({ message: 'Los campos estan vacíos', status: 'error', open: true });
			return;
		}
		setLoading(true);

		try {
			const result = await logearUsuario({
				variables: {
					input: {
						numero_usuario: parseInt(datos.numero_usuario),
						password: datos.password
					}
				}
			});
			const { token } = result.data.logearUsuario;
			const decoded = jwt_decode(token);
			setLoading(false);
			localStorage.setItem('sesionCafi', JSON.stringify(decoded));
			localStorage.setItem('tokenCafi', JSON.stringify(token));
			props.history.push('/ventas/venta-general');
		} catch (error) {
			setAlert({ message: error.message, status: 'error', open: true });
			setLoading(false);
		}
	};

	const obtenerCampos = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Container maxWidth="sm">
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Box height="100vh" display="flex" justifyContent="center" alignItems="center">
				<Box boxShadow="3" p={3} width="80%">
					<Box display='flex' justifyContent='center' alignItems='center' justifyItems='center' >
						<Box className={classes.containerImagen} textAlign='center'>
							<img className={classes.imagen} src={ab} alt="imagen no disponible" />
						</Box>
					</Box>
					<Box display='flex' textAlign='center' justifyContent='center'>
						<Typography variant="h4" component="p" className={classes.margin}>
							<b>Inicia sesión</b>
						</Typography>
					</Box>
					<form autocomplete="on" onSubmit={signin} className={classes.input}>
						<TextField
							label="Numero de usuario"
							variant="outlined"
							name="numero_usuario"
							type="number"
							fullWidth
							className={classes.margin}
							onChange={obtenerCampos}
						/>

						<FormControl variant="outlined" name="password" className={classes.margin} fullWidth>
							<InputLabel htmlFor="usuario-password">Contraseña</InputLabel>
							<OutlinedInput
								name="password"
								id="usuario-password"
								type={showPassword ? 'text' : 'password'}
								onChange={obtenerCampos}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
						<Button
							fullWidth
							size="large"
							variant="contained"
							disableElevation
							className={classes.margin}
							color="primary"
							type="submit"
							endIcon={loading ? <CircularProgress size={25} color="inherit" /> : null}
						>
							Entrar
						</Button>
					</form>
				</Box>
			</Box>
		</Container>
	);
}
