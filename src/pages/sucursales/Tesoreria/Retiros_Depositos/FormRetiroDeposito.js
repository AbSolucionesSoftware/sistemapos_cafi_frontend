import { Box, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    formComboBox:{
        height: '50%'
    }
}));

export default function FormRetiroDeposito() {

    const classes = useStyles();
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Movimiento a Realizar:</Typography>
                    <Select
                        className={classes.formComboBox}    
                        size="small"
                        value={age}
                        variant="outlined"
                        fullWidth
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Box>
                <Box width="100%" >
                    <Typography>Fecha de retiro:</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        /* error */
                        name="nombre_comercial"
                        id="form-producto-nombre-comercial"
                        variant="outlined"
                        type="date"
                        defaultValue="2017-05-24"
                        InputLabelProps={{
                        shrink: true,
                        }}
                        /* value="" */
                        /* helperText="Incorrect entry." */
                        /* onChange={obtenerCampos} */
                    />
                </Box>
            </div>
            <div className={classes.formInputFlex}>
                <Box width="100%">
                    <Typography>Persona que retira</Typography>
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
                    <Typography>Persona que entrega</Typography>
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
                    <Typography>Caja a Retirar</Typography>
                        <Select
                            className={classes.formComboBox}    
                            size="small"
                            value={age}
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                </Box>
                <Box width="100%">
                    <Typography>Monto a retirar:</Typography>
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
        </div>
    )
}
