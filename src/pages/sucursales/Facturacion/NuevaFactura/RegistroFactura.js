import React, { forwardRef, useState } from 'react'; 

import { Box, Dialog, FormControl, IconButton,  makeStyles, MenuItem, Select, Slide, TextField, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import TipoCDFI from './Operaciones/TipoCDFI.js';
import ListaClientes from './Operaciones/ListaClientesFactura.js';

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
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

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroFactura() {

    const [open, setOpen] = useState(false);
    const [ventana, setVentana] = useState('');

    const handleClickOpen = () => {
        setOpen(!open)
    };

    const ventanas = () => {
		switch (ventana) {
			case 'tipocdfi':
				return <TipoCDFI handleClickOpen={handleClickOpen} />
            case 'clientes':
				return <ListaClientes handleClickOpen={handleClickOpen} />
			default:
				break;
		}
	};

    const classes = useStyles();

    return (
        <div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>
                        Folio:
                    </Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            type='number'
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>
                        Fecha:
                    </Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            type="date"
                            size="small"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>
                        Serie:
                    </Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>
                        Moneda:
                    </Typography>
                    <Box display="flex">
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>
                        Forma de pago:
                    </Typography>
                    <Box display="flex">
                        <FormControl variant="outlined" style={{width: '100%'}} >
                            <Select
                                value={10}
                                label="Age"
                                style={{ height: '75%', width: '100%' }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Efectivo</MenuItem>
                                <MenuItem value={20}>Tarjeta Credito</MenuItem>
                                <MenuItem value={30}>Tarjeta Debito</MenuItem>
                                <MenuItem value={40}>Credito</MenuItem>
                                <MenuItem value={50}>Modenedero Electronico</MenuItem>
                                <MenuItem value={60}>Vales despensa</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>
                        Cliente:
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                        <IconButton
                            onClick={() =>{
                                setVentana('clientes')
                                handleClickOpen()
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Box>
                </Box>
                <Box width="100%">
                    <Typography>
                        Uso de CDFI:
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                        <IconButton
                            onClick={() =>{
                                setVentana('tipocdfi')
                                handleClickOpen()
                            }}
                        >
                            <Search />
                        </IconButton>
                    </Box>
                </Box>
            </div>
            
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
				{ventanas()}
			</Dialog>
            
        </div>
    )
}
