import React, { useContext, useState } from 'react';
import { Box, Button, FormControl, Grid, Select, Typography, MenuItem, Divider } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';

import { Add, Done } from '@material-ui/icons';
import TablaPresentaciones from './TablaPresentaciones';
import { RegProductoContext } from '../../../../../context/Catalogos/CtxRegProducto';
import { AlmacenProvider } from '../../../../../context/Almacenes/crearAlmacen';
import ContainerRegistroAlmacen from '../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen';

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

export default function ColoresTallas({ obtenerConsultasProducto, refetch }) {
	const colores = [ '#452299', '#1ADA12', '#D712DA', '#DA3D12', '#12DAB9', '#F5DD0C' ];
	const { almacen_inicial, setAlmacenInicial } = useContext(RegProductoContext);
	const { almacenes } = obtenerConsultasProducto;

	const obtenerAlmacenes = (event, child) => {
		setAlmacenInicial({
			...almacen_inicial,
			[event.target.name]: event.target.value,
			[child.props.name]: child.props.id
		});
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
						<Typography>Talla</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select id="form-producto-talla" /* value={age} */ /* onChange={handleChange} */>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</FormControl>
							<Button color="primary">
								<Add />
							</Button>
						</Box>
					</Box>
					<Box mb={5} mt={1}>
						<Button fullWidth color="primary" variant="contained" startIcon={<Done />}>
							Guardar
						</Button>
					</Box>
					<Divider />
					<Box width="100%" mt={1}>
						<Typography>Color</Typography>
						<Box display="flex" justifyContent="flex-end">
							<Button color="primary">
								<Add />crear
							</Button>
						</Box>
						<Grid container>{colores.map((color, index) => <Colores key={index} color={color} />)}</Grid>
					</Box>
					<Box mb={5} mt={1}>
						<Button fullWidth color="primary" variant="contained" startIcon={<Done />}>
							Guardar
						</Button>
					</Box>
				</Grid>
			</Grid>
		</div>
	);
}

const Colores = ({ color }) => {
	const classes = useStyles();
	const theme = useTheme();

	const [ selected, setSelected ] = useState(false);

	return (
		<Grid item>
			<div
				className={classes.colorContainer}
				style={{
					backgroundColor: color,
					color: theme.palette.getContrastText(color)
				}}
				onClick={() => setSelected(!selected)}
			>
				{selected ? <Done /> : null}
			</div>
		</Grid>
	);
};
