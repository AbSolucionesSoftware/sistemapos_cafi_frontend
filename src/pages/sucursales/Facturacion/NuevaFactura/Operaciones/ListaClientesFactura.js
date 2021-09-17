import React, { useState } from 'react';
import { Box, DialogContent, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';

import cliente from '../../../../../icons/perfil.svg';
import { Search } from '@material-ui/icons';
import ListaClientes from '../../../Catalogos/Cliente/ListaClientes';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`
		}
	},
    root: {
		width: '100%'
	},
	container: {
		maxHeight: '40vh'
	}
}));

export default function ListaClientesFacturas({handleClickOpen}) {

    const classes = useStyles();
	const [ filtro, setFiltro ] = useState('');
	const [ values, setValues ] = useState('');

    const pressEnter = (e) => {
		if (e.key === 'Enter') setFiltro(e.target.defaultValue);
	};

    return (
        <div>
            <DialogContent>
                <Grid item lg={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <img src={cliente} alt="icono Factura" style={{width: 70}} />
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h6">
                            Clientes
                        </Typography>
                    </Box>
                    <Box mb={2}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Box display="flex" alignItems="center">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        onChange={(e) => setValues(e.target.value)}
                                        onKeyPress={pressEnter}
									    value={values}
                                        variant="outlined"
                                    />
                                    <IconButton onClick={() => setFiltro(values)}>
                                        <Search />
                                    </IconButton>
                                </Box>
                            </Box>
                        </div>
                    </Box>
                    
                    <ListaClientes tipo="CLIENTE" user="EMPLEADO" filtro={filtro} />

                </Grid>
            </DialogContent>
        </div>
    )
}
