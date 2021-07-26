import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, Divider, MenuItem, Select, Container, FormHelperText } from '@material-ui/core';
import { TextField, Typography, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';

import { useMutation } from '@apollo/client';
import { CREAR_CATEGORIA, CREAR_SUBCATEGORIA } from '../../../../gql/Catalogos/categorias';
import { REGISTRAR_DEPARTAMENTO } from '../../../../gql/Catalogos/departamentos';
import { REGISTRAR_MARCAS } from '../../../../gql/Catalogos/marcas';
import SnackBarMessages from '../../../../components/SnackBarMessages';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& .obligatorio': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function RegistroInfoGenerales({ obtenerConsultasProducto, refetch }) {
	const classes = useStyles();
	const { datos_generales, setDatosGenerales, validacion, precios, setPrecios } = useContext(RegProductoContext);
	const { categorias, departamentos, marcas } = obtenerConsultasProducto;
	const [subcategorias, setSubcategorias] = useState([]);

	const obtenerCampos = (e) => {
		if (e.target.name === "monedero_electronico") {
			setPrecios({
				...precios,
				[e.target.name]: parseFloat(e.target.value)
			});
			return
		}
		setDatosGenerales({
			...datos_generales,
			[e.target.name]: e.target.value
		});
	};

	const checkFarmacia = (e) => {
		setDatosGenerales({
			...datos_generales,
			receta_farmacia: e.target.checked
		});
	};

	const obtenerChecks = (e) => {
		if (e.target.name === "monedero" && e.target.checked) {
			setPrecios({
				...precios,
				monedero_electronico: 0,
				monedero: e.target.checked
			});
			return
		}
		setPrecios({
			...precios,
			[e.target.name]: e.target.checked
		});
	};

	const obtenerIDs = (event, child) => {
		setDatosGenerales({
			...datos_generales,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
		if (child.props.categoria) {
			const { subcategorias } = child.props.categoria;
			setSubcategorias(subcategorias);
		}
	};

	const GenCodigoBarras = () => {
		const max = 999999999999;
		const min = 100000000000;
		const codigo_barras = Math.floor(Math.random() * (max - min + 1) + min);
		setDatosGenerales({
			...datos_generales,
			codigo_barras
		});
	};

	return (
		<Fragment>
			<Container maxWidth="lg">
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Código de barras</Typography>
						<Box display="flex">
							<TextField
								fullWidth
								size="small"
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos_generales.codigo_barras ? datos_generales.codigo_barras : ''}
								onChange={obtenerCampos}
							/>
							<Button variant="contained" color="primary" onClick={GenCodigoBarras}>
								Generar
							</Button>
						</Box>
					</Box>
					<Box width="100%">
						<Typography>
							<span className="obligatorio">* </span>Clave alterna
						</Typography>
						<TextField
							fullWidth
							size="small"
							error={validacion.error && !datos_generales.clave_alterna}
							name="clave_alterna"
							id="form-producto-clave-alterna"
							variant="outlined"
							value={datos_generales.clave_alterna ? datos_generales.clave_alterna : ''}
							helperText={validacion.message}
							onChange={obtenerCampos}
						/>
					</Box>
					<Box width="100%">
						<Typography>
							<span className="obligatorio">* </span>Tipo de producto
						</Typography>
						<FormControl
							variant="outlined"
							fullWidth
							size="small"
							error={validacion.error && !datos_generales.tipo_producto}
						>
							<Select
								id="form-producto-tipo"
								name="tipo_producto"
								value={datos_generales.tipo_producto ? datos_generales.tipo_producto : ''}
								onChange={obtenerCampos}
							>
								<MenuItem value="">
									<em>Selecciona uno</em>
								</MenuItem>
								<MenuItem value="ROPA">Ropa</MenuItem>
								<MenuItem value="CALZADO">Calzado</MenuItem>
								<MenuItem value="OTROS">Otros</MenuItem>
							</Select>
							<FormHelperText>{validacion.message}</FormHelperText>
						</FormControl>
					</Box>
					<Box width="100%">
						<Typography>Clave de producto SAT</Typography>
						<Box display="flex">
							<TextField
								size="small"
								fullWidth
								name="clave_producto_sat"
								id="form-producto-clave-sat"
								variant="outlined"
								value={datos_generales.clave_producto_sat ? datos_generales.clave_producto_sat : ''}
								onChange={obtenerCampos}
							/>
							<Button color="primary">
								<Add />
							</Button>
						</Box>
					</Box>
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>
							<span className="obligatorio">* </span>Nombre comercial
						</Typography>
						<TextField
							fullWidth
							size="small"
							error={validacion.error && !datos_generales.nombre_comercial}
							name="nombre_comercial"
							id="form-producto-nombre-comercial"
							variant="outlined"
							value={datos_generales.nombre_comercial ? datos_generales.nombre_comercial : ''}
							helperText={validacion.message}
							onChange={obtenerCampos}
						/>
					</Box>
					<Box width="100%">
						<Typography>
							<span className="obligatorio">* </span>Nombre genérico
						</Typography>
						<TextField
							fullWidth
							size="small"
							error={validacion.error && !datos_generales.nombre_generico}
							name="nombre_generico"
							id="form-producto-nombre-generico"
							variant="outlined"
							value={datos_generales.nombre_generico ? datos_generales.nombre_generico : ''}
							helperText={validacion.message}
							onChange={obtenerCampos}
						/>
					</Box>
					<Box width="100%">
						<Typography>Descripción</Typography>
						<TextField
							fullWidth
							size="small"
							name="descripcion"
							id="form-producto-descripcion"
							variant="outlined"
							value={datos_generales.descripcion ? datos_generales.descripcion : ''}
							onChange={obtenerCampos}
						/>
					</Box>
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Categoria</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select
									id="form-producto-categoria"
									value={datos_generales.categoria ? datos_generales.categoria : ''}
									onChange={(event, child) => obtenerIDs(event, child)}
									name="categoria"
								>
									<MenuItem value="">
										<em>Seleccione uno</em>
									</MenuItem>
									{categorias ? categorias.map((res) => {
										return (
											<MenuItem
												name="id_categoria"
												key={res._id}
												value={res.categoria}
												id={res._id}
												categoria={res}
											>
												{res.categoria}
											</MenuItem>
										);
									}) : (<MenuItem value="" />)}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="categoria" name="categoria" refetch={refetch} />
						</Box>
					</Box>
					<Box width="100%">
						<Typography>Subcategoria</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select
									id="form-producto-subcategoria"
									name="subcategoria"
									value={datos_generales.subcategoria ? datos_generales.subcategoria : ''}
									onChange={(event, child) => obtenerIDs(event, child)}
								>
									<MenuItem value="">
										<em>Seleccione uno</em>
									</MenuItem>
									{subcategorias ? subcategorias.map((res) => {
										return (
											<MenuItem
												name="id_subcategoria"
												key={res._id}
												value={res.subcategoria}
												id={res._id}
											>
												{res.subcategoria}
											</MenuItem>
										);
									}) : <MenuItem value="" />}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect
								tipo="subcategoria"
								name="subcategoria"
								refetch={refetch}
								subcategorias={subcategorias}
								setSubcategorias={setSubcategorias}
							/>
						</Box>
					</Box>
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Departamento</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select
									id="form-producto-departamento"
									name="departamento"
									value={datos_generales.departamento ? datos_generales.departamento : ''}
									onChange={(event, child) => obtenerIDs(event, child)}
								>
									<MenuItem value="">
										<em>Seleccione uno</em>
									</MenuItem>
									{departamentos ? departamentos.map((res) => {
										return (
											<MenuItem
												name="id_departamento"
												key={res._id}
												value={res.nombre_departamentos}
												id={res._id}
											>
												{res.nombre_departamentos}
											</MenuItem>
										);
									}) : <MenuItem value="" />}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="departamento" name="nombre_departamentos" refetch={refetch} />
						</Box>
					</Box>
					<Box width="100%">
						<Typography>Marca</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select
									id="form-producto-marca"
									name="marcas"
									value={datos_generales.marcas ? datos_generales.marcas : ''}
									onChange={(event, child) => obtenerIDs(event, child)}
								>
									<MenuItem value="">
										<em>Seleccione uno</em>
									</MenuItem>
									{marcas ? marcas.map((res) => {
										return (
											<MenuItem
												name="id_marca"
												key={res._id}
												value={res.nombre_marca}
												id={res._id}
											>
												{res.nombre_marca}
											</MenuItem>
										);
									}) : <MenuItem value="" />}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="marca" name="nombre_marca" refetch={refetch} />
						</Box>
					</Box>
				</div>
				<Box display="flex">
					<Box>
						<Box>
							<Typography>
								<b>Granel</b>
							</Typography>
							<Divider />
						</Box>
						<div className={classes.formInput}>
							<FormControlLabel
								control={<Checkbox value={precios.granel ? precios.granel : false} onChange={obtenerChecks} name="granel" />}
								label="Vender a granel"
							/>
						</div>
					</Box>
					<Box>
						<Box>
							<Typography>
								<b>Farmacia</b>
							</Typography>
							<Divider />
						</Box>
						<div className={classes.formInput}>
							<FormControlLabel
								control={
									<Checkbox
										/* checked={datos_generales.receta_farmacia ? datos_generales.receta_farmacia : false} */
										value={datos_generales.receta_farmacia ? datos_generales.receta_farmacia : false}
										onChange={checkFarmacia}
										name="receta_farmacia"
									/>
								}
								label="Necesita receta"
								name="receta_farmacia"
							/>
						</div>
					</Box>
					<Box>
						<Box>
							<Typography>
								<b>Monedero eléctronico</b>
							</Typography>
							<Divider />
						</Box>
						<Box>
							<Box className={classes.formInput}>
								<FormControlLabel
									control={
										<Checkbox value={precios.monedero ? precios.monedero : false} onChange={obtenerChecks} name="monedero" />
									}
									label="Monedero electrónico"
								/>
								<TextField
									type="number"
									InputProps={{ inputProps: { min: 0 } }}
									size="small"
									label="Valor por punto"
									name="monedero_electronico"
									id="form-producto-monedero_electronico"
									variant="outlined"
									value={precios.monedero_electronico ? precios.monedero_electronico : 0}
									onChange={obtenerCampos}
									disabled={precios.monedero ? false : true}
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>
		</Fragment>
	);
}

const RegistrarNuevoSelect = ({ tipo, name, refetch, subcategorias, setSubcategorias }) => {
	const [open, setOpen] = useState(false);
	const [validacion, setValidacion] = useState(false);
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState('');
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
	const [alert, setAlert] = useState({ message: '', status: '', open: false });

	/*  Categorias Mutation */
	const [crearCategoria] = useMutation(CREAR_CATEGORIA);
	/*  Subcategorias Mutation */
	const [crearSubcategoria] = useMutation(CREAR_SUBCATEGORIA);
	/*  Departamentos Mutation */
	const [CrearDepartamentos] = useMutation(REGISTRAR_DEPARTAMENTO);
	/*  Marcas Mutation */
	const [CrearMarca] = useMutation(REGISTRAR_MARCAS);

	const handleToggle = () => {
		setOpen(!open);
	};

	const obtenerDatos = (e) => {
		setValue(e.target.value);
	};

	const guardarDatos = async () => {
		if (!value) {
			setValidacion(true);
			return;
		}
		let variables = {
			input: {
				[name]: value
			},
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		};
		if (tipo === 'categoria') {
			variables = {
				input: {
					[name]: value,
					empresa: sesion.empresa._id,
					sucursal: sesion.sucursal._id
				}
			};
		}
		if (tipo === 'subcategoria') {
			variables = {
				input: {
					[name]: value
				},
				idCategoria: datos_generales.id_categoria
			};
		}
		setLoading(true);
		try {
			switch (tipo) {
				case 'categoria':
					const categoria_creada = await crearCategoria({ variables });
					refetch();
					const id_categoria = categoria_creada.data.crearCategoria._id;
					setDatosGenerales({
						...datos_generales,
						categoria: value,
						id_categoria
					});
					break;
				case 'subcategoria':
					const subcategoria_creada = await crearSubcategoria({ variables });
					refetch();
					const id_subcategoria = subcategoria_creada.data.crearSubcategoria.message;
					setSubcategorias([...subcategorias, { _id: id_subcategoria, subcategoria: value }]);
					setDatosGenerales({
						...datos_generales,
						subcategoria: value,
						id_subcategoria
					});
					break;
				case 'departamento':
					const departamento_creado = await CrearDepartamentos({ variables });
					refetch();
					const id_departamento = departamento_creado.data.crearDepartamentos.message;
					setDatosGenerales({
						...datos_generales,
						departamento: value,
						id_departamento
					});
					break;
				case 'marca':
					const marca_creada = await CrearMarca({ variables });
					refetch();
					const id_marca = marca_creada.data.crearMarcas.message;
					setDatosGenerales({
						...datos_generales,
						marcas: value,
						id_marca
					});
					break;
				default:
					break;
			}
			setAlert({ message: '¡Listo!', status: 'success', open: true });
			setLoading(false);
			handleToggle();
		} catch (error) {
			setAlert({ message: 'Hubo un error', status: 'error', open: true });
			setLoading(false);
			console.log(error);
		}
	};

	return (
		<Fragment>
			<Button
				color="primary"
				onClick={handleToggle}
				disabled={tipo === 'subcategoria' && !datos_generales.id_categoria}
			>
				<Add />
			</Button>
			<Dialog open={open} onClose={handleToggle} aria-labelledby={`modal-title-${tipo}`}>
				<SnackBarMessages alert={alert} setAlert={setAlert} />
				<DialogTitle id={`modal-title-${tipo}`}>Registrar {tipo}</DialogTitle>
				<DialogContent>
					<TextField
						error={validacion}
						name={name}
						autoFocus
						label={tipo}
						fullWidth
						variant="outlined"
						onChange={obtenerDatos}
						helperText={validacion ? 'Campo obligatorio' : ''}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleToggle} color="primary">
						Cancelar
					</Button>
					<Button
						onClick={guardarDatos}
						variant="contained"
						color="primary"
						endIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
