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
import { Box, Grid, InputBase, Paper } from '@material-ui/core';
import transferIcon from '../../../../icons/transferencia-bancaria.svg'
import { Search } from '@material-ui/icons';

import ListaTransferencias from './ListaTransferencias';
import FormTransferencia from './FormTransferencia';

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
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Transferencias() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={transferIcon} alt="icono tranferencia" className={classes.icon} />
					</Box>
					Transferencias
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Transferencias
						</Typography>
						{/* <Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClickOpen}>
                                save
                            </Button>
                        </Box> */}
                        <IconButton edge="start" color="inherit" onClick={handleClickOpen} aria-label="close">
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<div className={classes.root}>
					<Box m={3} display="flex" justifyContent="space-between">
						<Box mr={5} minWidth="70%">
							<Paper className={classes.rootBusqueda}>
								<InputBase
									fullWidth
									placeholder="Buscar transferencia..."
									// onChange={(e) => setValues(e.target.value)}
									// onKeyPress={pressEnter}
									// value={values}
								/>
								<IconButton>
									<Search />
								</IconButton>
							</Paper>
						</Box>
						<FormTransferencia/>
					</Box>
					<Grid item lg={12}>
						<Box p={2}>
							<ListaTransferencias />
						</Box>
					</Grid>
				</div>
			</Dialog>
		</div>
	);
}
