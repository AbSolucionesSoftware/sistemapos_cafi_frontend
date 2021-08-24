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
	const { almacen_inicial, setAlmacenInicial, setPresentaciones, datos_generales, preciosP } = useContext(
		RegProductoContext
	);
	const { almacenes, colores, tallas, calzados } = obtenerConsultasProducto;
	const [ medidasSeleccionadas, setMedidasSeleccionadas ] = useState([]);
	const [ coloresSeleccionados, setColoresSeleccionados ] = useState([]);
	const medidas = datos_generales.tipo_producto === 'ROPA' ? tallas : calzados;

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
	};

	const handleAddTallas = (event) => {
		const medidas = event.target.value;
		let presentacion = [];

		if (!coloresSeleccionados.length) {
			/* SI NO HAY COLORES SE AGREGAN SOLO TALLLAS */
			for (let i = 0; i < medidas.length; i++) {
				const producto_medida = medidas[i];
				let producto = {
					existencia: true,
					codigo_barras: datos_generales.codigo_barras,
					nombre_comercial: datos_generales.nombre_comercial,
					medida: producto_medida,
					color: {nombre: '', hex: ''},
					precio: preciosP[0].precio_neto,
					cantidad: 0
				};
				presentacion.push(producto);
			}
		} else {
			/* SI HAY COLORES SE AGREGARA LA TALLA A LOS COLORES EXISTENTES SI AGREGA MAS DE UN COLOR SE DEBE MULTIPLICAR ESA PRESENTACION */
			if (medidas.length) {
				console.log(medidas);
				for (let i = 0; i < medidas.length; i++) {
					const producto_medida = medidas[i];

					for (let k = 0; k < coloresSeleccionados.length; k++) {
						const producto_color = coloresSeleccionados[k];

						let producto = {
							existencia: true,
							codigo_barras: datos_generales.codigo_barras,
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: producto_color,
							precio: preciosP[0].precio_neto,
							cantidad: 0
						};
						presentacion.push(producto);
					}
				}
			} else {
				console.log('entro a que no hay tallas');
				/* si no hay tallas se vulven a listar las presentaciones originales si tenian colores */
				for (let k = 0; k < coloresSeleccionados.length; k++) {
					const producto_color = coloresSeleccionados[k];
					let producto = {
						existencia: true,
						codigo_barras: datos_generales.codigo_barras,
						nombre_comercial: datos_generales.nombre_comercial,
						medida: '',
						color: producto_color,
						precio: preciosP[0].precio_neto,
						cantidad: 0
					};
					presentacion.push(producto);
				}
			}
		}

		setMedidasSeleccionadas(medidas);
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
									renderValue={(selected) => selected.join(', ')}
								>
									{medidas.map((talla, index) => (
										<MenuItem key={index} value={talla.talla} name="id_talla" talla={talla}>
											<Checkbox checked={medidasSeleccionadas.indexOf(talla.talla) > -1} />
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
	const { setPresentaciones, datos_generales, preciosP } = useContext(RegProductoContext);

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
				let producto = {
					existencia: true,
					codigo_barras: datos_generales.codigo_barras,
					nombre_comercial: datos_generales.nombre_comercial,
					medida: '',
					color: producto_color,
					precio: preciosP[0].precio_neto,
					cantidad: 0
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

						let producto = {
							existencia: true,
							codigo_barras: datos_generales.codigo_barras,
							nombre_comercial: datos_generales.nombre_comercial,
							medida: producto_medida,
							color: producto_color,
							precio: preciosP[0].precio_neto,
							cantidad: 0
						};
						presentacion.push(producto);
					}
				}
			} else {
				/* si no hay colores se vulven a listar las presentaciones originales si tenian medidas */
				for (let k = 0; k < medidasSeleccionadas.length; k++) {
					const producto_medida = medidasSeleccionadas[k];

					let producto = {
						existencia: true,
						codigo_barras: datos_generales.codigo_barras,
						nombre_comercial: datos_generales.nombre_comercial,
						medida: producto_medida,
						color: {nombre: '', hex: ''},
						precio: preciosP[0].precio_neto,
						cantidad: 0
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
