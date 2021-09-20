import React, { Fragment, useContext } from "react";
import { Box, Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { ClienteProvider } from "../../../../../context/Catalogos/crearClienteCtx";
import { AlmacenProvider } from "../../../../../context/Almacenes/crearAlmacen";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import RegistroProvedor from "../../../Catalogos/Cliente/CrearCliente";
import RegistroAlmacen from "../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen";

import "date-fns";
import local from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function DatosProveedorAlmacen({ proveedores, almacenes, refetch}) {
  const { datosCompra, setDatosCompra } = useContext(ComprasContext);

  const obtenerProveedorAlmacen = (tipo, value) => {
    if (!value) {
      setDatosCompra({ ...datosCompra, [tipo]: {} });
      return;
    }
    setDatosCompra({ ...datosCompra, [tipo]: value });
  };

  return (
    <Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              id="combo-box-proveedor"
              size="small"
              fullWidth
              options={proveedores}
              getOptionLabel={(option) => option.nombre_cliente}
              renderInput={(params) => (
                <TextField {...params} label="Proveedor" variant="outlined" />
              )}
              onChange={(_, value) =>
                obtenerProveedorAlmacen("proveedor", value)
              }
              getOptionSelected={(option) => option.nombre_cliente}
              value={
                datosCompra.proveedor.nombre_cliente
                  ? datosCompra.proveedor
                  : null
              }
            />
            <ClienteProvider>
              <RegistroProvedor
                accion="registrar"
                tipo="PROVEEDOR"
                refetch={refetch}
              />
            </ClienteProvider>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              id="combo-box-almacen"
              size="small"
              fullWidth
              options={almacenes}
              getOptionLabel={(option) => option.nombre_almacen}
              renderInput={(params) => (
                <TextField {...params} label="Almacen" variant="outlined" />
              )}
              onChange={(_, value) => obtenerProveedorAlmacen("almacen", value)}
              getOptionSelected={(option) => option.nombre_almacen}
              value={
                datosCompra.almacen.nombre_almacen ? datosCompra.almacen : null
              }
            />
            <AlmacenProvider>
              <RegistroAlmacen accion="registrar" refetch={refetch} />
            </AlmacenProvider>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={local}>
              <KeyboardDatePicker
                inputVariant="outlined"
                margin="dense"
                id="date-picker-dialog"
                placeholder="ex: DD/MM/AAAA"
                format="dd/MM/yyyy"
                value={datosCompra.fecha_compra}
                onChange={(date) => {
                  setDatosCompra({
                    ...datosCompra,
                    fecha_compra: date,
                  });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}
