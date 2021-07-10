import React, { Fragment, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, Divider, MenuItem, Select, Container, FormHelperText } from '@material-ui/core';
import { TextField, Typography, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';

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
	const { datos_generales, setDatosGenerales, validacion } = useContext(RegProductoContext);
	const { categorias, departamentos, marcas } = obtenerConsultasProducto;
	const [ subcategorias, setSubcategorias ] = useState([]);

	const obtenerCampos = (e) => {
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
									{categorias.map((res) => {
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
									})}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="categoria" refetch={refetch} />
						</Box>
					</Box>
					<Box width="100%">
						<Typography>Subcategoria</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select
									id="form-producto-subcategoria"
									name="sub_categoria"
									value={datos_generales.sub_categoria ? datos_generales.sub_categoria : ''}
									onChange={(event, child) => obtenerIDs(event, child)}
								>
									<MenuItem value="">
										<em>Seleccione uno</em>
									</MenuItem>
									{subcategorias.map((res) => {
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
									})}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="subcategoria" refetch={refetch} />
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
									{departamentos.map((res) => {
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
									})}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="departamento" refetch={refetch} />
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
									{marcas.map((res) => {
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
									})}
								</Select>
							</FormControl>
							<RegistrarNuevoSelect tipo="marcas" refetch={refetch} />
						</Box>
					</Box>
				</div>
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
			</Container>
		</Fragment>
	);
}

const RegistrarNuevoSelect = ({ tipo, refetch }) => {
	const [ open, setOpen ] = useState(false);
	const [ value, setalue ] = useState('');

	const handleToggle = () => {
		setOpen(!open);
	};

	const obtenerDatos = () => {
		
	}

	return (
		<Fragment>
			<Button color="primary" onClick={handleToggle}>
				<Add />
			</Button>
			<Dialog open={open} onClose={handleToggle} aria-labelledby={`modal-title-${tipo}`}>
				<DialogTitle id={`modal-title-${tipo}`}>Registrar {tipo}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						label={tipo}
						value={value}
						fullWidth
						variant="outlined"
						onChange={obtenerDatos}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleToggle} color="primary">
						Cancel
					</Button>
					<Button onClick={handleToggle} color="primary">
						Subscribe
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
