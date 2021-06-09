import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaTallas from './ListaTallas';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_TALLAS, CREAR_TALLAS, ACTUALIZAR_TALLA } from '../../../../gql/Catalogos/tallas';

export default function RegistroTallas({ tipo }) {
	const [ value, setValue ] = useState('');
	const [ toUpdate, setToUpdate ] = useState('');
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const empresa = '609eb3b4b995884dc49bbffa';

	/* Queries */
	const { loading, data, error } = useQuery(OBTENER_TALLAS, {
		variables: { empresa, tipo }
	});
	/* Mutations */
	const [ crearTalla ] = useMutation(CREAR_TALLAS, {
		update(cache, { data: { crearTalla } }) {
			const { obtenerTallas } = cache.readQuery({
				query: OBTENER_TALLAS,
				variables: { empresa, tipo }
			});

			cache.writeQuery({
				query: OBTENER_TALLAS,
				variables: { empresa, tipo },
				data: {
					obtenerTallas: {
						...obtenerTallas,
						crearTalla
					}
				}
			});
		}
	});
	const [ actualizarTalla ] = useMutation(ACTUALIZAR_TALLA, {
		update(cache, { data: { actualizarTalla } }) {
			const { obtenerTallas } = cache.readQuery({
				query: OBTENER_TALLAS,
				variables: { empresa, tipo }
			});

			cache.writeQuery({
				query: OBTENER_TALLAS,
				variables: { empresa, tipo },
				data: {
					obtenerTallas: {
						...obtenerTallas,
						actualizarTalla
					}
				}
			});
		}
	});

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <div>
			
			hubo un error
		</div>;
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
							tipo,
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
							empresa
						}
					}
				});
			}
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
			<TablaTallas datos={obtenerTallas} tipo={tipo} toUpdate={toUpdate} setToUpdate={setToUpdate} setValue={setValue} />
		</Box>
	);
}
