import React, { Fragment } from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Box, Button, TextField, Typography, Table, Checkbox, Select, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { FormControl } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	table: {
		width: 400
	}
}));

function createData(calories, fat, carbs) {
	return { calories, fat, carbs };
}

const rows = [ createData(159, 6.0, 24), createData(237, 9.0, 37), createData(262, 16.0, 24) ];

export default function PreciosDeCompra() {
	const classes = useStyles();

	return (
		<Fragment>
			<Box my={1} />
			<Typography align="center">
				<b>Unidades de venta</b>
			</Typography>
			<Box className={classes.formInputFlex}>
				<Box width="130px">
					<Typography>Unidad</Typography>
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
					</Box>
				</Box>
				<Box width="130px">
					<Typography>Cantidad</Typography>
					<TextField
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						/* error */
						name="inventario_maximo"
						id="form-producto-inventario_maximo"
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</Box>
				<Box pt={3}>
					<Button variant="text" color="primary">
						<Add /> Agregar
					</Button>
				</Box>
			</Box>
			<Box>
				<TableContainer>
					<Table className={classes.table} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>Precio</TableCell>
								<TableCell>Cantidad</TableCell>
								<TableCell>Unidad Principal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.name}>
									<TableCell>{row.calories}</TableCell>
									<TableCell>{row.fat}</TableCell>
									<TableCell>
										<Checkbox
											/* checked={checked} */
											/* onChange={handleChange} */
											inputProps={{ 'aria-label': 'primary checkbox' }}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Fragment>
	);
}
