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
import { FcOvertime } from 'react-icons/fc';
import { Box, TextField } from '@material-ui/core';

import ListaEnEspera from './ListaEnEspera'

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		fontSize: 100
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ComprasEnEspera() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<FcOvertime className={classes.icon} />
					</Box>
					Compras en espera
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Compras en espera
						</Typography>
						{/* <Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClose}>
                                save
                            </Button>
                        </Box> */}
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Box mx={3} p={2}>
					<div className={classes.formInputFlex}>
						<Box width="50%">
							<Typography>Buscar Compra</Typography>
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
									Buscar
								</Button>
							</Box>
						</Box>
					</div>
				</Box>
				<Box mx={5}>
					<ListaEnEspera/>
				</Box>
			</Dialog>
		</div>
	);
}
