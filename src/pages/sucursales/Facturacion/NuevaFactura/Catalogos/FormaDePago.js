import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

export default function FormaDePago({ obtenerDatos }) {
  const [loading, setLoading] = React.useState(false);
  const [formas, setForma] = React.useState([]);
  const { datosFactura } = React.useContext(FacturacionCtx);

  const obtenerFormaPago = React.useCallback(async () => {
    try {
      setLoading(true);
      await Facturama.Catalogs.PaymentForms(
        function (result) {
          console.log(result);
          setForma(result);
          setLoading(false);
        },
        function (error) {
          if (error && error.responseJSON) {
            console.log(error.responseJSON);
          }
          setLoading(false);
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    obtenerFormaPago();
  }, [obtenerFormaPago]);

  return (
    <React.Fragment>
      <Typography>Forma de pago:</Typography>
      <FormControl variant="outlined" fullWidth size="small" name="forma_pago">
        <Select
          value={loading ? "cargando" : datosFactura.forma_pago}
          name="forma_pago"
          onChange={obtenerDatos}
          disabled={loading}
        >
          {loading ? <MenuItem value="cargando">Cargando...</MenuItem> : null}
          {formas.map((res, index) => (
            <MenuItem key={index} value={res.Value}>
              {`${res.Value} - ${res.Name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
