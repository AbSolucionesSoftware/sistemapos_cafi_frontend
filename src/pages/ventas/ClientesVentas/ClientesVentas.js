import React, { useState } from 'react';

import {  Box, Button, Dialog, DialogContent,  Grid, IconButton, InputBase, makeStyles, Paper, Slide, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons';
import ListaClientes from '../../sucursales/Catalogos/Cliente/ListaClientes';
import CrearCliente from '../../sucursales/Catalogos/Cliente/CrearCliente';
import { ClienteProvider } from '../../../context/Catalogos/crearClienteCtx';
import CloseIcon from '@material-ui/icons/Close';
import { FcBusinessman } from 'react-icons/fc';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		fontSize: 100
	},
	root: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	}
}));

export default function ClientesVentas() {

    const classes = useStyles();
	
	const [ filtro, setFiltro ] = useState('');
	const [ values, setValues ] = useState('');

	const pressEnter = (e) => {
		if (e.key === 'Enter') setFiltro(e.target.defaultValue);
	};

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    return (
        <div>
            <ClienteProvider>

            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <FcBusinessman style={{fontSize: 50}} />
                    </Box>
                    <Box>
                        Clientes
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
                        <Box ml={3} display='flex' flexGrow={1}  alignItems='center'>
                            <Box>
                                <FcBusinessman  style={{fontSize: 65}} />
                            </Box>
                            <Typography variant="h6" className={classes.title}>
                                Clientes
                            </Typography>
                        </Box>
                        <Box mr={2}>
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon style={{fontSize: 30}} />
                            </Button>
                        </Box>
                    </Grid>
                    <Box m={2} display="flex" justifyContent="space-between">
                        <Box mr={5} minWidth="70%">
                            <Paper className={classes.root}>
                                <InputBase
                                    fullWidth
                                    placeholder="Buscar cliente..."
                                    onChange={(e) => setValues(e.target.value)}
                                    onKeyPress={pressEnter}
                                    value={values}
                                />
                                <IconButton onClick={() => setFiltro(values)}>
                                    <Search />
                                </IconButton>
                            </Paper>
                        </Box>
                        <CrearCliente tipo="CLIENTE" accion="registrar" />
                    </Box>
                    <Box mx={2}>
                        <ListaClientes tipo="CLIENTE" filtro={filtro} />
                    </Box>
                </DialogContent>
            </Dialog>
            </ClienteProvider>
        </div>
    )
}