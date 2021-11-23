import React from 'react';
import { Box, Avatar, makeStyles, Typography, Slider, TextField, Button } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles((theme) => ({
	avatarGroup: {
		'& > .MuiAvatarGroup-avatar': {
			width: theme.spacing(8),
			height: theme.spacing(8)
		}
	},
	root: {
		width: 300
	},
	margin: {
		height: theme.spacing(3)
	}
}));

export default function RegistrarDescuento() {
	const classes = useStyles();

	const marks = [
		{
			value: 0,
			label: '0%'
		},
		{
			value: 50,
			label: '50%'
		},
		{
			value: 100,
			label: '100%'
		}
	];

	function valuetext(value) {
		return `${value}%`;
	}

	return (
		<Box boxShadow={3} height="100%">
			<Box p={2} display="flex" justifyContent="center">
				<AvatarGroup max={6} className={classes.avatarGroup}>
					<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.sizes} />
					<Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" className={classes.sizes} />
					<Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" className={classes.sizes} />
					<Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" className={classes.sizes} />
					<Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" className={classes.sizes} />
					<Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" className={classes.sizes} />
					<Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" className={classes.sizes} />
				</AvatarGroup>
			</Box>
			<Box mt={5} display="flex" justifyContent="center">
				<div className={classes.root}>
					<Typography id="discrete-slider-always" gutterBottom>
						Porcentaje de descuento
					</Typography>
                    <Box my={5} />
					<Slider
						defaultValue={50}
						getAriaValueText={valuetext}
						aria-labelledby="discrete-slider-always"
						marks={marks}
						valueLabelDisplay="on"
					/>
				</div>
			</Box>
			<Box mt={5} display="flex" justifyContent="center">
				<div>
					<Typography>Precio con Descuento</Typography>
					<TextField
						/* fullWidth */
						type="number"
						InputProps={{ inputProps: { min: 0 } }}
						size="small"
						/* error */
						/* name="precio_neto" */
						/* id="form-producto-nombre-comercial" */
						variant="outlined"
						/* value="" */
						/* helperText="Incorrect entry." */
						/* onChange={obtenerCampos} */
					/>
				</div>
			</Box>
            <Box mt={5} display="flex" justifyContent="center">
				<Button variant="contained" color="primary" size="large">
                    Guardar 
                </Button>
			</Box>
		</Box>
	);
}
