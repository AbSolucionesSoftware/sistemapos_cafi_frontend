import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, MenuItem, Select, TextField, Typography, Grid } from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

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

export default function RegistroAlmacenInicial() {
	const classes = useStyles();
	const [ selectedDate, setSelectedDate ] = useState(new Date('2014-08-18T21:11:54'));

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};


	return (
		<Fragment>
			<div className={classes.formInputFlex}>
				<Box width="100%">
					<Typography>Cantidad inicial</Typography>
					<Box display="flex">
						<TextField
							fullWidth
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
				</Box>
				<Box width="100%">
					<Typography>Almacen</Typography>
					<Box display="flex">
						<FormControl variant="outlined" fullWidth size="small">
							<Select id="form-producto-almacen" /* value={age} */ /* onChange={handleChange} */>
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
				<Box width="100%">
					<Typography>Fecha de expiración</Typography>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container justify="space-around">
							<KeyboardDatePicker
								margin="dense"
								id="date-picker-dialog"
								format="MM/dd/yyyy"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date'
								}}
							/>
						</Grid>
					</MuiPickersUtilsProvider>
				</Box>
			</div>
		</Fragment>
	);
}
