import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Box, Button, Dialog, 
        DialogContent,  DialogTitle, makeStyles, 
        Slide, TextField, Typography 
} from '@material-ui/core'
import { formatoMexico } from '../../../../../../config/reuserFunctions';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	input: {
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
    },
}));

export default function AbonoaRecibir() {
    const classes = useStyles();
    
    const [open, setOpen] = useState(false);
    const [abono, setAbono] = useState(''); 
    

    const handleClick = () => { 
        setOpen(!open);
    };

    return (
        <div>
            <Button
                size="medium"
                variant="outlined" 
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleClick}
            >
                Abonar
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                fullWidth
                maxWidth='xs'
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <Box display="flex">
                        <Box p={1} flexGrow={1}>
                            Registrar nuevo abono
                        </Box>
                        <Box p={1}>
                            <Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon />
							</Button>
                        </Box>
                    </Box>
                    
                </DialogTitle>
                <DialogContent>
                   
                    <Box width="100%" mt={1}>
                        <Typography>
                            <b>Nombre de Provedor:</b>
                        </Typography>
                        <Typography>
                            SUTANO
                        </Typography>
                    </Box>
                    <Box width="100%" mt={2} display='flex'>
                        <Box flexGrow={1}>
                            <Typography >
                                <b>Total cuenta</b>
                            </Typography>
                        </Box>
                        <Typography >
                            <b>${formatoMexico()}</b>
                        </Typography>
                    </Box>
                    <Box width="100%" display='flex'>
                        <Box flexGrow={1}>
                            <Typography >
                                <b>Total abonado</b>
                            </Typography>
                        </Box>
                        <Typography >
                            <b>${formatoMexico()}</b>
                        </Typography>
                    </Box>
                    <Box width="100%" display='flex'>
                        <Box flexGrow={1}>
                            <Typography >
                                <b>Total restante</b>
                            </Typography>
                        </Box>
                        <Typography >
                            <b>${formatoMexico()}</b>
                        </Typography>
                    </Box>
                    <Box width="100%"  mt={2} >
                        <Typography>Cantidad a abonar:</Typography>
                        <TextField
                            fullWidth
                            className={classes.input}
                            onChange={(e) => setAbono(e.target.value)}
                            value={abono}
                            size="small"
                            name="abono_recibir"
                            variant="outlined"
                            type='number'
                        />
                    </Box>
                </DialogContent>
                <Box display="flex" justifyContent="center" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 18}}
                        onClick={handleClick}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog>
        </div>
    )
}
