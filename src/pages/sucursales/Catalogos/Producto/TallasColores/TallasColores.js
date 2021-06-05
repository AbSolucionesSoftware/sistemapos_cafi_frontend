import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, Select, Typography, MenuItem, Divider } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';

import { Add, Done } from '@material-ui/icons';
import TablaPresentaciones from './TablaPresentaciones';

const useStyles = makeStyles((theme) => ({
	colorContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		width: 50,
		margin: 1,
		borderRadius: '100%',
		cursor: "pointer"
	}
}));

export default function ColoresTallas() {
	const colores = ["#452299", '#1ADA12', '#D712DA', '#DA3D12', '#12DAB9', '#F5DD0C']

	return (
		<div>
			<Grid container spacing={2}>
				<Grid item md={9}>
					<TablaPresentaciones />
				</Grid>
				<Grid item md={3}>
					<Box width="100%">
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
						<Grid container>
							{colores.map((color, index) => <Colores key={index} color={color}  />)}
						</Grid>
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

const Colores = ({color}) => {
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
				{selected ? (
					<Done />
				) : null}
			</div>
		</Grid>
	);
};
