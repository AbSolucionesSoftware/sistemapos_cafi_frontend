import React, { useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import useStyles from "../styles";
import { VentasContext } from "../../../context/Ventas/ventasContext";

export default function AgregarTipoVenta() {
  /* const sesion = JSON.parse(localStorage.getItem("sesionCafi")); */
  const classes = useStyles();
  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
  const venta = JSON.parse(localStorage.getItem("DatosVentas"));
  const [tipo_emision, setTipoEmision] = useState("TICKET");

  const obtenerTipoEmision = (e) => {
    const { value } = e.target;
    if (!venta || venta === null) return;
    setTipoEmision(value);
    localStorage.setItem(
      "DatosVentas",
      JSON.stringify({ ...venta, tipo_emision: value })
    );
    setUpdateTablaVentas(!updateTablaVentas);
  };

  return (
    <Box width="100%" display="flex">
      <Box mr={1}>
        <img
          src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/publicalo.svg"
          alt="iconoBander"
          className={classes.iconSize}
        />
      </Box>
      <Box width="100%">
        <FormControl variant="outlined" fullWidth size="small">
          <Select
            id="tipo_documento"
            value={tipo_emision}
            name="tipo_documento"
            onChange={obtenerTipoEmision}
            disabled={!venta || venta === null}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            <MenuItem value="TICKET">TICKET</MenuItem>
            <MenuItem value="FACTURA">FACTURA</MenuItem>
            <MenuItem value="NOTA REMISION">NOTA REMISION</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
