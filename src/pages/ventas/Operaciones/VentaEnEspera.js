import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Button,
  Snackbar,
  Slide,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FcExpired } from "react-icons/fc";
import moment from "moment";
import "moment/locale/es";
import { VentasContext } from "../../../context/Ventas/ventasContext";
moment.locale("es");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentaEnEspera() {
  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const agregarVentaEnEspera = () => {
    let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
    let datos = localStorage.getItem("ListaEnEspera");

    if (datosVenta !== null) {
      if (datos === null) {
        localStorage.setItem(
          "ListaEnEspera",
          JSON.stringify([{ datosVenta, fecha: moment().format("MM/DD/YYYY") }])
        );
        localStorage.removeItem("DatosVentas");
        setUpdateTablaVentas(!updateTablaVentas);
        handleClickOpen();
      } else {
        let data = JSON.parse(datos);
        data.push({ datosVenta, fecha: moment().format("MM/DD/YYYY") });
        localStorage.setItem("ListaEnEspera", JSON.stringify(data));
        localStorage.removeItem("DatosVentas");
        setUpdateTablaVentas(!updateTablaVentas);
      }
    }
  };

  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.altKey && e.keyCode === 69) {
      agregarVentaEnEspera();
    }
  }

  return (
    <Fragment>
      <Button
        onClick={() => agregarVentaEnEspera()}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcExpired style={{ fontSize: 25 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>En espera</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + E</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClickOpen}
        message="Note archived"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClickOpen}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Fragment>
  );
}
