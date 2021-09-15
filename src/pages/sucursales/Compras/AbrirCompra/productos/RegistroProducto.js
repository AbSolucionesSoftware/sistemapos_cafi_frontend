import React, { Fragment, useState } from 'react';

import {
	Button,
	Dialog,
	Box,
	TextField,
	DialogActions,
	makeStyles,
	Typography,
	FormControl,
	Select,
	MenuItem,
	IconButton
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		flexGrow: 1,
		width: '80%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	}
}));

export default function RegistroProducto({refetch}) {
	const classes = useStyles();

	const [ open, setOpen ] = useState(false);

	const toggleModal = () => {
		setOpen(!open);
	};

	return (
		<Fragment>
			<Button color="primary" onClick={toggleModal} startIcon={<AddIcon />}
			size="large">
				Registrar nuevo producto
			</Button>
			<Dialog open={open} onClose={toggleModal} fullWidth maxWidth="md">
				<Box p={3} dsiplay="flex" textAlign="center" alignItems="center">
					<Typography variant="h6">Registro nuevo producto</Typography>
				</Box>
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
								/* helperText="Incorrect entry." */
							/>
							<Button variant="contained" color="primary">
								Generar
							</Button>
						</Box>
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

				<DialogActions>
					<Button
						variant="outlined"
						color="secondary"
						onClick={toggleModal}
						size="large"
						startIcon={<CloseIcon />}
					>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="primary"
						// onClick={saveData}
						size="large"
						startIcon={<DoneIcon />}
					>
						Guardar Producto
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
