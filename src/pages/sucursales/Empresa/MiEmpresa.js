import React, { useContext, useEffect } from 'react';
import { Box, Container, Grid } from '@material-ui/core';

import InformacionFiscal from './InformacionFiscal/InformacionFiscal';
import { EmpresaContext } from '../../../context/Catalogos/empresaContext';
import Datos from './Datos/MisDatos';
import { useQuery } from '@apollo/client';
import { OBTENER_DATOS_EMPRESA } from '../../../gql/Empresa/empresa';

export default function MiEmpresa() {
	
	const { setEmpresa, update } = useContext(EmpresaContext);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	
	
	/* Queries */
	const {  data, refetch } = useQuery(OBTENER_DATOS_EMPRESA, {
		variables: { id: sesion.empresa._id }
	});


	useEffect(() => {
		try {
			refetch();
		
		} catch (errorCatch) {
			console.log("SESSIONREFECTUPDATE",errorCatch)
		}
	},[update,refetch]);

	useEffect(() => {
		try {
			setEmpresa(data.obtenerEmpresa)
		} catch (errorCatch) {
			console.log("SESSIONREFECT",errorCatch)
		}
	},[data, setEmpresa]);
	

	return (
		<div>
			<Container>
			<Grid container spacing={5} justify="center">
				
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Datos idEmpresa={sesion.empresa._id} />
					</Box>
				</Grid>
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<InformacionFiscal />
					</Box> 
				</Grid>
			</Grid>
		</Container>
		</div>
	);
}
