import React, { useState } from 'react';

import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { Box, Button, Dialog, DialogActions, makeStyles, TextField, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';

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
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
}));

export default function FormTransferencia() {

    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClick = () =>{setOpen(!open)};

    return (
        <>

        <Button color="primary" variant="contained" size="large" onClick={handleClick}>
            <Add /> Nueva Transferencia
        </Button>

        <Dialog open={open} onClose={handleClick} fullWidth maxWidth="lg">
            <div className={classes.root}>
                
            </div>
				<DialogActions>
					<Button
						variant="outlined"
						color="secondary"
						onClick={handleClick}
						size="large"
						startIcon={<CloseIcon />}
					>
						Cerrar
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleClick}
						size="large"
						startIcon={<DoneIcon />}
					>
						Guardar
					</Button>
				</DialogActions>
			</Dialog>
        <div className={classes.formInputFlex}>
            <Box width="100%">
                <Typography>Folio:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Folio factura:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Fecha: </Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
        </div>
        
        <div className={classes.formInputFlex}>
            <Box width="100%">
                <Typography>Categoria:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>SubCatergoria:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Fecha Pago:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
        </div>
        <div className={classes.formInputFlex}>
            <Box width="100%">
                <Typography>Usuario:</Typography>
                <TextField
                    fullWidth
                    size="small" 
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Empresa: </Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Provedor: </Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Motivo:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
        </div>
        <div className={classes.formInputFlex}>
            <Box width="100%">
                <Typography>Cantidad:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Metodo de pago:</Typography>
                <TextField
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
        </div>
        <div className={classes.formInputFlex}>
            <Box width="100%">
                <Typography>Concepto:</Typography>
                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
            <Box width="100%">
                <Typography>Observación:</Typography>
                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                    /* error */
                    name="nombre_comercial"
                    id="form-producto-nombre-comercial"
                    variant="outlined"
                    /* value="" */
                    /* helperText="Incorrect entry." */
                    /* onChange={obtenerCampos} */
                />
            </Box>
        </div>
        </>
    )
}
