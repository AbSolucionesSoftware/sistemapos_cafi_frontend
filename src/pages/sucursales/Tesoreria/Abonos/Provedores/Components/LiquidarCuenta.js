import React, { useState } from 'react'

import {  Box, Button, Dialog, DialogActions, DialogContent, makeStyles, TextField, Typography } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

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
    appBar: {
		position: 'relative'
	},
}));

export default function LiquidarCuenta() {

    const [open, setOpen] = useState(false);

    const handleClick = () => { 
        setOpen(!open);
    } 
    const classes = useStyles();

    return (
        <div>
            <Button
                size="medium"
                variant="outlined"  
                color="primary"
                startIcon={<DoneIcon />}
                onClick={handleClick}
            >
                Liquidar
            </Button>

            <Dialog
                open={open}
                fullWidth
                maxWidth='xs'
                onClose={handleClick}
                aria-labelledby="draggable-dialog-title"
            >
                <Box display="flex">
                    <Box flexGrow={1} p={2}>
                        <Typography variant="h6" className={classes.title}>
                            Abonos a Proveedores
                        </Typography>
                    </Box>
                    <Box p={1}>
                        <Button variant="contained" color="secondary" onClick={handleClick} size="large">
                            <CloseIcon  />
                        </Button>
                    </Box>
				</Box>
                <DialogContent>
                    <Box width="100%" textAlign="center">
                        <Typography>Aplica un descuento por pronto pago</Typography>

                        <Box p={1}>
                            <ToggleButtonGroup
                                // value={alignment}
                                exclusive
                                // onChange={handleAlignment}
                                aria-label="text alignment"
                            >
                                <Box p={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        Por decuento
                                    </Button>
                                </Box>
                                <Box p={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                    >
                                        Por pesos
                                    </Button>
                                </Box>
                            </ToggleButtonGroup>
                        </Box>
                       
                        <TextField
                            fullWidth
                            size="small"
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="10% o $100.00" 
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Sub Total: </Typography>
                        </Box>
                        <Box width="100%">
                            <Typography>$150000</Typography>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Descuento: </Typography>
                        </Box>
                        <Box width="100%">
                            <Typography>$150000</Typography>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Total a pagar:</Typography>
                        </Box>
                        <Box width="100%">
                            <Typography>$150000</Typography>
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClick} 
                        color="primary"
                        variant="contained"
                        size="large"
                    >
                        Liquidar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
