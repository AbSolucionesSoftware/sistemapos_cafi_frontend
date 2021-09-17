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
		width: 170,
		height: 170
	}
}));

export default function LayoutLogin(props) {
	const classes = useStyles();
	const sesion = localStorage.getItem('sesionCafi');
	const [ datos, setDatos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [ showPassword, setShowPassword ] = useState(false);

	if (sesion) props.history.push('/home');

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
					input: datos
				}
			});
			const { token } = result.data.logearUsuario;
			const decoded = jwt_decode(token);
			setLoading(false);
			localStorage.setItem('sesionCafi', JSON.stringify(decoded));
			localStorage.setItem('tokenCafi', JSON.stringify(token));
			props.history.push('/home');
		} catch (error) {
			setAlert({ message: error.message, status: 'error', open: true });
			setLoading(false);
		}
	};

	const obtenerCampos = (e) => {
		if (e.target.name === 'numero_usuario') {
			setDatos({
				...datos,
				[e.target.name]: parseInt(e.target.value)
			});
		} else {
			setDatos({
				...datos,
				[e.target.name]: e.target.value
			});
		}
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
				<Box boxShadow="3" p={5} width="80%">
					<Box className={classes.containerImagen}>
						<img className={classes.containerImagen} src={ab} alt="imagen no disponible" />
					</Box>
					<Box display='flex' textAlign='center' justifyContent='center'>
						<Typography variant="h4" component="p" className={classes.margin}>
							<b>Inicia sesión</b>
						</Typography>
					</Box>
					<form autoComplete="off" onSubmit={signin} >
						<TextField
							label="Numero de usuario"
							variant="outlined"
							name="numero_usuario"
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
