import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaTallas from './ListaTallas';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import ErrorPage from '../../../../components/ErrorPage';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_TALLAS, CREAR_TALLAS, ACTUALIZAR_TALLA } from '../../../../gql/Catalogos/tallas';

export default function RegistroTallas({ tipo }) {
	const [ value, setValue ] = useState('');
	const [ toUpdate, setToUpdate ] = useState('');
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_TALLAS, {
		variables: { sucursal: sesion.sucursal._id, tipo }
	});
	/* Mutations */
	const [ crearTalla ] = useMutation(CREAR_TALLAS);
	const [ actualizarTalla ] = useMutation(ACTUALIZAR_TALLA);

	React.useEffect(
		() => {
			
			refetch();
		
		},
		[ refetch ]
	);
	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}


	const { obtenerTallas } = data;

	const GuardarDatosBD = async () => {
		if (!value) {
			return;
		}
		try {
			const nueva_talla = value;
			if(toUpdate){
				await actualizarTalla({
					variables: {
						input: {
							talla: nueva_talla,
						},
						id: toUpdate
					}
				});
			}else{
				await crearTalla({
					variables: {
						input: {
							talla: nueva_talla,
							tipo,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
						}
					}
				});
			}
			refetch();
			setValue('');
			setToUpdate('');
			setAlert({ message: '¡Listo!', status: 'success', open: true });
		} catch (error) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
		}
	};

	return (
		<Box>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					id="outlined-error-helper-text"
					label={tipo === 'ROPA' ? 'Talla' : 'Número'}
					variant="outlined"
					size="small"
					value={value}
					onChange={(e) => setValue(e.target.value.toUpperCase())}
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation onClick={GuardarDatosBD}>
					<Add />Guardar
				</Button>
			</Box>
			<TablaTallas datos={obtenerTallas} tipo={tipo} toUpdate={toUpdate} setToUpdate={setToUpdate} setValue={setValue} refetch={refetch} />
		</Box>
	);
}
