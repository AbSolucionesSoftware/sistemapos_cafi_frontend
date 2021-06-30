import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaDepartamentos from './ListaDepartamentos';
import { OBTENER_DEPARTAMENTOS, REGISTRAR_DEPARTAMENTO, ACTUALIZAR_DEPARTAMENTO } from '../../../../gql/Catalogos/departamentos';
import { useMutation, useQuery } from '@apollo/client';
import { CreateDepartamentosContext } from '../../../../context/Catalogos/createDepartamentos'


export default function RegistroDepartamentos() {

	const [data, setdata] = useState({});

	const obtenerDatos = (e) => {
		setdata({
			...data,
			[e.target.name]: e.target.value
		})
	}

	const [ CrearDepartamentos ] = useMutation(REGISTRAR_DEPARTAMENTO);

	const saveData = () => {
		try {
			
		} catch (error) {
			
		}
	}

	return (
		<Box>
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					id="outlined-error-helper-text"
					label="Nombre departamento"
					value={data.nombre_departamento}
					name="nombre_departamento"
					variant="outlined"
					size="small"
                    fullWidth
					onChange={obtenerDatos}
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<TablaDepartamentos />
		</Box>
	);
}
