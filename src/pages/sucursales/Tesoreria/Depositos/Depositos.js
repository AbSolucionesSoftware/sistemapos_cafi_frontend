import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, FormControl, Button, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import depositoIcon from '../../../../icons/depositar.svg';

import TablaDepositos from './TablaDepositos';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		width: 100
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Depositos() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={depositoIcon} alt="icono depostio" className={classes.icon} />
					</Box>
					Depositos
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Depositos
						</Typography>
						<Box mx={3}>
                            <Button autoFocus color="inherit" variant="outlined" size="large" >
                                Realizar Deposito
                            </Button>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>

				<Grid>
					<div className={classes.formInputFlex}>
						<Box width="100%" p={2}>
							<Typography>Persona que deposita</Typography>
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
						<Box width="100%" p={2}>
							<Typography>Persona que recibe</Typography>
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
                        <Box width="100%" p={2}>
							<Typography>Caja a Depositar</Typography>
							<Box mt={1} width="100%">
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									// onChange={handleChange}
									label="Age"
								>
									 <MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={10}>Ten</MenuItem>
									<MenuItem value={20}>Twenty</MenuItem>
									<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</Box>
                        </Box>
						<Box width="100%" p={2}>
							<Typography>Monto a depositar:</Typography>
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
                        <Box width="100%"  p={2}>
                            <Typography>Fecha de deposito:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    23/Julio/2021
                                </Typography>
                            </Box>
                        </Box>
						
					</div>
				</Grid>
				<Box p={2}>
					<Box p={1}>
						<Typography variant="h6">
							Depositos realizados
						</Typography>
					</Box>
					<TablaDepositos />
				</Box>
			</Dialog>
		</div>
	);
}
