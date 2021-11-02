import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Dialog, FormControl, Grid, MenuItem, Select, Slide, TextField, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ReactExport from 'react-export-excel'; //LIBRERIA EXCEL
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import TablaTurnosFiltrados from './TablaTurnosFiltrados';
import { useQuery } from '@apollo/client';
import { OBTENER_CAJAS } from '../../../../gql/Cajas/cajas';
import { OBTENER_HISTORIAL_TURNOS } from '../../../../gql/Ventas/abrir_cerrar_turno';
import { useDebounce } from 'use-debounce';
import moment from 'moment';
import 'moment/locale/es';
import ErrorPage from '../../../../components/ErrorPage';
moment.locale('es');
const ExcelFile = ReactExport.ExcelFile; //ARCHIVO DE EXCEL
const ExcelSheet = ReactExport.ExcelSheet; //HOJA DE EXCEL
const ExcelColumn = ReactExport.ExcelColumn; //COLUMNA DE EXCEL

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
    const [open, setOpen] = useState(false);
    const handleClickOpen =()=>{setOpen(!open)};
    const classes = useStyles();

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
                                <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                    <CloseIcon style={{fontSize: 30}} />
                                </Button>
                            </Box>
						</Box>
					</Toolbar>
				</AppBar>
                <FiltroTablaTurnos />
			</Dialog> 
        </>
    )   
};

const FiltroTablaTurnos = () => {

    const classes = useStyles();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const [filtros, setFiltros] = useState([]);
    const [ datosExcel, setDatosExcel] = useState([]);
	const [value] = useDebounce(filtros, 500);
    let historialTurnos = [];

    const cajas = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
		}
	});

    const { loading, data, error, refetch  } = useQuery(OBTENER_HISTORIAL_TURNOS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
            input: {
                horario_en_turno: filtros.horario_turno ? filtros.horario_turno : "",
                usuario_en_turno: value.usuario_en_turno ? value.usuario_en_turno : "",
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

    const obtenerDatos =(e)=>{  
        setFiltros({...filtros, [e.target.name]: e.target.value.toString()});
    };

    let arrayExcel = [];

    const agruparDatos = (turnos) => {
        datosExcel.splice(0, datosExcel.length);
        for (let i = 0; i < turnos.length; i++) {
            arrayExcel = { 
                fecha: turnos[i].fecha_movimiento,
                nombre: turnos[i].usuario_en_turno.nombre,
                numero_usuario: turnos[i].usuario_en_turno.numero_usuario,
                fecha_entrada: turnos[i].fecha_entrada.completa,
                fecha_salida: turnos[i].fecha_salida.completa,
                hora_entrada: turnos[i].hora_entrada.completa,
                hora_salida: turnos[i].hora_salida.completa,
                horario_en_turno: turnos[i].horario_en_turno,
                concepto: turnos[i].concepto,
                caja: turnos[i].numero_caja,
            }
            datosExcel.push(arrayExcel);
        };
    };

    if(data && cajas.loading  === false){
		historialTurnos = data.obtenerFiltroTurnos;
        agruparDatos(historialTurnos);
	};

	if (error) {
		return <ErrorPage error={error} />;
	}

    const limpiarFiltros=()=>{
        setFiltros([]);
    };


    const filtrarProductos = (event) => {
		event.preventDefault();
        refetch();
	};
    return(
        <>
        <Grid container>
            <ExcelFile
                element={
                    <Button
                        variant="contained"
                        color="primary"
                        aria-label="Guardar"
                        className={classes.iconSave}
                    >
                        <SaveIcon className={classes.margin} />
                        Exportar
                    </Button>   
                }
                filename="Reporte de Turnos Usuarios"
            >
                <ExcelSheet data={datosExcel} name={'Reporte de Turnos Usuarios'}>
                    <ExcelColumn label='No. Usuario' value='numero_usuario' />
                    <ExcelColumn label='Usuario' value='nombre' />
                    <ExcelColumn label='Fecha Movimiento' value='fecha' />
                    <ExcelColumn label='Fecha Entrada' value='fecha_entrada' />
                    <ExcelColumn label='Fecha Salida' value='fecha_salida' />
                    <ExcelColumn label='Hora Entrada' value='hora_entrada' />
                    <ExcelColumn label='Hora Salida' value='hora_salida' />
                    <ExcelColumn label='Horario en Turno' value='horario_en_turno' />
                    <ExcelColumn label='Concepto' value='concepto' />
                    <ExcelColumn label='No. de Caja' value='caja' />
                </ExcelSheet>
            </ExcelFile>

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
                    <form onSubmit={filtrarProductos} style={{ display: 'flex', alignItems: 'center', width: "100%" }}>
                        <Box width="100%">
                            <Typography>
                                Usuario:
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="usuario_en_turno"
                                value={filtros.usuario_en_turno ? filtros.usuario_en_turno : ""}
                                variant="outlined"
                                onChange={obtenerDatos}
                            />
                        </Box>
                    </form>
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
                    <Box width="70%" display="flex" justifyContent="center" justifyItems="center" alignItems="center">
                        <Box mt={2}>
                            <Button
                                color="primary"
                                size="large"
                                variant="contained"
                                onClick={limpiarFiltros}
                            >
                                Limpiar filtro
                            </Button>
                        </Box>
                    </Box>
                </div>
            </Grid> 
           
        </Grid>    
        <Grid item lg={12}>
            <TablaTurnosFiltrados loading={loading} turnos={historialTurnos} />
        </Grid>  
        </>
    );
}