import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider } from '@material-ui/core';
import { TextField, Typography } from '@material-ui/core';
import { RegProductoContext } from '../../../../context/Catalogos/CtxRegProducto';

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

export default function RegistrarInfoCredito() {
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
			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>RFC</Typography>
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
				</Box>
				<Box width="100%">
					<Typography>Razon social</Typography>
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
				</Box>
			</div>
            <div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Descuento</Typography>
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
				</Box>
				<Box width="100%">
					<Typography>Limite de crédito</Typography>
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
				</Box>
                <Box width="100%">
					<Typography>Días de crédito</Typography>
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
				</Box>
			</div>
			<Box my={3}>
				<Typography>Datos bancarios <b>(Para proovedores)</b></Typography>
				<Divider />
			</Box>
			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Banco</Typography>
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
				</Box>
				<Box width="100%">
					<Typography>No. de Cuenta Bancaria</Typography>
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
				</Box>
			</div>
		</Fragment>
	);
}
