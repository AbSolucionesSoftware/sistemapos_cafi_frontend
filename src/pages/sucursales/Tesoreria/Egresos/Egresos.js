import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import VistaRegistroEgreso from './VistaRegistroEgreso';
import ListaEgresos from './ListaEgresos';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import egresoIcon from '../../../../icons/income.svg'
import { Search } from '@material-ui/icons';
import { Box, Grid, InputBase, Paper} from '@material-ui/core';

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
	iconSize: {
		fontSize: 40,
        color: theme.palette.info.main
	},
	iconSizeSecond: {
		width: 40,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Egresos() {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={egresoIcon} alt="icono egreso" className={classes.icon} />
					</Box>
					Egresos
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                        Egresos
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
									placeholder="Buscar egreso credito o contado..."
									// onChange={(e) => setValues(e.target.value)}
									// onKeyPress={pressEnter}
									// value={values}
								/>
								<IconButton>
									<Search />
								</IconButton>
							</Paper>
						</Box>
						<VistaRegistroEgreso accion='registrar'/>
					</Box>
					<Grid item lg={12}>
						<Box p={2}>
							<ListaEgresos />
						</Box>
					</Grid>
				</div>
			</Dialog>
		</div>
	);
}
