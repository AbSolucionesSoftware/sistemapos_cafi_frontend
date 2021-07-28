import React, { useState } from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';

export default function LiquidarCuenta() {

    const [open, setOpen] = useState(false);

    const handleClick = () => { 
        setOpen(!open);
    } 

    return (
        <div>
            <Button
                size="medium"
                variant="contained" 
                color="primary"
                onClick={handleClick}
            >
                Liquidar
            </Button>

            <Dialog
                open={open}
                onClose={handleClick}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Liquidar Cuenta
                </DialogTitle>
                <DialogContent>
                    <Box width="100%" textAlign="center">
                        <Typography>Descuento por pronto pago</Typography>

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
                    <Box width="100%" mt={1}>
                        <Typography>Total a pagar</Typography>
                        <Typography>
                            $150,000
                        </Typography>
                    </Box>
                    <Box width="100%" mt={1}>
                        <Typography>Cliente:</Typography>
                        <Typography>
                            Amenadiel
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        autoFocus 
                        onClick={handleClick} 
                        color="secondary"
                        variant="contained"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleClick} 
                        color="primary"
                        variant="contained"
                    >
                        Liquidar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
