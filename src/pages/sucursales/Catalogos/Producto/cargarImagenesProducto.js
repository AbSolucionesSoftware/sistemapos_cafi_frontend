import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button, Divider, Grid } from '@material-ui/core';
import { AddPhotoAlternate, Visibility, Delete } from '@material-ui/icons';

import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		width: '100%',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
	},
	input: {
		display: 'none'
	}
}));

export default function CargarImagenesProducto() {
	const classes = useStyles();

	return (
		<Fragment>
			<Grid container>
				<Grid item lg={6}>
					<Box>
						<input
							accept="image/*"
							className={classes.input}
							id="contained-button-file"
							multiple
							type="file"
						/>
						<label htmlFor="contained-button-file">
							<Button
								variant="contained"
								color="primary"
								component="span"
								startIcon={<AddPhotoAlternate />}
							>
								Subir imagen
							</Button>
						</label>
					</Box>
					<Box my={2} mr={5}>
						<Box className={classes.formInputFlex}>
							<Box boxShadow={2} height={64} width={64}>
								imagen
							</Box>
							<Box width="90%">
								<Typography noWrap>
									imagen_cocacola_500ml_blablablaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
								</Typography>
								<Typography variant="caption">257kbits</Typography>
								<Box display="flex" justifyContent="flex-end">
									<Button size="small" startIcon={<Visibility />}>
										previsualizar
									</Button>
									<Box mx={1} />
									<Button size="small" color="secondary" startIcon={<Delete />}>
										eliminar
									</Button>
								</Box>
							</Box>
						</Box>
						<Divider />
					</Box>
				</Grid>
				<Grid item lg={6}>
					<Box display="flex" minHeight={300}>
						<Box mx={1}>
							<Divider orientation="vertical" />
						</Box>
						<Box width="100%" display="flex" justifyContent="center" alignItems="center">
							<PhotoSizeSelectActualOutlinedIcon style={{ fontSize: 150 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	);
}
