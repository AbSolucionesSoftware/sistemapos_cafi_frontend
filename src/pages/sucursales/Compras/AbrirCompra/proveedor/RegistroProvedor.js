import React, { Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { InputLabel, makeStyles } from '@material-ui/core';
import { Paper, InputBase, Divider } from '@material-ui/core';
import { Box, FormControl, Select, MenuItem, Button } from '@material-ui/core';
/* import { Search } from '@material-ui/icons'; */

const useStyles = makeStyles((theme) => ({
	rootBusqueda: {
		padding: '0px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		height: 40
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
}));

export default function RegistroProvedor() {
	const classes = useStyles();

	return (
		<Fragment>
			<Paper component="form" variant="outlined" className={classes.rootBusqueda}>
				<FormControl variant="outlined" fullWidth size="small" >
					<InputLabel id="lista-proveedores-select">Elige tu proveedor</InputLabel>
					<Select
                        inputProps={{disableUnderline: true}}
						id="form-proveedor"
						/* value={age} */ /* onChange={handleChange} */ labelId="lista-proveedores-select"
						label="Elige tu proveedor"
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						<MenuItem value={10}>Ten</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
				</FormControl>
				<Divider className={classes.divider} orientation="vertical" />
				<Button size="medium" color="primary" startIcon={<AddIcon fontSize="large" />}>
					Nuevo
				</Button>
			</Paper>
		</Fragment>
	);
}
