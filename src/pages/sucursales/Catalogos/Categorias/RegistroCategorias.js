import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, fade } from '@material-ui/core';
import { Box, Button, Divider, IconButton, TextField, CircularProgress, Typography } from '@material-ui/core';
import { Add, Delete, Edit, ExpandMore, Close } from '@material-ui/icons';
import ErrorPage from '../../../../components/ErrorPage';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
 
import { useQuery, useMutation } from '@apollo/client';
import {
	OBTENER_CATEGORIAS,
	CREAR_CATEGORIA,
	CREAR_SUBCATEGORIA,
	ACTUALIZAR_SUBCATEGORIA,
	ACTUALIZAR_CATEGORIA, 
	ELIMINAR_CATEGORIA,
	ELIMINAR_SUBCATEGORIA
} from '../../../../gql/Catalogos/categorias';

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
	const [ categoria, setCategoria ] = useState('');
	const [ toUpdateID, setToUpdateID ] = useState('');
	const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

	/* Queries */
	const { loading, data, error, refetch } = useQuery(OBTENER_CATEGORIAS, {
		variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id }
	});
	/*  Categorias Mutations */
	const [ crearCategoria ] = useMutation(CREAR_CATEGORIA);
	const [ actualizarCategoria ] = useMutation(ACTUALIZAR_CATEGORIA);

	if (loading)
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="30vh">
				<CircularProgress />
			</Box>
		);
	if (error) {
		return <ErrorPage error={error} />;
	}

	const { obtenerCategorias } = data;
	const render_categorias = obtenerCategorias.map((categoria, index) => (
		<RenderCategorias
			key={index}
			categoria={categoria}
			setToUpdateID={setToUpdateID}
			setCategoria={setCategoria}
			refetch={refetch}
			toUpdateID={toUpdateID}
		/>
	));

	const obtenerDatos = (e) => {
		setCategoria(e.target.value);
	};

	const guardarCategoria = async () => {
		if (!categoria) return;
		setLoadingBackDrop(true);
		try {
			if (!toUpdateID) {
				await crearCategoria({
					variables: {
						input: {
							categoria,
							empresa: sesion.empresa._id,
							sucursal: sesion.sucursal._id
						}
					}
				});
			} else {
				await actualizarCategoria({
					variables: {
						input: {
							categoria
						},
						idCategoria: toUpdateID
					}
				});
			}
			refetch();
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoadingBackDrop(false);
			setCategoria('');
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
			<Typography variant="h6">Categorias</Typography>
			<Box display="flex" alignItems="center" mb={2}>
				<TextField value={categoria} variant="outlined" size="small" onChange={obtenerDatos} />
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation onClick={guardarCategoria}>
					<Add />Guardar
				</Button>
			</Box>
			{render_categorias}
		</div>
	);
}

const RenderCategorias = ({ categoria, setToUpdateID, setCategoria, refetch, toUpdateID }) => {
	const classes = useStyles();
	const [ subcategoria, setSubcategoria ] = useState('');
	const [ loadingBackDrop, setLoadingBackDrop ] = useState(false);
	const [ alert, setAlert ] = useState({ message: '', status: '', open: false });

	/*  Subcategorias Mutations */
	const [ crearSubcategoria ] = useMutation(CREAR_SUBCATEGORIA);
	const [ actualizarSubcategoria ] = useMutation(ACTUALIZAR_SUBCATEGORIA);
	const [ eliminarCategoria ] = useMutation(ELIMINAR_CATEGORIA);


	const render_subcategorias = categoria.subcategorias.map((subcategoria) => (
		<RenderSubcategorias
			key={subcategoria._id}
			idCategoria= {categoria._id}
			subcategoria={subcategoria}
			setToUpdateID={setToUpdateID}
			toUpdateID={toUpdateID}
			setSubcategoria={setSubcategoria}
			setAlert={setAlert}
			refetch={refetch}
		/>
	));

	const obtenerCamposParaActualizar = (event) => {
		event.stopPropagation();
		setToUpdateID(categoria._id);
		setCategoria(categoria.categoria);
	};

	const cancelarUpdate = (event) => {
		event.stopPropagation();
		setToUpdateID('');
		setCategoria('');
	};

	const obtenerDatos = (e) => {
		setSubcategoria(e.target.value);
	};

	const guardarSubcategoria = async () => {
		if (!subcategoria) return;
		setLoadingBackDrop(true);
		let msgAlert = '';
		let resp;
		try {
			if (!toUpdateID) {
				resp = await crearSubcategoria({
					variables: {
						input: {
							subcategoria
						},
						idCategoria: categoria._id
					}
				});
				msgAlert = ( resp.data.crearSubcategoria.message === 'false' ) ? { message: '¡Listo!', status: 'success', open: true }: { message: resp.data.crearSubcategoria.message, status: 'error', open: true }
			} else {
				resp = await actualizarSubcategoria({
					variables: {
						input: {
							subcategoria
						},
						idCategoria: categoria._id,
						idSubcategoria: toUpdateID
					}
				});
				msgAlert =( resp.data.actualizarSubcategoria.message === 'false' ) ? { message: '¡Listo!', status: 'success', open: true }: { message: resp.data.actualizarSubcategoria.message, status: 'error', open: true }
			}
			refetch();
			
			setAlert(msgAlert);
			setLoadingBackDrop(false);
			setSubcategoria('');
			setToUpdateID('');
		} catch (error) {
			console.log(error);
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoadingBackDrop(false);
		}
	};

	const handleDelete = async (event) => {
		event.stopPropagation()
		try {
			const resp = await eliminarCategoria({
				variables: {
					idCategoria: categoria._id
				}
			});
			let msgAlert = ( resp.data.eliminarCategoria.message === 'false' ) ? { message: '¡Listo!', status: 'success', open: true }: { message: resp.data.eliminarCategoria.message, status: 'error', open: true }
			
			setAlert(msgAlert);
			refetch();
		
		} catch (error) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
		}
	};


	return (
		<Fragment>
			<SnackBarMessages alert={alert} setAlert={setAlert} />
			<BackdropComponent loading={loadingBackDrop} setLoading={setLoadingBackDrop} />
			<Accordion>
				<AccordionSummary
					className={toUpdateID && toUpdateID === categoria._id ? classes.selected : ''}
					expandIcon={<ExpandMore />}
					aria-label="Expand"
					aria-controls={`categoria-action-${categoria._id}`}
					id={`categoria-${categoria._id}`}
				>
					<Box display="flex" alignItems="center" width="100%">
						<Typography variant="h6">{categoria.categoria}</Typography>
						<div className={classes.flexGrow} />
						{toUpdateID && toUpdateID === categoria._id ? (
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
							onClick={(event) => handleDelete(event)}
							onFocus={(event) => handleDelete(event)}
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
							<Typography variant="h6">Subcategorias</Typography>
							<Box mr={2} />
							<Box display="flex" alignItems="center" mb={2}>
								<TextField
									value={subcategoria}
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
									onClick={guardarSubcategoria}
								>
									<Add />Guardar
								</Button>
							</Box>
						</Box>
						<Box ml={5}>{render_subcategorias}</Box>
					</Box>
				</AccordionDetails>
			</Accordion>
		</Fragment>
	);
};

const RenderSubcategorias = ({ subcategoria,idCategoria, toUpdateID, setToUpdateID, setSubcategoria,setAlert, refetch }) => {
	const classes = useStyles();
	const [ eliminarSubcategoria ] = useMutation(ELIMINAR_SUBCATEGORIA);
	const obtenerCamposParaActualizar = (event) => {
		window.scrollTo();
		event.stopPropagation();
		setToUpdateID(subcategoria._id);
		setSubcategoria(subcategoria.subcategoria);
	};

	const cancelarUpdate = (event) => {
		event.stopPropagation();
		setToUpdateID('');
		setSubcategoria('');
	};
	const handleDelete = async (event) => {
		try {
			event.stopPropagation()
			const resp = await eliminarSubcategoria({
				variables: {
					idCategoria: idCategoria,
					idSubcategoria:subcategoria._id
				}
			});
			
			let msgAlert = ( resp.data.eliminarSubcategoria.message === 'false' ) ? { message: '¡Listo!', status: 'success', open: true }: { message: resp.data.eliminarSubcategoria.message, status: 'error', open: true }
		
			setAlert(msgAlert);
			
			refetch();
		
		} catch (error) {
			setAlert({ message: 'Ocurrió un error', status: 'error', open: true });
		}
	};
	return (
		<Fragment>
			<Box
				display="flex"
				alignItems="center"
				borderRadius={3}
				px={1}
				className={toUpdateID && toUpdateID === subcategoria._id ? classes.selected : ''}
			>
				<Typography>{subcategoria.subcategoria}</Typography>
				<div className={classes.flexGrow} />
				{toUpdateID && toUpdateID === subcategoria._id ? (
					<IconButton onClick={cancelarUpdate} onFocus={(event) => event.stopPropagation()}>
						<Close />
					</IconButton>
				) : (
					<IconButton onClick={obtenerCamposParaActualizar} onFocus={(event) => event.stopPropagation()}>
						<Edit />
					</IconButton>
				)}
				<IconButton onClick={(event) => handleDelete(event) }>
					<Delete />
				</IconButton>
			</Box>
			<Divider />
		</Fragment>
	);
};
