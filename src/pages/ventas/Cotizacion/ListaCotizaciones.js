import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Slide,
  Typography,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import CotizacionesPendientes from "./CotizacionesPendientes";

import { FcCurrencyExchange } from "react-icons/fc";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListaCotizaciones() {
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button
        onClick={() => handleClickOpen()}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcCurrencyExchange style={{ fontSize: 25 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Cotizaciones</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + T</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        fullWidth
        open={open}
        maxWidth={"lg"}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Box display={"flex"}>
            <Box display="flex" flexGrow={1}>
              <Box p={2} display={"flex"} alignItems={"center"}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg"
                  alt="icono caja2"
                  style={{ width: 58 }}
                />
              </Box>
              <Box p={1} display={"flex"} alignItems={"center"}>
                <Typography variant="h6">Cotizaciones pendientes</Typography>
              </Box>
            </Box>
            <Box mt={2} textAlign="right">
              <Box textAlign="right">
                <Typography variant="caption">
                  {moment().format("L")}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption">
                  {moment().format("LT")} hrs.
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption">{sesion?.nombre}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption">
                  Caja {!turnoEnCurso ? null : turnoEnCurso.numero_caja}
                </Typography>
              </Box>
            </Box>
            <Box p={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(!open)}
                size="medium"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
        </AppBar>
        <CotizacionesPendientes setOpen={setOpen} />
      </Dialog>
    </>
  );
}
