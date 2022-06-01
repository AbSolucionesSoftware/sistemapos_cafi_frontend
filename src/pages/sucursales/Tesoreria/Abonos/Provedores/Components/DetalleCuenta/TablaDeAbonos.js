import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { useQuery } from '@apollo/client';
import { OBTENER_HISTORIAL_ABONOS } from "../../../../../../../gql/Tesoreria/abonos";
import moment from 'moment';
import { TesoreriaCtx } from '../../../../../../../context/Tesoreria/tesoreriaCtx';
import ExportarExcel from '../../../../../../../components/ExportExcel';
import { formatoMexico,formatoFecha } from "../../../../../../../config/reuserFunctions";
const columns = [
	{ id: 'fecha', label: 'Fecha de abono', minWidth: 170, align: 'center' },
	{ id: 'cliente', label: 'Nombre', minWidth: 170, align: 'center' },
	{ id: 'abono', label: 'Cantidad abonada', minWidth: 170, align: 'right' },
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

export default function TablaAbonos(props) {
	
	const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

	const { reload } = useContext(TesoreriaCtx);
	  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
	const classes = useStyles();
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

	return (
		<div>
		<Paper className={classes.root}>
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
							return (
								<TableRow hover tabIndex={-1} key={index}>
									<TableCell align='center'>{moment(row.fecha_movimiento.completa).format('D MMMM YYYY')}</TableCell>
									<TableCell align='center'>{row.nombre_cliente}</TableCell>
									<TableCell align='right'><b>${row.monto_total_abonado}</b></TableCell>
								</TableRow>
							);
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