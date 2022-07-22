import React from "react";
import { Button } from "@material-ui/core";
import { RiFileExcel2Line } from "react-icons/ri";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { formaPago } from "../../Facturacion/catalogos";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarTraspasos({ data }) {
  const traspasos = data.map((traspaso) => {
    const trasp =  {
      producto: traspaso.producto.datos_generales.nombre_comercial,
      cantidad: traspaso.cantidad,
      fecha:	formatoFechaCorta(traspaso.id_traspaso.fecha_registro),
      concepto: traspaso.id_traspaso.concepto_traspaso.nombre_concepto,
      almacen_origen: (traspaso.id_traspaso.almacen_origen !== null) ? traspaso.id_traspaso.almacen_origen.nombre_almacen : '',
      almacen_destino:(traspaso.id_traspaso.almacen_destino !== null) ? traspaso.id_traspaso.almacen_destino.nombre_almacen : ''
    } ;
  
    return trasp;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar a Excel
        </Button>
      }
      filename="Reporte de traspasos"
    >	

      <ExcelSheet data={traspasos} name="Reporte de traspasos">
        <ExcelColumn label="Producto" value="producto" />
        <ExcelColumn label="Cantidad" value="cantidad" />
        <ExcelColumn label="Fecha" value="fecha" />
        <ExcelColumn label="Concepto" value="concepto" />
        <ExcelColumn label="Almacén Origen" value="almacen_origen" />
        <ExcelColumn label="Almacén Destino" value="almacen_destino" />
        
        
      </ExcelSheet>
    </ExcelFile>
  );
}
