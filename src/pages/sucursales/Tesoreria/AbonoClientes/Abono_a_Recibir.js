import { Box, Button, Dialog,  DialogContent,  DialogTitle, Slide, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

// const useStyles = makeStyles((theme) => ({
// 	formInputFlex: {
// 		display: 'flex',
// 		'& > *': {
// 			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
// 		}
// 	},
// 	formInput: {
// 		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
// 	},
// }));

export default function AbonoaRecibir() {
    
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
                   Abonar
                </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Abono a recibir por cuenta"}</DialogTitle>
                <DialogContent>
                        <Box width="100%" p={1}>
                            <Typography>Nombre de Cliente: SUTANO</Typography>
                        </Box>
                        <Box width="100%" p={1}>
                            <Typography>Total a abonar:  $15,100</Typography>
                        </Box>
                        <Box p={1}>
                            <Alert severity="info">Si desea editar el abono del cliente, <br/>
                            procure este sea mayor al establecido</Alert>
                        </Box>

                        <Box width="100%">
                            <Typography>Cuenta No. 2501265</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                /* error */
                                name="nombre_comercial"
                                id="form-producto-nombre-comercial"
                                variant="outlined"
                                value="$150,000.00 Mx" 
                                /* helperText="Incorrect entry." */
                                /* onChange={obtenerCampos} */
                            />
                        </Box>
                        <Box width="100%">
                            <Typography>Cuenta No. 2501265</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                /* error */
                                name="nombre_comercial"
                                id="form-producto-nombre-comercial"
                                variant="outlined"
                                value="$150,000.00 Mx" 
                                /* helperText="Incorrect entry." */
                                /* onChange={obtenerCampos} */
                            />
                        </Box>
                </DialogContent>
                <Box display="flex" justifyContent="center" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 16}}
                        onClick={handleClick}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog>
        </div>
    )
}
