import React from 'react';
import { Box, Button, Container, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	margin: {
		marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
	},
}));

export default function LayoutLogin(props) {
	const classes = useStyles();
    const sesion = localStorage.getItem('sesionCafi');

    if(sesion) props.history.push('/home');

    const signin = () => {
		const user = {
			name: "aldo",
			empresa: "60c120b6a694891f58d32a1d",
			sucursal: "60c8e180340d5d223432a916"
		}
        localStorage.setItem("sesionCafi", JSON.stringify(user));
        props.history.push('/home');
    }

	return (
		<Container maxWidth="sm">
			<Box height="100vh" display="flex" justifyContent="center" alignItems="center">
				<Box boxShadow="3" p={5} width="100%">
					<Typography variant="h6" component="p" className={classes.margin}>
						Inicia sesión
					</Typography>
					<TextField label="Usuario" variant="outlined" fullWidth className={classes.margin} />
					<TextField label="Contraseña" variant="outlined" fullWidth className={classes.margin} />
					<Button fullWidth size="large" variant="contained" disableElevation className={classes.margin} onClick={signin}>
						Entrar
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
