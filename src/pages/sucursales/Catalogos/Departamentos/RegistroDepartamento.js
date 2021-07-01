import React, { useState, useContext } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaDepartamentos from './ListaDepartamentos';
import { OBTENER_DEPARTAMENTOS, REGISTRAR_DEPARTAMENTO, ACTUALIZAR_DEPARTAMENTO } from '../../../../gql/Catalogos/departamentos';
import { useMutation, useQuery } from '@apollo/client';
import { CreateDepartamentosContext } from '../../../../context/Catalogos/createDepartamentos'
import SnackBarMessages from '../../../../components/SnackBarMessages';


export default function RegistroDepartamentos({accion}) {

	const [data, setdata] = useState({
		nombre_departamentos:''
	});
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const { datosDepartamentos, setDatosDepartamentos, error, setError, update, setUpdate } = useContext(CreateDepartamentosContext);
	const [ loading, setLoading ] = useState(false);

	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	// console.log(sesion);

	const obtenerDatos = (e) => {
		setdata({
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
				if(accion === "registrar"){
					console.log(accion);
					const input = data
					console.log({
						input,
						empresa: sesion.empresa._id,
						sucursal: sesion.sucursal._id
					});
					await CrearDepartamentos({
						variables: {
							input,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
						}
					})
					
				}else{
					await ActualzarDepartamentos({
						variables: {
							
						}
					})
				}
				setUpdate(!update);
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
			<TablaDepartamentos />
		</Box>
	);
}
