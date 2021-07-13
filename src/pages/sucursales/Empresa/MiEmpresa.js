import React, { useContext, useState, useEffect } from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import tallasIcon from '../../../icons/tallas.svg';
import shirtIcon from '../../../icons/shirt.svg';
import shoesIcon from '../../../icons/shoes.svg';
import { makeStyles } from '@material-ui/core/styles';
import InformacionFiscal from './InformacionFiscal/InformacionFiscal';
import { EmpresaContext } from '../../../context/Catalogos/empresaContext';
import Datos from './Datos/MisDatos';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_DATOS_EMPRESA } from '../../../gql/Empresa/empresa';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper,
	
	},
	appBar: {
		position: 'relative',
		backgroundColor:'white'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	iconSvg: {
		width: 100
	},
	icon: {
		fontSize: 100
	},
	iconSvgSecondary: {
		width: 50
	}
}));

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`
	};
}

export default function MiEmpresa() {
	const classes = useStyles();
	const [ value, setValue ] = useState(0);
	const [ idEmpresa, setIdEmpresa ] = useState(0);
	const { setEmpresa, update } = useContext(EmpresaContext);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const handleChange = (event, newValue) => setValue(newValue);
	
	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_DATOS_EMPRESA, {
		variables: { id: sesion.empresa._id }
	});


	useEffect(() => {
		try {
			refetch();
			//console.log("SESSIONREFECT", data)
			//console.log("DATA " , data.obtenerEmpresa)
		} catch (errorf) {
			console.log("SESSIONREFECT",error)
		}
	},[update,refetch]);

	useEffect(() => {
		try {
			
			
			setEmpresa(data.obtenerEmpresa)
		} catch (errorf) {
			console.log("SESSIONREFECT",error)
		}
	},[data]);
	

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
