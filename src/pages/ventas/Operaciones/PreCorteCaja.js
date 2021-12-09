import React, { useState } from 'react'
import useStyles from '../styles';
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Slide, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import 'moment/locale/es';
import { useQuery } from '@apollo/client';
import { OBTENER_PRE_CORTE_CAJA } from '../../../gql/Cajas/cajas';
moment.locale('es');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreCorteCaja() {
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const input = { 
        horario_en_turno: "ABRIR TURNO",
        id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
        id_usuario: sesion._id,
        token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : ""
    };

    const { data, refetch} = useQuery(OBTENER_PRE_CORTE_CAJA, {
        variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id, input: input},
    });

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { 
		setOpen(!open);
	};
    
    if(!data) return null;

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.altKey && e.keyCode === 79){ 
            handleClickOpen();
            refetch();
        } 
    };

    return (
        <>
            <Button
                onClick={() =>{
                    handleClickOpen()
                    refetch()
                }}
                style={{textTransform: 'none', height: '100%', width: '60%'}}
            >
                <Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register.svg' 
                            alt="icono caja" 
                            style={{width: 20}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Pre corte caja</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>Alt + O</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>	

            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>
                <DialogContent>
                    <Grid container>
                        <Grid item lg={10}>
                            <Box
                                display="flex" 
                                alignItems="center"
                            >
                                <Box>
                                    <img src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cash-register.svg' alt="icono caja" className={classes.iconSizeDialogs} />
                                </Box>
                                <Box ml={2}>
                                    <Box textAlign="left">
                                        <Typography variant="h6">
                                            Pre-Corte de Caja
                                        </Typography>
                                    </Box>
                                    <Box display="flex">
                                        <Box textAlign="right">
                                            <Typography variant="caption">
                                                {moment().format('MM/DD/YYYY')}
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right" ml={2}>
                                            <Typography variant="caption">
                                                <b>{moment().format('h:mm')} hrs.</b>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item lg={2}>
                            <Box ml={4} display="flex" alignItems="center" justifyContent="flex-end">
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Box p={2}>
                        {sesion.turno_en_caja_activo === true ? (
                            <>
                                <Box>
                                    <Typography variant="subtitle1"> 
                                        <b>Usuario: </b> {sesion.nombre}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"> 
                                        <b>Caja: </b> {turnoEnCurso ? turnoEnCurso.numero_caja : ''}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1"> 
                                        <b>Fecha y hora al precorte: </b> 
                                    </Typography>
                                    <Typography variant="subtitle1"> 
                                        {moment().format('MMMM D YYYY, h:mm:ss a')}
                                    </Typography>
                                </Box>
                                <Box textAlign="center" p={2}>
                                    <Typography variant="h6"> 
                                        <b>Monto total en efectivo: </b> 
                                    </Typography>
                                    <Typography variant="h3" style={{color: "green"}}> 
                                        <b>${data.obtenerPreCorteCaja.monto_efectivo_precorte}</b> 
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <Box textAlign="center" p={2}>
                                <Typography variant="h6"> 
                                    <b>Por el momento no hay un turno en sesión</b> 
                                </Typography>
                            </Box>
                        )}
                        </Box>
                    </Grid>
                </DialogContent>
                
                <DialogActions>
                    {turnoEnCurso ? (
                        <Button 
                            onClick={handleClickOpen} 
                            color="primary"
                            variant="outlined"
                            size="large"
                            autoFocus
                        >
                            Imprimir Ticket
                        </Button>
                    ) : null }
                </DialogActions>

            </Dialog>
        </>
    )
}