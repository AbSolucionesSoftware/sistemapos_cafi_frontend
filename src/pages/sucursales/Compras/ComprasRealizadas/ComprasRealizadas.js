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
import { FcInspection } from 'react-icons/fc';
import { Box, TextField } from '@material-ui/core';
import ListaCompras from './ListaCompras';

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
	},
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

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ComprasRealizadas() {
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
						<FcInspection className={classes.icon} />
					</Box>
					Compras realizadas
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Compras realizadas
						</Typography>
						{/* <Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClose}>
                                save
                            </Button>
                        </Box> */}
                        <Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
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
					<ListaCompras/>
				</Box>

			</Dialog>
		</div>
	);
}
