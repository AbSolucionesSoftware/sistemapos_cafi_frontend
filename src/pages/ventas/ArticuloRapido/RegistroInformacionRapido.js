import React, { Fragment, useContext } from 'react';

import { Box,  Button, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, InputAdornment, makeStyles, MenuItem, OutlinedInput, Select, TextField, Typography } from '@material-ui/core';
import { RegProductoContext } from '../../../context/Catalogos/CtxRegProducto';
// import RegistroInfoAdidional from '../../sucursales/Catalogos/Producto/PreciosVenta/registrarInfoAdicional';

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
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    }
  }));

export default function RegistroInformacionRapido({ setAbrirTallaColor, setCantidad, cantidad }) {
	const { datos_generales, precios, setPrecios, setDatosGenerales, validacion } = useContext(RegProductoContext);
	const { unidadVentaXDefecto, setUnidadVentaXDefecto, update } = useContext(RegProductoContext);

	const obtenerCampos = (e) => {
		if (e.target.name === 'codigo_barras') {
			setUnidadVentaXDefecto({
				...unidadVentaXDefecto,
				codigo_barras: e.target.value
			})
		}
		setDatosGenerales({
			...datos_generales,
			[e.target.name]: e.target.value
		});

		if (e.target.value === "CALZADO" || e.target.value === "ROPA") {
			setAbrirTallaColor(true);
		}
		
	};

	const checkFarmacia = (e) => {
		setDatosGenerales({
			...datos_generales,
			receta_farmacia: e.target.checked
		});
	};

	const obtenerChecks = (e) => {
		if (e.target.name === 'granel' && e.target.checked) {
			setPrecios({
				...precios,
				[e.target.name]: e.target.checked,
				inventario: { ...precios.inventario, unidad_de_inventario: 'Kg', },
				unidad_de_compra: { ...precios.unidad_de_compra, unidad: 'Kg', }
			});
			setUnidadVentaXDefecto({
				...unidadVentaXDefecto,
				unidad: 'Kg',
			})
		} else {
			setPrecios({
				...precios,
				[e.target.name]: e.target.checked,
				inventario: { ...precios.inventario, unidad_de_inventario: 'Pz', },
				unidad_de_compra: { ...precios.unidad_de_compra, unidad: 'Pz', }
			});
			setUnidadVentaXDefecto({
				...unidadVentaXDefecto,
				unidad: 'Pz',
			})
		}
	};

	const GenCodigoBarras = () => {
		const max = 999999999999;
		const min = 100000000000;
		const codigo_barras = Math.floor(Math.random() * (max - min + 1) + min).toString();
		setDatosGenerales({
			...datos_generales,
			codigo_barras
		});
		setUnidadVentaXDefecto({
			...unidadVentaXDefecto,
			codigo_barras
		})
	};

    const classes = useStyles();

    return (
        <Fragment>
				<Box>
					<Typography>
						<b>Información General</b>
					</Typography>
				</Box>
				<Divider />
                <div className={classes.formInputFlex}>
					<Box width="100%">
						<FormControl variant="outlined" size="small" name="codigo_barras" fullWidth>
							<Typography>Código de barras</Typography>
							<OutlinedInput
								disabled={update && datos_generales.codigo_barras}
								style={{padding: 0}}
								id="form-producto-codigo-barras"
								name="codigo_barras"
								value={datos_generales.codigo_barras ? datos_generales.codigo_barras : ''}
								onChange={obtenerCampos}
								endAdornment={
									<InputAdornment position="end">
										<Button
											disabled={update && datos_generales.codigo_barras}
											onClick={() => GenCodigoBarras()}
											/* edge="end" */
											color="primary"
											variant="outlined"
											size="large"
										>
											Generar
										</Button>
									</InputAdornment>
								}
							/>
						</FormControl>
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
				</div>
				<div className={classes.formInputFlex}>
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
					{datos_generales.tipo_producto === "OTROS" ? (
						<>
							<Box width="100%">
								<Typography>
									<span className="obligatorio">* </span>Cantidad
								</Typography>
								<TextField
									fullWidth
									size="small"
									error={validacion.error && !cantidad}
									name="cantidad"
									type='number'
									id="form-producto-nombre-generico"
									variant="outlined"
									value={cantidad ? cantidad : ''}
									helperText={validacion.message}
									onChange={(e) => setCantidad(parseInt(e.target.value))}
								/>
							</Box>
							<Box width="100%">
								<Typography>Granel</Typography>
								<FormControlLabel
									control={<Checkbox onChange={obtenerChecks} name="granel" />}
									label="Vender a granel"
								/>
							</Box>
							<Box width="100%">
								<Typography>Medicamento</Typography>
								<FormControlLabel
									control={
										<Checkbox
											// checked={datos_generales.receta_farmacia ? datos_generales.receta_farmacia : false}
											onChange={checkFarmacia}
											name="receta_farmacia"
										/>
									}
									label="Necesita receta"
									name="receta_farmacia"
								/>
							</Box>
						</>
					) : null}
                </div>
        </Fragment>
    )
}
