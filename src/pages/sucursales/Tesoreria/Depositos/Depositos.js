import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid, TextField } from '@material-ui/core';
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
                            <Button autoFocus color="inherit" size="large" onClick={handleClickOpen}>
                                save
                            </Button>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>

				<Grid>
					<div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Nombre de Cliente:</Typography>
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
                            <Typography>Total Abonado:</Typography>
                            <Box mt={1}>
                                <Typography>
                                    $15,000
                                </Typography>
                            </Box>
                        </Box>
					</div>
				</Grid>
				
				<TablaDepositos />
			</Dialog>
		</div>
	);
}
