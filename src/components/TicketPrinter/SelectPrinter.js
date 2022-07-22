import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Impresora } from "./Impresora";
import SnackBarMessages from "../SnackBarMessages";

export default function SelectPrinter({ handleClose, setPrint, print }) {
  const [printers, setPrinters] = React.useState([]);
  
  const [loading, setLoading] = React.useState(false);
  const [loadingPrinters, setLoadingPrinters] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    status: "",
    open: false,
  });

  const obtenerListaDeImpresoras = () => {
    setLoadingPrinters(true);
    Impresora.getImpresoras()
      .then((listaDeImpresoras) => {
        setLoadingPrinters(false);
        setPrinters(listaDeImpresoras);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePrint = (value) => {
    setPrint(value);
  };

  const handleSetDefaultPrinter = () => {
    setLoading(true);
    Impresora.setImpresora(print)
      .then((res) => {
        setLoading(false);
        if (res) {
          localStorage.setItem("cafiTicketPrint", print);
          setAlert({
            message: `Impresora ${print} establecida correctamente`,
            status: "success",
            open: true,
          });
          handleClose();
        } else {
          setAlert({
            message: `No se pudo establecer la impresora con el nombre ${print}`,
            status: "success",
            open: true,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  React.useEffect(() => {
    obtenerListaDeImpresoras();
  }, []);

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <DialogContent>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="print-list">Selecciona impresora</InputLabel>
          <Select
            labelId="print-list"
            id="print-list-select"
            value={print ? print : ""}
            onChange={(e) => handleChangePrint(e.target.value)}
            label="Selecciona impresora"
            startAdornment={
              <InputAdornment position="start">
                {loadingPrinters ? (
                  <CircularProgress size={20} color="primary" />
                ) : <div />}
              </InputAdornment>
            }
          >
            <MenuItem value="">
              <em>Selecciona una</em>
            </MenuItem>
            {printers.map((printer, index) => (
              <MenuItem key={index} value={printer}>{printer}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={() => handleSetDefaultPrinter()}
          color="primary"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Seleccionar
        </Button>
      </DialogActions>
    </div>
  );
}
