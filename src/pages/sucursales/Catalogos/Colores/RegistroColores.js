import React, { useState } from 'react';
import { Box, Button, Grid, CircularProgress, TextField, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaColores from './ListaColores';
import { SketchPicker } from 'react-color';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_COLORES, CREAR_COLOR, ACTUALIZAR_COLOR } from '../../../../gql/Catalogos/colores';

export default function RegistroColores() {
	const [ color, setColor ] = useState({});
	const [ toUpdate, setToUpdate ] = useState('');
	const [ values, setValues ] = useState({ nombre: '', hex: '' });
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_COLORES, {
		variables: { sucursal: sesion.sucursal }
	});

	/* Mutations */
	const [ crearColor ] = useMutation(CREAR_COLOR);
	const [ actualizarColor ] = useMutation(ACTUALIZAR_COLOR);

	const handleChangeComplete = (color) => {
		setColor(color);
		setValues({
			...values,
			hex: color.hex.toUpperCase()
		});
	};

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <div>hubo un error</div>;
	}

	const { obtenerColores } = data;

	const GuardarDatosBD = async () => {
		if (!values.nombre || !values.hex) {
			return;
		}
		try {
			const colores = values;
			if (toUpdate) {
				await actualizarColor({
					variables: {
						input: {
							nombre: colores.nombre,
							hex: colores.hex
						},
						id: toUpdate
					}
				});
			} else {
				await crearColor({
					variables: {
						input: {
							nombre: colores.nombre,
							hex: colores.hex,
							empresa: sesion.empresa,
							sucursal: sesion.sucursal
						}
					}
				});
			}
			refetch();
			setValues({ nombre: '', hex: '' });
			setToUpdate('');
			setAlert({ message: '¡Listo!', status: 'success', open: true });
		} catch (error) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
		}
	};
	

	return (
		<Box display="flex" justifyContent="center">
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<Grid container spacing={2}>
				<Grid item md={4}>
					<SketchPicker color={color} onChangeComplete={handleChangeComplete} />
					<Box mt={2}>
						<Typography>Color seleccionado:</Typography>
						{!values.hex ? (
							<Box display="flex" justifyContent="center" width={220}>
								<Typography color="secondary">NINGUNO</Typography>
							</Box>
						) : (
							<Box bgcolor={values.hex} height={30} width={220} />
						)}
					</Box>
					<Box my={2} width="75%">
						<TextField
							label="Nombre del color"
							variant="outlined"
							size="small"
							value={values.nombre}
							onChange={(e) => setValues({ ...values, nombre: e.target.value.toUpperCase() })}
							fullWidth
						/>
						<Box my={1} />
						<Button color="primary" variant="contained" size="large" fullWidth onClick={GuardarDatosBD}>
							<Add />Guardar
						</Button>
					</Box>
				</Grid>
				<Grid item md={7}>
					<TablaColores
						datos={obtenerColores}
						toUpdate={toUpdate}
						setToUpdate={setToUpdate}
						setValues={setValues}
						refetch={refetch}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
