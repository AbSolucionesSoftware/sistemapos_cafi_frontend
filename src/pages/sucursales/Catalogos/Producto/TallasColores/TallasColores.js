import React, { useContext, useState, Fragment, useEffect } from 'react';
import { Typography, MenuItem, Divider, ListItemText, Tooltip, FormLabel } from '@material-ui/core';
import { Box, FormControl, Grid, Select, Checkbox } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';
import Zoom from '@material-ui/core/Zoom';

import { Done } from '@material-ui/icons';
import TablaPresentaciones from './TablaPresentaciones';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { AlmacenProvider } from '../../../../../context/Almacenes/crearAlmacen';
import ContainerRegistroAlmacen from '../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen';
import CrearColorProducto from './crearColor';
import CrearTallasProducto from './crearTalla';

const useStyles = makeStyles((theme) => ({
	colorContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		width: 50,
		margin: 1,
		borderRadius: '15%',
		cursor: 'pointer'
	}
}));

const GenCodigoBarras = () => {
	return Math.floor(Math.random() * (999999999999 - 100000000000 + 1) + 100000000000).toString();
};

export default function ColoresTallas({ obtenerConsultasProducto, refetch, datos }) {
	const {
		almacen_inicial,
		setAlmacenInicial,
		setPresentaciones,
		presentaciones,
		datos_generales,
		preciosP,
	} = useContext(RegProductoContext);
	const { almacenes, colores, tallas, calzados } = obtenerConsultasProducto;
	const [ medidasSeleccionadas, setMedidasSeleccionadas ] = useState([]);
	const [ coloresSeleccionados, setColoresSeleccionados ] = useState([]);
	const medidas = datos_generales.tipo_producto === 'ROPA' ? tallas : calzados;

	/* useEffect(() => {
		let colors = [];
		let medidas = [];

		presentaciones.forEach(element => {
			if(element.color._id) colors.push(element.color);
			if(element.medida._id) medidas.push(element.medida)
		});

		var hashColor = {};
		var hashMedida = {};
		const colores_existentes = colors.filter((color) => {
			var existColor = !hashColor[color._id];
			hashColor[color._id] = true;
			return existColor;
		});
		const medidas_existentes = medidas.filter((medida) => {
			var existMedida = !hashMedida[medida._id];
			hashMedida[medida._id] = true;
			return existMedida;
		});

		setColoresSeleccionados(colores_existentes);
		setMedidasSeleccionadas(medidas_existentes);
		
	}, []) */

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
	};

	const handleAddTallas = (event, child) => {
		const medidas_seleccionadas_temp = event.target.value;
		let presentacion = [];
		const array_medidad_finales = [...presentaciones];

		if (!coloresSeleccionados.length && !array_medidad_finales.length) {
			/* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				let producto = {
					existencia: false,
					codigo_barras: GenCodigoBarras(),
					nombre_comercial: datos_generales.nombre_comercial,
					medida: producto_medida,
					color: { nombre: '', hex: '' },
					precio: preciosP[0].precio_neto,
					cantidad: 0,
					nuevo: true,
				};
				presentacion.push(producto);
			}
		} else if (!coloresSeleccionados.length && array_medidad_finales.length > 0) {
			/* SI NO HAY COLORES REGISTRADOS PERO YA HAY TALLAS SE AGREGAN MAS */
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				const result = array_medidad_finales.filter((res) => res.medida._id === producto_medida._id);
				if (result.length) {
					presentacion.push(result[0]);
				} else {
					let producto = {
						existencia: false,
						codigo_barras: GenCodigoBarras(),
						nombre_comercial: datos_generales.nombre_comercial,
						medida: producto_medida,
						color: { nombre: '', hex: '' },
						precio: preciosP[0].precio_neto,
						cantidad: 0,
						nuevo: true,
					};
					presentacion.push(producto);
				}
			}
		} else if (
			coloresSeleccionados.length > 0 &&
			medidas_seleccionadas_temp.length === 1 &&
			child.props.children[0].props.checked === false
		) {
			/* SI HAY COLORES SE LE AGREGA TALLA POR PRIMERA VEZ */
			for (let i = 0; i < array_medidad_finales.length; i++) {
				for (let k = 0; k < medidas_seleccionadas_temp.length; k++) {
					presentacion.push({
						existencia: array_medidad_finales[i].existencia,
						codigo_barras: array_medidad_finales[i].codigo_barras,
						nombre_comercial: array_medidad_finales[i].nombre_comercial,
						medida: medidas_seleccionadas_temp[k],
						color: array_medidad_finales[i].color,
						precio: array_medidad_finales[i].precio,
						cantidad: array_medidad_finales[i].cantidad,
						nuevo: true,
					});
				}
			}
		} else if (coloresSeleccionados.length > 0 && medidas_seleccionadas_temp.length > 0) {
			/* YA HAY COLORES Y MEDIDAS EN LAS PRESENTACIONES, SE AGREGAN NORMAL */
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				for (let k = 0; k < coloresSeleccionados.length; k++) {
					const producto_color = coloresSeleccionados[k];
					const presentacion_existente = array_medidad_finales.filter(
						(producto_array_final) =>
							producto_array_final.medida._id === producto_medida._id &&
							producto_color._id === producto_array_final.color._id
					);
					if (!presentacion_existente.length) {
						presentacion.push({
							existencia: false,
							codigo_barras: GenCodigoBarras(),
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: producto_color,
							precio: preciosP[0].precio_neto,
							cantidad: 0,
							nuevo: true,
						});
					} else {
						presentacion.push(presentacion_existente[0]);
					}
				}
			}
		} else if (coloresSeleccionados.length > 0 && !medidas_seleccionadas_temp.length) {
			/* SI NO HAY TALLAS SE VUELVE A LISTAR LOS COLORES QUE YA ESTABAN EN PRESENTACIONES */
			const presentaciones_existentes = array_medidad_finales.filter((producto) => producto.medida._id);
			if (presentaciones_existentes.length) {
				for (let x = 0; x < array_medidad_finales.length; x++) {
					const objeto_presentaciones_final = array_medidad_finales[x];
					presentacion.push({
						existencia: objeto_presentaciones_final.existencia,
						codigo_barras: objeto_presentaciones_final.codigo_barras,
						nombre_comercial: objeto_presentaciones_final.nombre_comercial,
						medida: {},
						color: objeto_presentaciones_final.color,
						precio: objeto_presentaciones_final.precio,
						cantidad: objeto_presentaciones_final.cantidad,
						nuevo: true,
					});
				}
			}
		}

		setMedidasSeleccionadas(medidas_seleccionadas_temp);
		
		if(datos.medidas_registradas){
			setPresentaciones([...array_medidad_finales, presentacion]);
			return
		}
		setPresentaciones(presentacion);
	};

	return (
		<div>
			<Grid container spacing={2}>
				<Grid item md={9}>
					<TablaPresentaciones datos={datos} />
				</Grid>
				<Grid item md={3}>
					{!datos.medidas_registradas ? (
						<Fragment>
							<Box width="100%" mb={2}>
								<Typography>Almacen</Typography>
								<Box display="flex">
									<FormControl
										disabled={presentaciones.length === 0}
										variant="outlined"
										fullWidth
										size="small"
										name="almacen"
										error={presentaciones.length > 0 && !almacen_inicial.almacen}
									>
										<Select
											name="almacen"
											value={almacen_inicial.almacen}
											onChange={obtenerAlmacenes}
										>
											<MenuItem value="">
												<em>Seleccione uno</em>
											</MenuItem>
											{almacenes ? (
												almacenes.map((res) => {
													return (
														<MenuItem
															name="id_almacen"
															key={res._id}
															value={res.nombre_almacen}
															id={res._id}
														>
															{res.nombre_almacen}
														</MenuItem>
													);
												})
											) : (
												<MenuItem value="" />
											)}
										</Select>
										{presentaciones.length > 0 && !almacen_inicial.almacen ? (
											<FormLabel>* Campo obligatorio</FormLabel>
										) : null}
										
									</FormControl>
									<AlmacenProvider>
										<ContainerRegistroAlmacen accion="registrar" refetch={refetch} />
									</AlmacenProvider>
								</Box>
							</Box>
							<Divider />
						</Fragment>
					) : null}
					<Box width="100%" my={2}>
						<Typography>{datos_generales.tipo_producto === 'ROPA' ? 'Talla' : 'Número'}</Typography>
						<Box display="flex">
							<FormControl fullWidth size="small" variant="outlined">
								<Select
									id="demo-mutiple-checkbox"
									multiple
									value={medidasSeleccionadas}
									onChange={handleAddTallas}
									renderValue={(selected) => selected.map((select) => `${select.talla}, `)}
								>
									{medidas.map((talla, index) => (
										<MenuItem key={index} value={talla} name="id_talla">
											<Checkbox checked={medidasSeleccionadas.indexOf(talla) > -1} />
											<ListItemText primary={talla.talla} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<CrearTallasProducto setMedidasSeleccionadas={setMedidasSeleccionadas} refetch={refetch} />
						</Box>
					</Box>
					<Divider />
					<Box width="100%" mt={1}>
						<Typography>Color</Typography>
						<CrearColorProducto refetch={refetch} />
						<Grid container>
							{colores.map((color, index) => (
								<Colores
									key={index}
									color={color}
									coloresSeleccionados={coloresSeleccionados}
									setColoresSeleccionados={setColoresSeleccionados}
									medidasSeleccionadas={medidasSeleccionadas}
									datos={datos}
								/>
							))}
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}

const Colores = ({ color, coloresSeleccionados, setColoresSeleccionados, medidasSeleccionadas, datos }) => {
	const classes = useStyles();
	const theme = useTheme();
	const { presentaciones, setPresentaciones, datos_generales, preciosP } = useContext(RegProductoContext);

	const [ selected, setSelected ] = useState(false);

	const obtenerColores = (value) => {
		if (!selected) {
			coloresSeleccionados.push(color);
			setSelected(value);
		} else {
			coloresSeleccionados.forEach((res, index) => {
				if (res._id === color._id) {
					coloresSeleccionados.splice(index, 1);
					setSelected(value);
				}
			});
		}
		let presentacion = [];
		const array_medidad_finales = [...presentaciones];

		if (!medidasSeleccionadas.length && !array_medidad_finales.length) {
			/* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
			for (let i = 0; i < coloresSeleccionados.length; i++) {
				const producto_color = coloresSeleccionados[i];
				let producto = {
					existencia: false,
					codigo_barras: GenCodigoBarras(),
					nombre_comercial: datos_generales.nombre_comercial,
					medida: {},
					color: producto_color,
					precio: preciosP[0].precio_neto,
					cantidad: 0,
					nuevo: true,
				};
				presentacion.push(producto);
			}
		} else if (!medidasSeleccionadas.length && array_medidad_finales.length > 0) {
			/* SI YA HAY COLORES REGISTRADOS SE AGREGAN MAS */
			for (let i = 0; i < coloresSeleccionados.length; i++) {
				const producto_color = coloresSeleccionados[i];
				const result = array_medidad_finales.filter((res) => res.color._id === producto_color._id);
				if (result.length) {
					presentacion.push(result[0]);
				} else {
					let producto = {
						existencia: false,
						codigo_barras: GenCodigoBarras(),
						nombre_comercial: datos_generales.nombre_comercial,
						medida: {},
						color: producto_color,
						precio: preciosP[0].precio_neto,
						cantidad: 0,
						nuevo: true,
					};
					presentacion.push(producto);
				}
			}
		} else if (medidasSeleccionadas.length > 0 && coloresSeleccionados.length === 1 && value) {
			/* SI YA HAY TALLAS SE LE AGREGA EL COLOR POR PRIMERA VEZ */
			for (let i = 0; i < array_medidad_finales.length; i++) {
				for (let k = 0; k < coloresSeleccionados.length; k++) {
					presentacion.push({
						existencia: array_medidad_finales[i].existencia,
						codigo_barras: array_medidad_finales[i].codigo_barras,
						nombre_comercial: array_medidad_finales[i].nombre_comercial,
						medida: array_medidad_finales[i].medida,
						color: coloresSeleccionados[k],
						precio: array_medidad_finales[i].precio,
						cantidad: array_medidad_finales[i].cantidad,
						nuevo: true,
					});
				}
			}
		} else if (medidasSeleccionadas.length > 0 && coloresSeleccionados.length > 0) {
			/* YA HAY TALLAS Y MEIDAS EN LAS PRESENTACIONES, SE REGISTRAN NORMAL */
			for (let i = 0; i < coloresSeleccionados.length; i++) {
				const producto_color = coloresSeleccionados[i];
				for (let k = 0; k < medidasSeleccionadas.length; k++) {
					const producto_medida = medidasSeleccionadas[k];
					const presentacion_existente = array_medidad_finales.filter(
						(producto_array_final) =>
							producto_array_final.medida._id === producto_medida._id &&
							producto_color._id === producto_array_final.color._id
					);
					if (!presentacion_existente.length) {
						presentacion.push({
							existencia: false,
							codigo_barras: GenCodigoBarras(),
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: producto_color,
							precio: preciosP[0].precio_neto,
							cantidad: 0,
							nuevo: true,
						});
					} else {
						presentacion.push(presentacion_existente[0]);
					}
				}
			}
		} else if (medidasSeleccionadas.length > 0 && !coloresSeleccionados.length) {
			/* SI NO HAY COLORES SE VUELVE A LISTAR LAS TALLAS QUE YA ESTABAN EN PRESENTACIONES */
			const presentaciones_existentes = array_medidad_finales.filter((producto) => producto.color._id);
			if (presentaciones_existentes.length) {
				for (let x = 0; x < array_medidad_finales.length; x++) {
					const objeto_presentaciones_final = array_medidad_finales[x];
					presentacion.push({
						existencia: objeto_presentaciones_final.existencia,
						codigo_barras: objeto_presentaciones_final.codigo_barras,
						nombre_comercial: objeto_presentaciones_final.nombre_comercial,
						medida: objeto_presentaciones_final.medida,
						color: { nombre: '', hex: '' },
						precio: objeto_presentaciones_final.precio,
						cantidad: objeto_presentaciones_final.cantidad,
						nuevo: true,
					});
				}
			}
		}

		setColoresSeleccionados([ ...coloresSeleccionados ]);
		if(datos.medidas_registradas){
			setPresentaciones([...array_medidad_finales, presentacion]);
			return;
		}
		setPresentaciones(presentacion);
	};

	return (
		<Grid item>
			<Tooltip title={color.nombre} placement="top" arrow TransitionComponent={Zoom}>
				<div
					className={classes.colorContainer}
					style={{
						backgroundColor: color.hex,
						color: theme.palette.getContrastText(color.hex)
					}}
					onClick={() => obtenerColores(!selected)}
				>
					{selected ? <Done /> : null}
				</div>
			</Tooltip>
		</Grid>
	);
};
