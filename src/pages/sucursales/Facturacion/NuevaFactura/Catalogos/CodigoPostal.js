import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";
import { useDebounce } from "use-debounce/lib";
import { CheckCircle, Error } from "@material-ui/icons";

export default function CodigoPostal() {
  const [loading, setLoading] = React.useState(false);
  const {
    datosFactura,
    setDatosFactura,
    cp_valido,
    setCPValido,
  } = React.useContext(FacturacionCtx);
  const [value, setValue] = React.useState("");

  const [CP] = useDebounce(value, 500);

  const obtenerCodigoPostal = React.useCallback(async (codigo_postal) => {
    if (!codigo_postal) return;
    try {
      setLoading(true);
      await Facturama.Catalogs.PostalCodes(codigo_postal, function (result) {
        setCPValido(true);
        setLoading(false);
        setDatosFactura({ ...datosFactura, expedition_place: result[0].Value });
      });
    } catch (error) {
      setLoading(false);
      setCPValido(false);
      setDatosFactura({ ...datosFactura, expedition_place: "" });
    }
  }, []);

  React.useEffect(() => {
    obtenerCodigoPostal(CP);
  }, [CP]);

  return (
    <React.Fragment>
      <Typography>Código Postal:</Typography>
      <form onSubmit={obtenerCodigoPostal}>
        <TextField
          fullWidth
          name="expedition_place"
          size="small"
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={20} />
                ) : cp_valido ? (
                  <CheckCircle color="primary" />
                ) : (
                  <Error color="error" />
                )}
              </InputAdornment>
            ),
          }}
          error={cp_valido ? false : true}
          helperText={cp_valido ? "" : "Introduce un CP valido"}
        />
      </form>
    </React.Fragment>
  );
}
