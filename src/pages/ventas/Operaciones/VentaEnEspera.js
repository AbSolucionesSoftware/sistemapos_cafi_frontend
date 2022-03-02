import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 69) {
      handleClickOpen();
    }
  }

  const agregarVentaEnEspera = () => {
    let VentaEnEspera = JSON.parse(localStorage.getItem("DatosVentas"));
    let datos = localStorage.getItem("ListaEnEspera");
    if (VentaEnEspera !== null) {
      if (datos === null) {
        localStorage.setItem(
          "ListaEnEspera",
          JSON.stringify([
            { VentaEnEspera, fecha: moment().format("MM/DD/YYYY") },
          ])
        );
        localStorage.removeItem("DatosVentas");
        setUpdateTablaVentas(!updateTablaVentas);
      } else {
        let data = JSON.parse(datos);
        data.push({ VentaEnEspera, fecha: moment().format("MM/DD/YYYY") });
        localStorage.setItem("ListaEnEspera", JSON.stringify(data));
        localStorage.removeItem("DatosVentas");
        setUpdateTablaVentas(!updateTablaVentas);
      }
    }
  };

  return (
    <>
      <Button
        onClick={() => agregarVentaEnEspera()}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
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

      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Grid container item lg={12}>
            <Box
              display="flex"
              textAlign="center"
              justifyContent="center"
              alignContent="center"
              alignSelf="center"
              justifySelf="center"
            >
              <Box>
                <FcExpired style={{ fontSize: 80 }} />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box mt={3}>
                <Typography variant="h5">Venta pasada a espera</Typography>
              </Box>
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClickOpen();
            }}
            variant="contained"
            color="primary"
            size="large"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
