import React, { useState, useContext } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaDepartamentos from './ListaDepartamentos';
import { /* OBTENER_DEPARTAMENTOS, */ REGISTRAR_DEPARTAMENTO, /* ACTUALIZAR_DEPARTAMENTO */ } from '../../../../gql/Catalogos/departamentos';
import { useMutation/* , useQuery */ } from '@apollo/client';
import { CreateDepartamentosContext } from '../../../../context/Catalogos/Departamentos';
import SnackBarMessages from '../../../../components/SnackBarMessages';


export default function RegistroDepartamentos({accion}) {

	const [data, setdata] = useState({
		nombre_departamentos:''
	});
	const [updateData, setUpdateData] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const { /* datosDepartamentos, setDatosDepartamentos, */ error, setError } = useContext(CreateDepartamentosContext);
	const [ /* loading, */ setLoading ] = useState(false);

	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const obtenerDatos = (e) => {
		setdata({
			...data,
			[e.target.name]: e.target.value
		})
	}

	const [ CrearDepartamentos ] = useMutation(REGISTRAR_DEPARTAMENTO);
	// const [ ActualzarDepartamentos ] = useMutation(ACTUALIZAR_DEPARTAMENTO);


	const saveData = async () => {
		try {
			if(!data.nombre_departamentos){
				setError(true);
			    return;
			}else{
				if(accion === "registrar" ){
					if (sesion.accesos.catalogos.departamentos.agregar === false) {
						return setAlert({ message: '¡Lo sentimos no tienes autorización para esta acción!', status: 'eror', open: true });
					}else{
						const input = data
						await CrearDepartamentos({
							variables: {
								input,
								empresa: sesion.empresa._id,
								sucursal: sesion.sucursal._id
							}
						});
					}

				}else{
					if (sesion.accesos.catalogos.departamentos.editar === false) {
						return setAlert({ message: '¡Lo sentimos no tienes autorización para esta acción!', status: 'eror', open: true });
					}else{
						/* await ActualzarDepartamentos({
							variables: {
								
							}
						}) */
					}
				}
				setUpdateData(!updateData);
				// setUpdate(!update);
                setAlert({ message: '¡Listo!', status: 'success', open: true });
                setError(false);
                setLoading(false);
			}
		} catch (error) {
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
			<TablaDepartamentos updateData={updateData} />
		</Box>
	);
}
