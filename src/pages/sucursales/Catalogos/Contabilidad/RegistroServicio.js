import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import ListaServicios from './ListaServicios';
import { REGISTRAR_CONTABILIDAD, ACTUALIZAR_CONTABILIDAD } from '../../../../gql/Catalogos/contabilidad';
import { useMutation } from '@apollo/client';
import SnackBarMessages from '../../../../components/SnackBarMessages';

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	flexGrow: {
		flexGrow: 1
	}
});

export default function RegistroServicios() {
	const classes = useStyles();
	const [updateData, setUpdateData] = useState(false);
	const [data, setData] = useState({
		nombre_servicio: ""
	});
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [error, setError] = useState(false);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [accion, setAccion] = useState(true);
	const [idService, setIdService] = useState('')

	const [ CrearContabilidad ] = useMutation(REGISTRAR_CONTABILIDAD);
	const [ ActualizarContabilidad ] = useMutation(ACTUALIZAR_CONTABILIDAD);

	const handleChangeInput = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async () => {
		try {
			if(!data.nombre_servicio){
				setError(true);
			    return;
			}else{
				const input = data;
				if(accion){
					await CrearContabilidad({
						variables: {
							input,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id,
							usuario: sesion._id
						}
					});
				}else{
					// console.log(accion);
					// console.log(idService);
					await ActualizarContabilidad({
						variables: {
							input,
							id: idService
						}
					})
					setAccion(true);
				}
				setAlert({ message: '¡Listo!', status: 'success', open: true });
				setData({nombre_servicio: ""});
				setUpdateData(!updateData);
				setIdService("");
			}
		} catch (error) {
			
		}
	}

	const pressEnter = (e) => {
		if (e.key === 'Enter') handleSubmit();
	};

	return (
		<div className={classes.root}>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Typography variant="h6">Tipo de Servicio</Typography>
			<Box display="flex" alignItems="center" mb={2}>
				<TextField
					error={error}
					id="outlined-error-helper-text"
					variant="outlined"
					size="small"
					name="nombre_servicio"
					value={data.nombre_servicio}
					onChange={handleChangeInput}
					onKeyPress={pressEnter}
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" onClick={handleSubmit} disableElevation>
					<Add />Guardar
				</Button>
			</Box>

			<ListaServicios 
				setData={setData} 
				idService={idService} 
				setIdService={setIdService} 
				setAccion={setAccion} 
				updateData={updateData}
				setAlert={setAlert} 
			/>
		</div>
	);
}
