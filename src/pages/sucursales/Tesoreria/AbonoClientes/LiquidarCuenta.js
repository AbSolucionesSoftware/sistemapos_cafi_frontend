import React, { useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function LiquidarCuenta() {

    const [open, setOpen] = useState(false);

    const handleClick = () => { 
        setOpen(!open);
    } 

    return (
        <div>
            <Button
                size="large"
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
                    <DialogContentText>
                    Esta seguro que desea liquidar la cuenta del cliente FULANO, por la cantidad total de: $ 150,000 MX.
                    </DialogContentText>
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
