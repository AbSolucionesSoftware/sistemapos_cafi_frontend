import React, { useContext, useState } from 'react';
import { Typography, MenuItem, Divider, ListItemText, Tooltip } from '@material-ui/core';
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

export default function ColoresTallas({ obtenerConsultasProducto, refetch, datos }) {
	const {
		almacen_inicial,
		setAlmacenInicial,
		setPresentaciones,
		presentaciones,
		datos_generales,
		preciosP
	} = useContext(RegProductoContext);
	const { almacenes, colores, tallas, calzados } = obtenerConsultasProducto;
	const [ medidasSeleccionadas, setMedidasSeleccionadas ] = useState([]);
	const [ coloresSeleccionados, setColoresSeleccionados ] = useState([]);
	const medidas = datos_generales.tipo_producto === 'ROPA' ? tallas : calzados;
	const array_presentaciones = [];

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
	};

	const handleAddTallas = (event, child) => {
		console.log(child.props.children[0].props.checked);
		const medidas_seleccionadas_temp = event.target.value;
		let presentacion = [];
		const array_medidad_finales = presentaciones;

		if(!coloresSeleccionados.length && !array_medidad_finales.length ){
			console.log("Primera talla agregada");
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				let producto = {
					existencia: false,
					codigo_barras: datos_generales.codigo_barras,
					nombre_comercial: datos_generales.nombre_comercial,
					medida: producto_medida,
					color: { nombre: '', hex: '' },
					precio: preciosP[0].precio_neto,
					cantidad: 0
				};
				presentacion.push(producto);
			}
		}else if(!coloresSeleccionados.length && array_medidad_finales.length > 0){
			console.log("Ya existe tallas se agregan mas");
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				const result = array_medidad_finales.filter((res) => res.medida._id === producto_medida._id);
				if (result.length) {
					presentacion.push(result[0]);
				} else {
					let producto = {
						existencia: false,
						codigo_barras: datos_generales.codigo_barras,
						nombre_comercial: datos_generales.nombre_comercial,
						medida: producto_medida,
						color: { nombre: '', hex: '' },
						precio: preciosP[0].precio_neto,
						cantidad: 0
					};
					presentacion.push(producto);
				}
			}
		}else if(coloresSeleccionados.length > 0 && medidas_seleccionadas_temp.length === 1 && child.props.children[0].props.checked === false){
			console.log("Hay colores y se agrega talla por primera vez");
			for (let i = 0; i < array_medidad_finales.length; i++) {
				for (let k = 0; k < medidas_seleccionadas_temp.length; k++) {
					presentacion.push({
						existencia: array_medidad_finales[i].existencia,
						codigo_barras: array_medidad_finales[i].codigo_barras,
						nombre_comercial: array_medidad_finales[i].nombre_comercial,
						medida: medidas_seleccionadas_temp[k],
						color: array_medidad_finales[i].color,
						precio: array_medidad_finales[i].precio,
						cantidad: array_medidad_finales[i].cantidad
					});
				}
			}
		}else if(coloresSeleccionados.length > 0 && medidas_seleccionadas_temp.length > 0){
			console.log("Hay colores y medidas");
			for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
				const producto_medida = medidas_seleccionadas_temp[i];
				for (let k = 0; k < coloresSeleccionados.length; k++) {
					const producto_color = coloresSeleccionados[k];
					const presentacion_existente = array_medidad_finales.filter(
						(producto_array_final) =>
						producto_array_final.medida._id === producto_medida._id && producto_color._id === producto_array_final.color._id
					);
					if (!presentacion_existente.length) {
							presentacion.push({
								existencia: false,
								codigo_barras: datos_generales.codigo_barras,
								nombre_comercial: datos_generales.nombre_comercial,
								medida: producto_medida,
								color: producto_color,
								precio: preciosP[0].precio_neto,
								cantidad: 0
							});
						/* const presentacion_color_existente = array_medidad_finales.filter(
							(producto_array_final) =>
							producto_color._id === producto_array_final.color._id
						);
						if(presentacion_color_existente.length > 0){
							console.log("Existe el color: ",presentacion_color_existente[0].color.nombre," Cantidad: ",presentacion_color_existente[0].cantidad);
							presentacion.push({
								existencia: presentacion_color_existente[0].existencia,
								codigo_barras: presentacion_color_existente[0].codigo_barras,
								nombre_comercial: presentacion_color_existente[0].nombre_comercial,
								medida: producto_medida,
								color: presentacion_color_existente[0].color,
								precio: presentacion_color_existente[0].precio,
								cantidad: presentacion_color_existente[0].cantidad
							});
						}else{
							presentacion.push({
								existencia: false,
								codigo_barras: datos_generales.codigo_barras,
								nombre_comercial: datos_generales.nombre_comercial,
								medida: producto_medida,
								color: producto_color,
								precio: preciosP[0].precio_neto,
								cantidad: 0
							});
						} */
					} else {
						// console.log("Esta talla no se mueve");
						presentacion.push(presentacion_existente[0]);
					}
				}
			}
		}else if(coloresSeleccionados.length > 0 && !medidas_seleccionadas_temp.length){
			console.log("Cuando hay color, pero no hay talla");
			/* si no hay tallas se vulven a listar las presentaciones originales si tenian colores */
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
						cantidad: objeto_presentaciones_final.cantidad
					});
				}
			}
		}

		/* if (!coloresSeleccionados.length) {
			// SI NO HAY COLORES SE AGREGAN SOLO TALLLAS
			if (!presentaciones.length) {
				// SI NO HAY PRESENTACIONES AGREGAR LA PRIMERA
				for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
					const producto_medida = medidas_seleccionadas_temp[i];
					let producto = {
						existencia: false,
						codigo_barras: datos_generales.codigo_barras,
						nombre_comercial: datos_generales.nombre_comercial,
						medida: producto_medida,
						color: { nombre: '', hex: '' },
						precio: preciosP[0].precio_neto,
						cantidad: 0
					};
					presentacion.push(producto);
				}
			} else {
				// SI SI HAY PRESENTACIONES.. DUPLICAR
				for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
					const producto_medida = medidas_seleccionadas_temp[i];
					const result = presentaciones.filter((res) => res.medida._id === producto_medida._id);
					if (result.length) {
						presentacion.push(result[0]);
					} else {
						let producto = {
							existencia: false,
							codigo_barras: datos_generales.codigo_barras,
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: { nombre: '', hex: '' },
							precio: preciosP[0].precio_neto,
							cantidad: 0
						};
						presentacion.push(producto);
					}
				}
			}
		} else {
			// SI HAY COLORES SE AGREGARA LA TALLA A LOS COLORES EXISTENTES SI AGREGA MAS DE UN COLOR SE DEBE MULTIPLICAR ESA PRESENTACION
			if (medidas_seleccionadas_temp.length) {
				for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
					const producto_medida = medidas_seleccionadas_temp[i];
					for (let k = 0; k < coloresSeleccionados.length; k++) {
						const producto_color = coloresSeleccionados[k];
						const presentacion_existente = presentaciones.filter(
							(producto) =>
								producto.medida._id === producto_medida._id && producto_color._id === producto.color._id
						);
						if (!presentacion_existente.length) {
							console.log('no hay existencia');
							let producto = {
								existencia: false,
								codigo_barras: datos_generales.codigo_barras,
								nombre_comercial: datos_generales.nombre_comercial,
								medida: producto_medida,
								color: producto_color,
								precio: preciosP[0].precio_neto,
								cantidad: 0
							};
							presentacion.push(producto);
						} else {
							presentacion.push(presentacion_existente[0]);
						}
					}
				}
			} else {
				// si no hay tallas se vulven a listar las presentaciones originales si tenian colores
				const presentaciones_existentes = presentaciones.filter((producto) => producto.medida._id);
				if (presentaciones_existentes.length) {
					for (let x = 0; x < presentaciones.length; x++) {
						const objeto_presentaciones_final = presentaciones[x];
						presentacion.push({
							existencia: objeto_presentaciones_final.existencia,
							codigo_barras: objeto_presentaciones_final.codigo_barras,
							nombre_comercial: objeto_presentaciones_final.nombre_comercial,
							medida: {},
							color: objeto_presentaciones_final.color,
							precio: objeto_presentaciones_final.precio,
							cantidad: objeto_presentaciones_final.cantidad
						});
					}
				}
			}
		} */

		setMedidasSeleccionadas(medidas_seleccionadas_temp);
		setPresentaciones(presentacion);
	};

	return (
		<div>
			<Grid container spacing={2}>
				<Grid item md={9}>
					<TablaPresentaciones />
				</Grid>
				<Grid item md={3}>
					<Box width="100%" mb={2}>
						<Typography>Almacen</Typography>
						<Box display="flex">
							<FormControl
								variant="outlined"
								fullWidth
								size="small"
								name="almacen"
								error={almacen_inicial.cantidad > 0 && !almacen_inicial.almacen}
							>
								<Select name="almacen" value={almacen_inicial.almacen} onChange={obtenerAlmacenes}>
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
							</FormControl>
							<AlmacenProvider>
								<ContainerRegistroAlmacen accion="registrar" refetch={refetch} />
							</AlmacenProvider>
						</Box>
					</Box>
					<Divider />
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
								/>
							))}
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}

const Colores = ({ color, coloresSeleccionados, setColoresSeleccionados, medidasSeleccionadas }) => {
	const classes = useStyles();
	const theme = useTheme();
	const { presentaciones, setPresentaciones, datos_generales, preciosP } = useContext(RegProductoContext);

	const [ selected, setSelected ] = useState(false);

	const obtenerColores = () => {
		if (!selected) {
			coloresSeleccionados.push(color);
			setSelected(true);
		} else {
			coloresSeleccionados.forEach((res, index) => {
				if (res._id === color._id) {
					coloresSeleccionados.splice(index, 1);
					setSelected(false);
				}
			});
		}
		let presentacion = [];

		if (!medidasSeleccionadas.length) {
			/* SI NO HAY MEDIDAS SE AGREGAN COLORES */
			for (let i = 0; i < coloresSeleccionados.length; i++) {
				const producto_color = coloresSeleccionados[i];
				const presentacion_actual = presentaciones.filter(
					(producto) => producto.color._id === producto_color._id
				);
				console.log(presentacion_actual);
				let producto = {
					existencia: presentacion_actual.length ? presentacion_actual[0].existencia : false,
					codigo_barras: datos_generales.codigo_barras,
					nombre_comercial: datos_generales.nombre_comercial,
					medida: '',
					color: producto_color,
					precio: presentacion_actual.length ? presentacion_actual[0].precio : preciosP[0].precio_neto,
					cantidad: presentacion_actual.length ? presentacion_actual[0].cantidad : 0
				};
				presentacion.push(producto);
			}
		} else {
			/* SI HAY MEDIDAS SE AGREGARA EL COLOR A LA MEDIDA SI AGREGA MAS DE UN COLOR SE DEBE MULTIPLICAR ESA PRESENTACION */
			if (coloresSeleccionados.length) {
				for (let i = 0; i < coloresSeleccionados.length; i++) {
					const producto_color = coloresSeleccionados[i];

					for (let k = 0; k < medidasSeleccionadas.length; k++) {
						const producto_medida = medidasSeleccionadas[k];
						const presentacion_actual = presentaciones.filter(
							(producto) =>
								producto.color._id === producto_color._id || producto.medida._id === producto_medida._id
						);

						let producto = {
							existencia: presentacion_actual.length ? presentacion_actual[0].existencia : false,
							codigo_barras: datos_generales.codigo_barras,
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: producto_color,
							precio: presentacion_actual.length
								? presentacion_actual[0].precio
								: preciosP[0].precio_neto,
							cantidad: presentacion_actual.length ? presentacion_actual[0].cantidad : 0
						};
						presentacion.push(producto);
					}
				}
			} else {
				/* si no hay colores se vulven a listar las presentaciones originales si tenian medidas */
				for (let k = 0; k < medidasSeleccionadas.length; k++) {
					const producto_medida = medidasSeleccionadas[k];
					const presentacion_actual = presentaciones.filter(
						(producto) => producto.medida._id === producto_medida._id
					);

					let producto = {
						existencia: presentacion_actual.length ? presentacion_actual[0].existencia : false,
						codigo_barras: datos_generales.codigo_barras,
						nombre_comercial: datos_generales.nombre_comercial,
						medida: producto_medida,
						color: { nombre: '', hex: '' },
						precio: presentacion_actual.length ? presentacion_actual[0].precio : preciosP[0].precio_neto,
						cantidad: presentacion_actual.length ? presentacion_actual[0].cantidad : 0
					};
					presentacion.push(producto);
				}
			}
		}
		setColoresSeleccionados([ ...coloresSeleccionados ]);
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
					onClick={() => obtenerColores()}
				>
					{selected ? <Done /> : null}
				</div>
			</Tooltip>
		</Grid>
	);
};
