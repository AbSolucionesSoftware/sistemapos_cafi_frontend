import { Button, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import ExcelFile from 'react-export-excel/dist/ExcelPlugin/components/ExcelFile'
import ExcelSheet from 'react-export-excel/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel/dist/ExcelPlugin/elements/ExcelColumn';
import { RiFileExcel2Line } from "react-icons/ri";

const useStyles = makeStyles((theme) => ({
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

export default function ExportExcel({historialCortes}) {
    const [ datosExcel, setDatosExcel ] = useState([]);

    const classes = useStyles();
    let arrayExcel = [];

    const agruparDatos = () => {
       
        
        for (let i = 0; i < historialCortes.length; i++) {
            arrayExcel = { 
                fecha: historialCortes[i].fecha_salida.completa,
                hora_movimiento: historialCortes[i].hora_salida.completa,
                horario_turno: historialCortes[i].horario_en_turno,
                sucursal: historialCortes[i].sucursal.nombre_sucursal,
                nombre: historialCortes[i].usuario_en_turno.nombre,
                numero_usuario: historialCortes[i].usuario_en_turno.numero_usuario,
                concepto: "Corte Caja",
                caja: historialCortes[i].numero_caja,
                monto_efectivo: historialCortes[i].montos_en_caja.monto_efectivo.monto , 
                monto_creditos: historialCortes[i].montos_en_caja.monto_creditos.monto , 
                monto_tarjeta_debito: historialCortes[i].montos_en_caja.monto_tarjeta_debito.monto , 
                monto_tarjeta_credito: historialCortes[i].montos_en_caja.monto_tarjeta_credito.monto , 
                monto_monedero: historialCortes[i].montos_en_caja.monto_monedero.monto , 
                monto_cheques: historialCortes[i].montos_en_caja.monto_cheques.monto , 
                monto_transferencia: historialCortes[i].montos_en_caja.monto_transferencia.monto ,
                monto_vales_despensa: historialCortes[i].montos_en_caja.monto_vales_despensa.monto ,
            };
            setDatosExcel(arrayExcel);
        };
    };


    return (
        <>
            <ExcelFile
                element={
                    <Button
                        variant="text"
                        color="primary"
                        aria-label="Guardar"
                        onClick={() => agruparDatos()}
                        startIcon={<RiFileExcel2Line />}
                    >
                        Exportar
                    </Button>   
                }
                filename={`Reporte de Historial de Cortes`}
            >
                <ExcelSheet data={datosExcel} name={`Reporte de Historial de Cortes`}>
                    <ExcelColumn label='Usuario' value='nombre' />
                    <ExcelColumn label='No. Usuario' value='numero_usuario' />
                    <ExcelColumn label='Sucursal' value='sucursal' />
                    <ExcelColumn label='Fecha Corte' value='fecha' />
                    <ExcelColumn label='Hora Corte' value='hora_movimiento' />
                    <ExcelColumn label='Horario Turno' value='horario_turno' />
                    <ExcelColumn label='Concepto' value='concepto' />
                    <ExcelColumn label='No. de Caja' value='caja' />
                    <ExcelColumn label='M. en Efectivo' value='monto_efectivo' />
                    <ExcelColumn label='M. en Creditos' value='monto_creditos' />
                    <ExcelColumn label='M. en Tarjeta Debito' value='monto_tarjeta_debito' />
                    <ExcelColumn label='M. en Tarjeta Credito' value='monto_tarjeta_credito' />
                    <ExcelColumn label='M. en Monedero' value='monto_monedero' />
                    <ExcelColumn label='M. en Cheques' value='monto_cheques' />
                    <ExcelColumn label='M. en Transferencia' value='monto_transferencia' />
                    <ExcelColumn label='M. en Vale Despensa' value='monto_vales_despensa' />
                </ExcelSheet>
            </ExcelFile>
        </>
    )
}
