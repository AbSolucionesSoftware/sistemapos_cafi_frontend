import React from 'react';
import useStyles from '../styles';

import {
    TableContainer,
    Table,
    Box,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    Typography} from '@material-ui/core'

export default function InformacionProducto({productoSeleccionado}) {

    const classes = useStyles();

    if (!productoSeleccionado) return null;

    return (
        <Grid container>
            <Grid item lg={12}>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>
                            <b>Nombre:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.id_producto?.datos_generales?.nombre_comercial}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="100%">
                        <Typography>
                            <b>Codigo Barras:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.codigo_barras}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="70%">
                        <Typography>
                            <b>Cantidad:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.cantidad}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="70%">
                        <Typography>
                            <b>Unidad:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.unidad}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="70%">
                        <Typography>
                            <b>Descuento:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.descuento ? productoSeleccionado?.descuento.precio_con_descuento : 0}
                            </Typography>
                        </Box>
                    </Box>
                    <Box width="70%">
                        <Typography>
                            <b>% Descuento:</b>
                        </Typography>
                        <Box display="flex">
                            <Typography>
                                {productoSeleccionado?.descuento ? productoSeleccionado?.descuento.precio_con_descuento : 0}
                            </Typography>
                        </Box>
                    </Box>
                </div>
            </Grid>
            <Grid item lg={12}>
                <PreciosDeVentaCompras precios={productoSeleccionado?.id_producto?.precios?.precios_producto} />
            </Grid>
        </Grid>
    )
}


function PreciosDeVentaCompras({precios}) {

    return (
      <div>
        <TableContainer>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 150 }}>Precios de venta</TableCell>
                {[1, 2, 3, 4, 5, 6].map((numero, index) => (
                  <TableCell style={{ minWidth: 100 }} key={index}>
                    {numero}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {["Precio de venta"].map((tipo, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: 0 }}>
                    <b>{tipo}</b>
                  </TableCell>
                  {precios?.map((data, index) => (
                    <TableCell key={index} style={{ border: 0 }}>{data?.precio_neto}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
