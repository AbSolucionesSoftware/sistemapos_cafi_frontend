import React, { useState, useContext } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaDepartamentos from './ListaDepartamentos';
import { REGISTRAR_DEPARTAMENTO,  ACTUALIZAR_DEPARTAMENTO  } from '../../../../gql/Catalogos/departamentos';
import { useMutation } from '@apollo/client';
import { CreateDepartamentosContext } from '../../../../context/Catalogos/Departamentos';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';

export default function RegistroDepartamentos() {
	const { data, setData, update, setUpdate, error, setError, accion, setAccion, idDepartamento, setIdDepartamento , setLoading, setAlert, loading, alert} = useContext(CreateDepartamentosContext);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const obtenerDatos = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value
		})
	}

	const [ CrearDepartamentos ] = useMutation(REGISTRAR_DEPARTAMENTO);
	const [ ActualzarDepartamentos ] = useMutation(ACTUALIZAR_DEPARTAMENTO);



	const saveData = async () => {
		try {
			if(!data.nombre_departamentos){
				setError(true);
			    return;
			}else{
				console.log(accion)
				const input = data
				if(accion){
					
					await CrearDepartamentos({
						variables: {
							input,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
						}
					});
				}else{
				    await ActualzarDepartamentos({
						variables: {
							input,
							id: idDepartamento
						}
					}) 
				}
				setUpdate(!update);
				setAccion(true)
				setIdDepartamento("");
				setData({
					nombre_departamentos: ""
				});
                setAlert({ message: '¡Listo!', status: 'success', open: true });
                setError(false);
                setLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Box>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<BackdropComponent loading={loading} setLoading={setLoading} />
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					id="outlined-error-helper-text"
					label="Nombre departamento"
					value={data.nombre_departamentos}
					name="nombre_departamentos"
					variant="outlined"
					size="small"
                    fullWidth
					onChange={obtenerDatos}
					error={error}
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation onClick={saveData} >
					<Add />Guardar
				</Button>
			</Box>
			<TablaDepartamentos  />
		</Box>
	); 
}
