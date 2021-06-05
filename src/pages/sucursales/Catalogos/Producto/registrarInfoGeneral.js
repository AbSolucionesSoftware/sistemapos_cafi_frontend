import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, Divider, MenuItem, Select, Container } from '@material-ui/core';
import { TextField, Typography, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { RegProductoContext } from '../../../../context/CtxRegProducto';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	}
}));

export default function RegistroInfoGenerales() {
	const classes = useStyles();
	const { datos, setDatos } = useContext(RegProductoContext);

	const obtenerCampos = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	return (
		<Fragment>
			<Container maxWidth="md">
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Código de barras</Typography>
						<Box display="flex">
							<TextField
								fullWidth
								size="small"
								/* error */
								name="codigo_barras"
								id="form-producto-codigo-barras"
								variant="outlined"
								value={datos.codigo_barras}
								/* helperText="Incorrect entry." */
								onChange={obtenerCampos}
							/>
							<Button variant="contained" color="primary">
								Generar
							</Button>
						</Box>
					</Box>
					<Box width="100%">
						<Typography>Clave alterna</Typography>
						<TextField
							fullWidth
							size="small"
							/* error */
							name="clave_alterna"
							id="form-producto-clave-alterna"
							variant="outlined"
							/* value="" */
							/* helperText="Incorrect entry." */
							/* onChange={obtenerCampos} */
						/>
					</Box>
					<Box width="100%">
						<Typography>Tipo de producto</Typography>
						<FormControl variant="outlined" fullWidth size="small">
							<Select id="form-producto-tipo" /* value={age} */ /* onChange={handleChange} */>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value={10}>Ten</MenuItem>
								<MenuItem value={20}>Twenty</MenuItem>
								<MenuItem value={30}>Thirty</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Nombre comercial</Typography>
						<TextField
							fullWidth
							size="small"
							/* error */
							name="nombre_comercial"
							id="form-producto-nombre-comercial"
							variant="outlined"
							/* value="" */
							/* helperText="Incorrect entry." */
							/* onChange={obtenerCampos} */
						/>
					</Box>
					<Box width="100%">
						<Typography>Nombre genérico</Typography>
						<TextField
							fullWidth
							size="small"
							/* error */
							name="nombre_generico"
							id="form-producto-nombre-generico"
							variant="outlined"
							/* value="" */
							/* helperText="Incorrect entry." */
							/* onChange={obtenerCampos} */
						/>
					</Box>
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Categoria</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select id="form-producto-categoria" /* value={age} */ /* onChange={handleChange} */>
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
					<Box width="100%">
						<Typography>Subcategoria</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select id="form-producto-subcategoria" /* value={age} */ /* onChange={handleChange} */>
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
				</div>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>Departamento</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select id="form-producto-departamento" /* value={age} */ /* onChange={handleChange} */>
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
					<Box width="100%">
						<Typography>Marca</Typography>
						<Box display="flex">
							<FormControl variant="outlined" fullWidth size="small">
								<Select id="form-producto-marca" /* value={age} */ /* onChange={handleChange} */>
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
				</div>
				<Box>
					<Typography>
						<b>Farmacia</b>
					</Typography>
					<Divider />
				</Box>
				<div className={classes.formInput}>
					<FormControlLabel
						control={<Checkbox /* checked={state.checkedA} onChange={handleChange} */ name="iva-activo" />}
						label="Necesita receta"
					/>
				</div>
			</Container>
		</Fragment>
	);
}
