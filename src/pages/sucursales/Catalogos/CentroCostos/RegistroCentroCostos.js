import React, { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, fade } from '@material-ui/core';
import { Box, Button, Divider, IconButton, TextField, CircularProgress, Typography } from '@material-ui/core';
import { Add, Delete, Edit, ExpandMore, Close } from '@material-ui/icons';
import ErrorPage from '../../../../components/ErrorPage';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';

import { useQuery, useMutation } from '@apollo/client';
import {
	OBTENER_COSTOS,
	CREAR_COSTO,
	CREAR_SUBCOSTO,
	ACTUALIZAR_SUBCOSTO,
	ACTUALIZAR_COSTO,
    ELIMINAR_COSTO,
    ELIMINAR_SUBCOSTO
} from '../../../../gql/Catalogos/centroCostos';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	flexGrow: {
		flexGrow: 1
	},
	selected: {
		background: fade(theme.palette.secondary.main, 0.1)
	}
}));

export default function RegistroCategorias() {
	const classes = useStyles();
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [ costo, setCosto ] = useState('');
	const [ toUpdateID, setToUpdateID ] = useState('');
	const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_COSTOS, {
		variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id }
	});
	/*  Categorias Mutations */
	const [ crearCosto ] = useMutation(CREAR_COSTO);
	const [ actualizarCosto ] = useMutation(ACTUALIZAR_COSTO);
   
  

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}

	const { obtenerCostos } = data;
	const render_costos = obtenerCostos.map((costo, index) => (
		<RenderCostos
			key={index}
			costo={costo}
			setToUpdateID={setToUpdateID}
			setCosto={setCosto}
			refetch={refetch}
			toUpdateID={toUpdateID}
		/>
	));

	const obtenerDatos = (e) => {
		setCosto(e.target.value);
	};
    
	const guardarCosto = async () => {
		if (!costo) return;
		setLoadingBackDrop(true);
		try {
			if (!toUpdateID) {
				await crearCosto({
					variables: {
						input: {
							costo,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
						}
					}
				});
			} else {
				await actualizarCosto({
					variables: {
						input: {
							costo
						},
						idCosto: toUpdateID
					}
				});
			}
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoadingBackDrop(false);
			setCosto('');
			setToUpdateID('');
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoadingBackDrop(false);
		}
	};

    
	return (
		<div className={classes.root}>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<BackdropComponent loading={loadingBackDrop} setLoading={setLoadingBackDrop} />
			<Typography variant="h6">Costos</Typography>
			<Box display="flex" alignItems="center" mb={2}>
				<TextField value={costo} variant="outlined" size="small" onChange={obtenerDatos} />
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation onClick={guardarCosto}>
					<Add />Guardar
				</Button>
			</Box>
			{render_costos}
		</div>
	);
}

const RenderCostos = ({ costo, setToUpdateID, setCosto, refetch, toUpdateID }) => {
	const classes = useStyles();
	const [ subcosto, setSubcosto ] = useState('');
	const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
     const [ eliminarCosto ] = useMutation(ELIMINAR_COSTO);
	/*  Subcategorias Mutations */
	const [ crearSubcosto ] = useMutation(CREAR_SUBCOSTO);
	const [ actualizarSubcosto ] = useMutation(ACTUALIZAR_SUBCOSTO);
   
	
    const render_subcostos = costo.subcostos.map((subcosto) => (
		<RenderSubcostos
			key={subcosto._id}
            idCosto={costo._id}
			subcosto={subcosto}
			setToUpdateID={setToUpdateID}
			toUpdateID={toUpdateID}
			setSubcosto={setSubcosto}
            refetch={refetch}
		/>
	)); 

	const obtenerCamposParaActualizar = (event) => {
		event.stopPropagation();
		setToUpdateID(costo._id);
		setCosto(costo.costo);
	};

	const cancelarUpdate = (event) => {
		event.stopPropagation();
		setToUpdateID('');
		setCosto('');
	};

	const obtenerDatos = (e) => {
		setSubcosto(e.target.value);
	};

	const guardarSubcosto = async () => {
		if (!subcosto) return;
		setLoadingBackDrop(true);
		try {
			if (!toUpdateID) {
				await crearSubcosto({
					variables: {
						input: {
							subcosto
						},
						idCosto: costo._id
					}
				});
			} else {
				await actualizarSubcosto({
					variables: {
						input: {
							subcosto
						},
						idCosto: costo._id,
						idSubcosto: toUpdateID
					}
				});
			}
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoadingBackDrop(false);
			setSubcosto('');
			setToUpdateID('');
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoadingBackDrop(false);
		}
	};
    const deleteCosto = async (idCosto) => {
        
		setLoadingBackDrop(true);
		try {
			
            await eliminarCosto({
                variables: {
                    id: idCosto
                }
            });
		
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoadingBackDrop(false);
			setCosto('');
			setToUpdateID('');
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoadingBackDrop(false);
		}
	};
    

	return (
		<Fragment>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<BackdropComponent loading={loadingBackDrop} setLoading={setLoadingBackDrop} />
			<Accordion>
				<AccordionSummary
					className={toUpdateID && toUpdateID === costo._id ? classes.selected : ''}
					expandIcon={<ExpandMore />}
					aria-label="Expand"
					aria-controls={`costo-action-${costo._id}`}
					id={`costo-${costo._id}`}
				>
					<Box display="flex" alignItems="center" width="100%">
						<Typography variant="h6">{costo.costo}</Typography>
						<div className={classes.flexGrow} />
						{toUpdateID && toUpdateID === costo._id ? (
							<IconButton onClick={cancelarUpdate} onFocus={(event) => event.stopPropagation()}>
								<Close />
							</IconButton>
						) : (
							<IconButton
								onClick={obtenerCamposParaActualizar}
								onFocus={(event) => event.stopPropagation()}
							>
								<Edit />
							</IconButton>
						)}
						<IconButton
							onClick={() => deleteCosto(costo._id )}
							onFocus={(event) => event.stopPropagation()}
						>
							<Delete />
						</IconButton>
					</Box>
				</AccordionSummary>
				<AccordionDetails>
					<Box width="100%">
						<Divider />
						<Box mb={2} />
						<Box ml={5} width="100%" display="flex">
							<Typography variant="h6">Subcostos</Typography>
							<Box mr={2} />
							<Box display="flex" alignItems="center" mb={2}>
								<TextField
									value={subcosto}
									variant="outlined"
									size="small"
									onChange={obtenerDatos}
								/>
								<Box ml={1} />
								<Button
									color="primary"
									variant="contained"
									size="large"
									disableElevation
									onClick={guardarSubcosto}
								>
									<Add />Guardar
								</Button>
							</Box>
						</Box>
                       
                        <Box ml={5}>{render_subcostos}</Box>
                           
						{/* <Box ml={5}>{render_subcostos}</Box> */}
					</Box>
				</AccordionDetails>
			</Accordion>
		</Fragment>
	);
};

const RenderSubcostos = ({ idCosto,subcosto, toUpdateID, setToUpdateID, setSubcosto, refetch }) => {
	const classes = useStyles();
    const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const [ eliminarSubcosto ] = useMutation(ELIMINAR_SUBCOSTO);
	
    const obtenerCamposParaActualizar = (event) => {
		event.stopPropagation();
		setToUpdateID(subcosto._id);
		setSubcosto(subcosto.subcosto);
	};

	const cancelarUpdate = (event) => {
		event.stopPropagation();
		setToUpdateID('');
		setSubcosto('');
	};
    const deleteSubCosto = async ( idSubCosto) => {
        
		setLoadingBackDrop(true);
		try {
			
            await eliminarSubcosto({
                variables: {
                    idCosto: idCosto,
                    idSubcosto: idSubCosto
                }
            });
		
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoadingBackDrop(false);
			setSubcosto('');
			setToUpdateID('');
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoadingBackDrop(false);
		}
	};
    
	return (
		<Fragment>
			<Box
				display="flex"
				alignItems="center"
				borderRadius={3}
				px={1}
				className={toUpdateID && toUpdateID === subcosto._id ? classes.selected : ''}
			>
				<Typography>{subcosto.subcosto}</Typography>
				<div className={classes.flexGrow} />
				{toUpdateID && toUpdateID === subcosto._id ? (
					<IconButton onClick={cancelarUpdate} onFocus={(event) => event.stopPropagation()}>
						<Close />
					</IconButton>
				) : (
					<IconButton onClick={obtenerCamposParaActualizar} onFocus={(event) => event.stopPropagation()}>
						<Edit />
					</IconButton>
				)}
				<IconButton onClick={() => deleteSubCosto(subcosto._id)} onFocus={(event) => event.stopPropagation()}>
					<Delete />
				</IconButton>
			</Box>
			<Divider />
		</Fragment>
	);
};
