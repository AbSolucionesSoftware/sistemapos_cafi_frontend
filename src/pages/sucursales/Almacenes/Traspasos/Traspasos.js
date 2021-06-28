import React, { forwardRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide, Button, Box, Dialog, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FcAdvance } from 'react-icons/fc';
import almacenIcon from '../../../../icons/almacen.svg';


const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		fontSize: 50
	},
    imagen: {
        width: 50
    }
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Traspasos() {
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
                        <FcAdvance className={classes.icon} />
					</Box>
                    <Grid container spacing={10} justify="center" >
                        <Grid item lg={2} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <img src={almacenIcon} alt="icono almacen" className={classes.imagen}/>
                                    </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={2} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Box display="flex" flexDirection="column">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <img src={almacenIcon} alt="icono almacen" className={classes.imagen} />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    Traspasos
                </Box>
					
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Traspasos
						</Typography>
						<Box mx={3}>
                            <Button autoFocus color="inherit" size="large" onClick={handleClose}>
                                Cerrar
                            </Button>
                        </Box>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
							
						</IconButton>
					</Toolbar>
				</AppBar>
				Toda la info de almacenes
			</Dialog>
        </div>
    )
}
