import { AppBar, Box, Button, Dialog, FormControl, Grid, MenuItem, Select, Slide, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import TablaTurnosFiltrados from './TablaTurnosFiltrados';
import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '../../../../gql/Cajas/cajas';
import { OBTENER_HISTORIAL_TURNOS } from '../../../../gql/Ventas/abrir_cerrar_turno';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

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
		},
		'& .obligatorio': {
			color: 'red'
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
    margin: {
		margin: theme.spacing(1)
	},
	iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	},
}));

export default function ReportesTurnosUsuarios() {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const classes = useStyles();
    const [filtros, setFiltros] = useState([]);
    let historialTurnos = [];

    const cajas = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
		}
	});

    const obtenerDatos =(e)=>{   
        setFiltros({...filtros, [e.target.name]: e.target.value.toString()});
    };

    const { loading, data, error, refetch  } = useQuery(OBTENER_HISTORIAL_TURNOS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
            input: {
                horario_en_turno: filtros.horario_turno ? filtros.horario_turno : "",
                usuario_en_turno: "",
                numero_caja: filtros.numero_caja ? filtros.numero_caja : "",
                fechaInicio: filtros.fechaInicio ? filtros.fechaInicio : "",
                fechaFin: filtros.fechaFin ? filtros.fechaFin : ""
            }
		}
	});

    useEffect(
		() => {
			refetch();
		},
		[ refetch ]
	);

    if(data && cajas.loading === false){
		historialTurnos = data.obtenerFiltroTurnos;
	};

    const [open, setOpen] = useState(false);

    const handleClickOpen =()=>{setOpen(!open)};

    const limpiarFiltros=()=>{
        setFiltros([]);
    }

    return (
        <>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img 
                            src='https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shift.svg'
                            alt="icono caja" 
                            style={{width: 100}}
                        />
                    </Box>
					Turnos de Usuarios
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                            Reportes Turnos de Usuarios
						</Typography>
						<Box m={1} display="flex">
                            <Box p={1}>
                                <Button variant="contained" size="large" onClick={limpiarFiltros}>
                                    Limpiar Filtro
                                </Button>
                            </Box>
                            <Box p={1}>
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon style={{fontSize: 30}} />
                                </Button>
                            </Box>
						</Box>
					</Toolbar>
				</AppBar>
                <Grid container>
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="Guardar"
                        className={classes.iconSave}
                    >
                        <SaveIcon className={classes.margin} />
                        Exportar
                    </Button>
                    <Grid item lg={12}>
                        <div className={classes.formInputFlex}>
                            <Box width="100%">
                                <Typography>
                                    Fecha inicio:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fechaInicio"
                                    variant="outlined"
                                    type="date"
                                    value={filtros.fechaInicio ? filtros.fechaInicio : ""}
                                    onChange={obtenerDatos}
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Fecha fin:
                                </Typography>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    name="fechaFin"
                                    variant="outlined"
                                    type="date"
                                    value={filtros.fechaFin ? filtros.fechaFin : ""}
                                    onChange={obtenerDatos}
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Usuario:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="usuario"
                                    value={filtros.usuario ? filtros.usuario : ""}
                                    variant="outlined"
                                />
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Caja:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-producto-tipo"
                                        name="numero_caja"
                                        value={filtros.numero_caja ? filtros.numero_caja : ""}
                                        onChange={obtenerDatos}
                                    >
                                        <MenuItem value="">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        {
                                            cajas.data?.obtenerCajasSucursal?.map((caja) =>{
                                                return(
                                                    <MenuItem key={caja.numero_caja} value={caja.numero_caja}>
                                                        Caja {caja.numero_caja}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box width="100%">
                                <Typography>
                                    Horario de Turno:
                                </Typography>
                                <FormControl
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    <Select
                                        id="form-producto-tipo"
                                        name="horario_turno"
                                        value={filtros.horario_turno ? filtros.horario_turno : ""}
                                        onChange={obtenerDatos}
                                    >
                                        <MenuItem value="">
                                            <em>Selecciona uno</em>
                                        </MenuItem>
                                        <MenuItem value="VESPERTINO">Vespertino</MenuItem>
                                        <MenuItem value="MATUTINO">Matutino</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                    </Grid> 
                    <Grid item lg={12}>
                        <TablaTurnosFiltrados turnos={historialTurnos} />
                    </Grid>
                </Grid>            
			</Dialog> 
        </>
    )   
}