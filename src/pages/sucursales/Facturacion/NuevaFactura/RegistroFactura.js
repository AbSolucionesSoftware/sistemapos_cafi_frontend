import React from 'react'; 

import { Box, Grid, IconButton, InputBase, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	iconSvg: {
		width: 50
	}
}));

export default function RegistroFactura() {

    const classes = useStyles();

    return (
        <div>
            <Box p={2} display="flex" width="100%">
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            <b>Fecha</b>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="tipo_cliente"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>
                            <b>Folio:</b>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="tipo_cliente"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>
                            <b>Serie:</b>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="tipo_cliente"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>
                            <b>Tipo pago:</b>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="tipo_cliente"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>
                            <b>Moneda:</b>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="tipo_cliente"
                            variant="outlined"
                            disabled
                        />
                    </Box>
                </div>
            </Box>
            <Box p={2}>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
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
            </Box>
            
        </div>
    )
}
