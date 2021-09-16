import {
  Box,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { useContext } from "react";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

export default function PreciosDeVentaCompras() {
  const { preciosP } = useContext(RegProductoContext);

  return (
    <div>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Precios de venta</TableCell>
              {[1, 2, 3, 4, 5, 6].map((numero, index) => (
                <TableCell padding="checkbox" key={index}>{numero}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {["Utilidad", "Precio de venta"].map((tipo, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{ border: 0 }}
                  padding="checkbox"
                >
                  <b>{tipo}</b>
                </TableCell>
                {preciosP.map((data, index) => (
                  <RenderPrecios
                    key={index}
                    data={data}
                    index={index}
                    tipo={tipo}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const RenderPrecios = ({ data, tipo, index }) => {
  switch (tipo) {
    case "Utilidad":
      return (
        <TableCell style={{ border: 0 }}>
            0%
          {/* <TextField
            fullWidth
            inputMode="numeric"
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            size="small"
            name="utilidad"
            variant="outlined"
          /> */}
        </TableCell>
      );
    case "Precio de venta":
      return (
        <TableCell style={{ border: 0 }}>
            0
          {/* <TextField
            fullWidth
            inputMode="numeric"
            InputProps={{ inputProps: { min: 0 } }}
            size="small"
            name="precio_neto"
            variant="outlined"
          /> */}
        </TableCell>
      );
    default:
      return null;
  }
};
