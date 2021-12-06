import React, { useState } from 'react';
import { Box, Button, DialogActions, Dialog, 
        DialogContent, Divider, Grid, 
        Typography, Slide, InputBase, Paper, 
        IconButton } from '@material-ui/core'
import useStyles from '../styles';
import { useDebounce } from 'use-debounce/lib';
import { FcSearch } from 'react-icons/fc';
import CloseIcon from '@material-ui/icons/Close';
import { Search } from '@material-ui/icons';
import ListaProductos from './ListaProductos';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function BuscarProducto() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
	const [ value ] = useDebounce("", 500);

    const handleClickOpen = () => { 
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.altKey && e.keyCode === 80){ 
            handleClickOpen();
        } 
    };

    return (
        <>
           <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <FcSearch style={{fontSize: 45}} />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Productos</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>Alt + P</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    <Grid container item lg={12}>
                        <Box
                            display="flex"
                            flexGrow={1}
                        >
                            <Box>
                                <FcSearch style={{fontSize: 65}} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                   Buscar Productos
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                        </Grid>
                        <Grid>
                            <div className={classes.formInputFlex}>
                                <Box width="50%">
                                    <Paper className={classes.rootBusqueda}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Buscar producto..."
                                        />
                                        <IconButton >
                                            <Search />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            </div>
                            <ListaProductos />
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickOpen} variant="contained" color="primary" size="large">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
