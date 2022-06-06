import React, { Fragment } from "react";
import { CloudDownloadOutlined } from "@material-ui/icons";
import { Grid, Button, Box } from "@material-ui/core";
import ReactExport from "react-export-excel";
import {
  formatoFecha,
  formatoMexico,
} from "../../../../config/reuserFunctions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarComprasExcel({
  obtenerComprasRealizadas,
  filtro,
  filtroFecha,
}) {
  const compras = obtenerComprasRealizadas.map((compra) => {
    const {
      almacen,
      proveedor,
      fecha_registro,
      subtotal,
      impuestos,
      total,
    } = compra;
    const compra_realizada = {
      almacen: almacen.nombre_almacen,
      proveedor: proveedor.nombre_cliente,
      fecha_registro: formatoFecha(fecha_registro),
      subtotal: formatoMexico(subtotal),
      impuestos: formatoMexico(impuestos),
      total: formatoMexico(total),
    };

    return compra_realizada;
  });

  let nombre_documento = "";
  if (filtro && filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas desde hace ${filtroFecha.since} y filtradas por ${filtro}`;
  } else if (filtro && !filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas filtradas por ${filtro}`;
  } else if (!filtro && filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas desde hace ${filtroFecha.since}`;
  } else if (!filtro && !filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas`;
  }

  return (
    <Fragment>
      <Box display="flex" justifyContent="flex-end">
        <ExcelFile
          element={
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadOutlined />}
            >
              Exportar a Excel
            </Button>
          }
          filename={nombre_documento}
        >
          <ExcelSheet data={compras} name={nombre_documento}>
            <ExcelColumn label="Almacen" value="almacen" />
            <ExcelColumn label="Proveedor" value="proveedor" />
            <ExcelColumn label="Fecha de compra" value="fecha_registro" />
            <ExcelColumn label="Subtotal" value="subtotal" />
            <ExcelColumn label="Impuestos" value="impuestos" />
            <ExcelColumn label="Total" value="total" />
          </ExcelSheet>
        </ExcelFile>
      </Box>
    </Fragment>
  );
}
