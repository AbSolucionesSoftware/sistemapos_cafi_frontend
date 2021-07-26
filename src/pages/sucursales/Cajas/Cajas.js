import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import CardCaja from './CardCaja';

import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '../../../gql/Cajas/cajas';

export default function Cajas() {

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    let obtenerCajasSucursal = [];

    console.log(sesion);
    /* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

    if(data){
		obtenerCajasSucursal = data.obtenerMarcas
	}

    console.log(obtenerCajasSucursal);

    return (
        <Container>
			<Grid container spacing={1} justify="center" >
				<Box>
                    <CardCaja />
                </Box>
			</Grid>
		</Container>
    )
}
