import React, {  useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, Slide, Box, Button, Toolbar, Typography, FormControl, MenuItem, Select, Grid, TextField} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import { useQuery } from '@apollo/client';
import { OBTENER_HISTORIAL_CAJA} from '../../../../gql/Cajas/cajas';
import { useDebounce } from 'use-debounce/lib';
import TablaHistorialFiltrado from './TablaHistorialFiltrado';
import SaveIcon from '@material-ui/icons/Save';
import ExcelFile from 'react-export-excel/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-export-excel/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel/dist/ExcelPlugin/elements/ExcelColumn';

const useStyles = makeStyles((theme) => ({
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
    appBar: {
		position: 'relative'
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	icon: {
		fontSize: 40,
		width: 40
	},
    iconSave: {
		zIndex: 10,
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(10)
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const tipos = [
    'TODOS',
    'VENTA',
    'DEPOSITO',
    'RETIRO',
    'TRANSFERENCIA'
];

export default function HistorialCaja(props) {
    const classes = useStyles();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const [ datosBuscar, setDatosBuscar ] = useState([]);
    const [ datosExcel, setDatosExcel ] = useState([]);
	const [ value ] = useDebounce(datosBuscar, 500);

	let obtenerHistorialCaja = [];

    /* Queries */
	const {  data, refetch, loading } = useQuery(OBTENER_HISTORIAL_CAJA, {
		variables: {
            id_Caja: props.cajaSelected._id,
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
            input: {
                tipo_movimiento: datosBuscar.tipo_movimiento ? datosBuscar.tipo_movimiento :  "",
                fecha_incio: datosBuscar.fecha_incio ? datosBuscar.fecha_incio : "",
                fecha_fin: datosBuscar.fecha_fin ? datosBuscar.fecha_fin : "",
                usuario: value.usuario ? value.usuario : ""
            },
		}
	});

    useEffect(
		() => {
			refetch();
		},
		[ refetch ]
	);

    let arrayExcel = [];

    const agruparDatos = (datosHistorial) => {
        datosExcel.splice(0, datosExcel.length);
        for (let i = 0; i < datosHistorial.length; i++) {
            arrayExcel = { 
                fecha: datosHistorial[i].fecha_movimiento.completa,
                hora_movimiento: datosHistorial[i].hora_moviento.completa,
                nombre: datosHistorial[i].nombre_usuario_creador,
                horario_turno: datosHistorial[i].horario_turno,
                tipo_movimiento: datosHistorial[i].tipo_movimiento,
                concepto: datosHistorial[i].concepto,
                caja: datosHistorial[i].numero_caja,
                monto_efectivo: datosHistorial[i].montos_en_caja.monto_efectivo , 
                monto_creditos: datosHistorial[i].montos_en_caja.monto_creditos , 
                monto_tarjeta_credito: datosHistorial[i].montos_en_caja.monto_tarjeta_credito , 
                monto_tarjeta_debito: datosHistorial[i].montos_en_caja.monto_tarjeta_debito , 
                monto_puntos: datosHistorial[i].montos_en_caja.monto_puntos , 
                monto_cheques: datosHistorial[i].montos_en_caja.monto_cheques , 
                monto_transferencia: datosHistorial[i].montos_en_caja.monto_transferencia ,
                monto_vales_despensa: datosHistorial[i].montos_en_caja.monto_vales_despensa , 
            }
            datosExcel.push(arrayExcel);
        };
    };

	if(data){
		obtenerHistorialCaja = data.obtenerHistorialCaja;
        agruparDatos(obtenerHistorialCaja);
	}

    const handleDatos = (e) => {
        setDatosBuscar({...datosBuscar, [e.target.name]: e.target.value})
    };

    const filtrarProductos = (event) => {
		event.preventDefault();
        refetch();
	};

    const limpiarFiltros = () => {
        setDatosBuscar([]);
    }

    return (
        <Dialog fullScreen open={props.open} onClose={()=>{props.handleClose();}} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h5" className={classes.title}>
                        Caja {props.cajaSelected.numero_caja}
                    </Typography>
                    <Box m={1}>
                        <Button variant="contained" color="secondary" onClick={ () => {props.handleClose()} } size="large">
                            <CloseIcon style={{fontSize: 30}} />
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
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
                    filename={`Reporte de Historial de Caja ${props.cajaSelected.numero_caja}`}
                >
                    <ExcelSheet data={datosExcel} name={`Reporte de Historial de Caja ${props.cajaSelected.numero_caja}`}>
                        <ExcelColumn label='Usuario' value='nombre' />
                        <ExcelColumn label='Fecha Movimiento' value='fecha' />
                        <ExcelColumn label='Hora Movimiento' value='hora_movimiento' />
                        <ExcelColumn label='Horario en Turno' value='horario_turno' />
                        <ExcelColumn label='Concepto' value='concepto' />
                        <ExcelColumn label='Tipo Movimiento' value='tipo_movimiento' />
                        <ExcelColumn label='No. de Caja' value='caja' />
                        <ExcelColumn label='M. en Efectivo' value='monto_efectivo' />
                        <ExcelColumn label='M. en Creditos' value='monto_creditos' />
                        <ExcelColumn label='M. en T. Credito' value='monto_tarjeta_credito' />
                        <ExcelColumn label='M. en T. Debito' value='monto_tarjeta_debito' />
                        <ExcelColumn label='M. en Puntos' value='monto_puntos' />
                        <ExcelColumn label='M. en Cheques' value='monto_cheques' />
                        <ExcelColumn label='M. en Transferencia' value='monto_transferencia' />
                        <ExcelColumn label='M. en Vale Despensa' value='monto_vales_despensa' />
                    </ExcelSheet>
                </ExcelFile>
                <Grid item lg={12} md={12} xs={12}>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>
                                Movimiento
                            </Typography>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                size="small"
                            >
                                <Select
                                    id="form-producto-tipo"
                                    name="tipo_movimiento"
                                    onChange={handleDatos}
                                    value={datosBuscar.tipo_movimiento ? datosBuscar.tipo_movimiento : ""}
                                >
                                    <MenuItem value="">
                                        <em>Selecciona uno</em>
                                    </MenuItem>
                                    {tipos.map((tipo) => {
                                        return(
                                            <MenuItem value={tipo}>{tipo}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Box>	
                        <Box width="100%">
                            <Typography>
                                Fecha inicio:
                            </Typography>
                            <TextField 
                                fullWidth
                                size="small"
                                name="fecha_incio"
                                variant="outlined"
                                type="date"
                                value={datosBuscar.fecha_incio ? datosBuscar.fecha_incio : ""}
                                onChange={handleDatos}
                            />
                        </Box>
                        <Box width="100%">
                            <Typography>
                                Fecha fin:
                            </Typography>
                            <TextField 
                                fullWidth
                                size="small"
                                name="fecha_fin"
                                variant="outlined"
                                type="date"
                                value={datosBuscar.fecha_fin ? datosBuscar.fecha_fin : ""}
                                onChange={handleDatos}
                            />
                        </Box>
                        <form onSubmit={filtrarProductos} style={{ display: 'flex', alignItems: 'center', width: "100%" }} >
                            <Box width="100%">
                                <Typography>
                                    Usuario:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="usuario"
                                    variant="outlined"
                                    value={datosBuscar.usuario ? datosBuscar.usuario : ""}
                                    onChange={handleDatos}
                                />
                            </Box>
                        </form>
                        <Box width="70%" display="flex" justifyContent="center" justifyItems="center" alignItems="center">
                            <Box mt={2}>
                                <Button
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    onClick={limpiarFiltros}
                                >
                                    Limpiar
                                </Button>
                            </Box>
                        </Box>
                    </div>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                    <TablaHistorialFiltrado loading={loading} historial={obtenerHistorialCaja} />
                </Grid>  
            </Grid>
        </Dialog>
    );
}

