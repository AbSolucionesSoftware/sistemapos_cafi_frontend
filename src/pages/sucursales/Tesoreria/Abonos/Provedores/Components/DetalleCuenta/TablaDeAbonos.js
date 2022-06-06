import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import CircularProgress from "@material-ui/core/CircularProgress";

import {
	Dialog,
	Box,
	Button,
	DialogTitle,
	DialogActions,
	Slide,
  } from "@material-ui/core";
import { useMutation } from '@apollo/client';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from "@material-ui/icons/Close";
import {  CANCELAR_ABONO_CLIENTE } from "../../../../../../../gql/Tesoreria/abonos";
import { useQuery } from '@apollo/client';
import { OBTENER_HISTORIAL_ABONOS } from "../../../../../../../gql/Tesoreria/abonos";
import moment from 'moment';
import { withRouter } from "react-router";
import { TesoreriaCtx } from '../../../../../../../context/Tesoreria/tesoreriaCtx';
import ExportarExcel from '../../../../../../../components/ExportExcel';
import { formatoMexico,formatoFecha } from "../../../../../../../config/reuserFunctions";
const columns = [
	{ id: 'fecha', label: 'Fecha de abono', minWidth: 170, align: 'center' },
	{ id: 'cliente', label: 'Nombre', minWidth: 170, align: 'center' },
	{ id: 'abono', label: 'Monto', minWidth: 100, align: 'right' },
	{ id: 'cancelar', label: 'Cancelar', minWidth: 100, align: 'center' },
];




const columnsEffect = [
    { id: 'fecha_movimiento', label: 'Fecha', minWidth: 60 , widthPx: 160, },
    { id: 'monto_total_abonado', label: 'Cantidad abono', minWidth: 170, widthPx: 160, },
    
];
const useStyles  = makeStyles((theme) => ({
	root: {
		width: '100%',
		height: '45vh'
	},
	container: {
		maxHeight: '100%'
	},
    appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
  });

function TablaAbonos(props) {
	const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
	const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

	const { reload } = useContext(TesoreriaCtx);

	const classes = useStyles();
	
	const [abonoSelected, setAbonoSelected] = useState({});
	const [openCancelar, setOpenCancelar] = useState(false);
	const [loadingCancelar, setLoadingCancelar] = useState(false);

	const [ cancelarAbonoCliente ] = useMutation(CANCELAR_ABONO_CLIENTE);

	let dataExcel = [];
    
   
	const { loading, data, error, refetch } = useQuery(
		OBTENER_HISTORIAL_ABONOS, {
			variables: {
				empresa: sesion.empresa._id,
				sucursal: sesion.sucursal._id,
				input: {
					fecha_inicio: "",
					fecha_fin: "",
					usuario: "",
					id_cliente: props.cuenta.proveedor.id_proveedor._id,
					id_egreso: "",
					rol_movimiento: "ABONO_PROVEEDOR",
					id_compra: props.cuenta._id
				}
			},
		  	fetchPolicy: "network-only",
		}
	);
	
	let abonos = []
	if(data){
		abonos = data.obtenerHistorialAbonos;
		abonos.forEach(element => {
            dataExcel.push({
                fecha_movimiento : formatoFecha(element.fecha_movimiento.completa),
                monto_total_abonado :   element.monto_total_abonado
                
        
            })
        });
	}

	useEffect(() => {
		refetch();
	}, [reload])

	const handleOpen = () =>{
        setOpenCancelar(!props.setOpenCancelar)
      
    }
	const affirmCancelar = (abono) =>{
        try {
             
        if(turnoEnCurso){
            setOpenCancelar(true);
            setAbonoSelected(abono)
        }else{
            props.history.push('/ventas/venta-general');
        }
           
        } catch (error) {
            console.log(error)
        }
    }

 

	const cancelAbono = async() =>{
        try {
         setLoadingCancelar(true);
       
         const input = {
            tipo_movimiento: "ABONO_PROVEEDOR",
            rol_movimiento: "CAJA",
            numero_caja: parseInt(turnoEnCurso.numero_caja),
            id_Caja: turnoEnCurso.id_caja,
            fecha_movimiento: {
                year: moment().format('YYYY'),
                mes: moment().format('MM'),
                dia: moment().format('DD'),
                no_semana_year: moment().week().toString(),
                no_dia_year: moment().dayOfYear().toString(),
                completa: moment().locale('es-mx').format()
            },
            monto_abono: abonoSelected.monto_total_abonado,
           
            horario_turno: turnoEnCurso.horario_en_turno,
            hora_moviento: {
                hora: moment().format('hh'),
                minutos: moment().format('mm'),
                segundos: moment().format('ss'),
                completa: moment().format('HH:mm:ss')
            },
           
            
            id_usuario: sesion._id,
            numero_usuario_creador: sesion.numero_usuario,
            nombre_usuario_creador: sesion.nombre,
            id_cliente: props.rowSelected.cliente._id,
            credito_disponible: props.rowSelected.cliente.credito_disponible,
            numero_cliente: props.rowSelected.cliente.numero_cliente,
            nombre_cliente: props.rowSelected.cliente.nombre_cliente ,
            telefono_cliente: props.rowSelected.cliente.telefono_cliente  ,
            email_cliente: props.rowSelected.cliente.email_cliente,
            id_abono: abonoSelected._id,
            id_venta: props.rowSelected._id,
            metodo_de_pago: '01'
        }



          await cancelarAbonoCliente({
            variables: {
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
                input:input
            },
        });
        props.recargar();
        setOpenCancelar(false);
        setLoadingCancelar(false);
        handleOpen();
        props.setAlert({ 
            message: 'Venta liquidada con éxito.', 
            status: 'success', 
            open: true 
        });

        } catch (error) {
            console.log(error)
            if (error.networkError) {
                console.log(error.networkError.result);
            } else if (error.graphQLErrors) {
                console.log(error.graphQLErrors);
            }
            setLoadingCancelar(false);
            handleOpen();
            props.setAlert({ 
                message: 'LA cancelación ha fallado.', 
                status: 'success', 
                open: true 
            });
    
        }
    }


	return (
		<div>
		<Paper className={classes.root}>
		<Dialog
            open={openCancelar}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => handleOpen()}
            aria-labelledby="alert-eliminar-abono"
        >
            <DialogTitle id="alert-eliminar-abono">
            {"¿Está seguro de eliminar este abono?"}
            </DialogTitle>
            <DialogActions>
            <Button
                onClick={() => handleOpen()}
                color="inherit"
                disabled={loadingCancelar}
            >
                Cancelar
            </Button>
            <Button
                onClick={() => cancelAbono()}
                color="secondary"
                disabled={loadingCancelar}
                startIcon={
                    loadingCancelar ? <CircularProgress size={20} color="inherit" /> : null
                }
            >
                Eliminar
            </Button>
            </DialogActions>
      </Dialog> 
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{abonos?.map((row, index) => {
							console.log(row)
							if(row.status !== 'CANCELADO'){
								return(<div/>)
							}else{
								return (
									<TableRow hover tabIndex={-1} key={index}>
										<TableCell align='center'>{moment(row.fecha_movimiento.completa).format('D MMMM YYYY')}</TableCell>
										<TableCell align='center'>{row.nombre_cliente}</TableCell>
										<TableCell align='right'><b>${row.monto_total_abonado}</b></TableCell>
										{
											(row.status === 'CANCELADO') ?
											<TableCell>
												{row.status}
											</TableCell>
											:
											<TableCell padding="checkbox">
											<Button
												variant="text"
												color="primary"
												onClick={() => affirmCancelar(row)}
												size="large"
											>
												<CloseIcon style={{ fontSize: 22 }} />
											</Button>
											</TableCell>    
										}
									</TableRow>
								);
							}
							
						})}
					</TableBody>
				</Table>
			</TableContainer>
		
			
             
		</Paper>
		{(abonos?.length > 0) ?
				<Box m={1} mb={1} mrstyle={{ backgroundColor:'red', alignContent:'flex-end'}}  justifyContent="flex-end"  >
					<Box  >
						<ExportarExcel fileName="Historial Abonos" data={dataExcel} columnName={columnsEffect} />
					</Box>
				</Box>
				:
				<div/>
			}
		</div>
	);
}

export default  withRouter(TablaAbonos);