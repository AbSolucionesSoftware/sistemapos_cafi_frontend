import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import React from 'react';

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
}));

export default function FormRegistroEgresos({tipo}) {

    const classes = useStyles();

    return (
        <>
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
            {tipo ==='credito' ? (
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
            ):(null)}
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
            {tipo ==='credito' ? (
                <>
                    <Box width="100%">
                        <Typography>Anticipo:</Typography>
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
                        <Typography>Restante:</Typography>
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
                </>
            ):(null)}
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
