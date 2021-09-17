import React, {useState, useEffect} from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useMutation, useQuery } from '@apollo/client';
import TablaCajas from './ListaCajas';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import { CREAR_CAJA, OBTENER_CAJAS, ELIMINAR_CAJA } from '../../../../gql/Cajas/cajas';

export default function RegistroCajas() {
	const [ loading, setLoading ] = React.useState(false);
    const [ open, setOpen ] = React.useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	let obtenerCajasSucursal = [];
	  /* Mutation */
	const [ crearCaja ] = useMutation(CREAR_CAJA);
	const [ eliminarCaja ] = useMutation(ELIMINAR_CAJA);


	  /* Queries */
	const {  data, error, refetch } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	
	const nuevaCaja = async () => {
		try {
			// console.log(sesion.numero_usuario, sesion.nombre)
            setLoading(true);
				await crearCaja({
					variables: {
						input:{usuario_creador:  sesion._id, numero_usuario_creador: sesion.numero_usuario, nombre_usuario_creador: sesion.nombre},
						empresa: sesion.empresa._id,
						sucursal: sesion.sucursal._id
		
					}
				});
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
		
			
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};
	
	const deleteCaja = async (id) => {
		try {
			// console.log(id)
            setLoading(true);
				await eliminarCaja({
					variables: {
						id: id
					}
				});
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
		}
	};
	
	if(data){
		obtenerCajasSucursal = data.obtenerCajasSucursal;
	}

	useEffect(
		() => {
			setLoading(true);
			refetch();
			setLoading(false);
		},
		[ refetch ]
	); 

	return (
		<Box>
			<SnackBarMessages alert={alert} setAlert={setAlert} />	
			<BackdropComponent loading={loading} setLoading={setLoading} />
			<Box display="flex" justifyContent="left" alignItems="left" my={2}>
			
				<Box ml={1} />
				{sesion.accesos.catalogos.cajas.agregar === false ? (null):(
					<Button color="primary" variant="contained" size="large" disableElevation onClick={() => nuevaCaja()}>
						<Add />Agregar
					</Button>
				)}
			</Box>
			<TablaCajas obtenerCajasSucursal={obtenerCajasSucursal} deleteCaja={deleteCaja} />
		</Box>
	);
}
