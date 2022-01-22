import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, makeStyles, Slide, TextField, Typography } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(.5)}px`
		},
		'& .obligatorio': {
			color: 'red'
		},
        paddingTop: 0,
        alignItems: "center",
        justifyItems: "center"
	},
}))

export default function Acceso() {
    const classes = useStyles();    

    const [ open, setOpen] = useState(false);
    const [datosUser, setDatosUser] = useState([]);
    
    const handleClickOpen = () => {
        setOpen(!open);
    };

    const obtenerDatos = (e) => { 
        setDatosUser({...datosUser, [e.target.name]: e.target.value})
    }
    
    return (
            <Dialog
                maxWidth='sm'
                open={true} 
                onClose={handleClickOpen} 
                TransitionComponent={Transition}
            >
                <Box p={3}>
                    <Box p={2}>
                        <Typography variant='h6'>
                            <b>Por favor autirice con su usuario y contraseña</b>
                        </Typography>
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Numero Usuario:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    name='numero_usuario'
                                    size="small"
                                    disabled={true}
                                    variant="outlined"
                                    onChange={obtenerDatos}
                                />
                            </Box>
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Contrasena:
                            </Typography>
                            <Box display="flex">
                                <TextField
                                    fullWidth
                                    size="small"
                                    type='password'
                                    name="password"
                                    variant="outlined"
                                    onChange={obtenerDatos}
                                />
                            </Box>
                        </Box>
                    </div>
                </Box>
                <DialogActions>
                    <Button
                        color='primary'
                        size='medium'
                        variant="outlined"
                        onClick={handleClickOpen}
                    >
                        Autorizar
                    </Button>
                    <Button
                        color='secondary'
                        size='medium'
                        variant="outlined"
                        onClick={handleClickOpen}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
    );
}
