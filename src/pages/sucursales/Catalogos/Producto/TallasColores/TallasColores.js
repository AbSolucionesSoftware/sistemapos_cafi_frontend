import React, { useContext, useState } from 'react';
import { Typography, MenuItem, Divider, ListItemText } from '@material-ui/core';
import { Box, Button, FormControl, Grid, Select, Checkbox } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';

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
		borderRadius: '100%',
		cursor: 'pointer'
	}
}));

export default function ColoresTallas({ obtenerConsultasProducto, refetch, datos }) {
	const {
		almacen_inicial,
		setAlmacenInicial,
		presentaciones,
		setPresentaciones,
		datos_generales,
		preciosP
	} = useContext(RegProductoContext);
	const { almacenes, colores, tallas, calzados } = obtenerConsultasProducto;
	const [ medidasSeleccionadas, setMedidasSeleccionadas ] = useState([]);
	const [ coloresSeleccionados, setColoresSeleccionados ] = useState([]);
	const [ medida, setMedida ] = useState('');
	const medidas = datos_generales.tipo_producto === "ROPA" ? tallas : calzados;

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
	};

	const addPresentacionConTalla = () => {
		setPresentaciones([
			...presentaciones,
			{
				codigo_barras: datos_generales.codigo_barras,
				nombre_comercial: datos_generales.nombre_comercial,
				medida: 12,
				color: 'BLANCO',
				precio: preciosP[0].precio_neto,
				cantidad: 1
			}
		]);
	};

	const handleAddTallas = (event) => {
		setMedidasSeleccionadas(event.target.value);
	};

	const addColoresList = () => {
		console.log(coloresSeleccionados);
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
					<Box width="100%" mt={1}>
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
					<Box mb={5} mt={1}>
						<Button
							fullWidth
							color="primary"
							variant="contained"
							startIcon={<Done />}
							onClick={() => addPresentacionConTalla()}
						>
							Guardar
						</Button>
					</Box>
					<Divider />
					<Box width="100%" mt={1}>
						<Typography>Color</Typography>
						<CrearColorProducto refetch={refetch} />
						<Grid container>
							{colores.map((color, index) => (
								<Colores
									key={index}
									index={index}
									color={color}
									coloresSeleccionados={coloresSeleccionados}
									setColoresSeleccionados={setColoresSeleccionados}
								/>
							))}
						</Grid>
					</Box>
					<Box mb={5} mt={1}>
						<Button fullWidth color="primary" variant="contained" startIcon={<Done />} onClick={() => addColoresList()}>
							Guardar
						</Button>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}

const Colores = ({ color, coloresSeleccionados, setColoresSeleccionados, index }) => {
	const classes = useStyles();
	const theme = useTheme();

	const [ selected, setSelected ] = useState(false);

	const obtenerColores = () => {
		if(!selected){
			coloresSeleccionados.push(color);
			setSelected(true)
		}else{
			coloresSeleccionados.splice(index, 1)
			setSelected(false)
		}
		setColoresSeleccionados([...coloresSeleccionados]);
	}

	return (
		<Grid item>
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
		</Grid>
	);
};
