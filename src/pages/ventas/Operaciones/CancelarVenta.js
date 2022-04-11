import React, { Fragment, useContext, useState } from "react";
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
import useStyles from "../styles";
import CloseIcon from "@material-ui/icons/Close";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarVenta() {
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
    setVentaRetomada,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.keyCode === 118 && datosVenta) {
      handleClickOpen();
    }
  }

  const cancelarVenta = () => {
    localStorage.removeItem("DatosVentas");
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
    setDatosVentasActual({
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    });
    setVentaRetomada(datosVenta);
    setOpen(!open);
  };

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso || !datosVenta}
      >
        <Box>
          <Box>
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shopping-cart.svg"
              alt="icono cancelarventa"
              style={{ width: 35 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Cancelar Venta</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F7</b>
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
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
            >
              <Box>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/shopping-cart.svg"
                  alt="icono caja"
                  className={classes.iconSizeDialogs}
                />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box>
                <Typography variant="h5">Cancelar Venta</Typography>
              </Box>
            </Box>
            <Box ml={10} mb={7} display="flex" alignItems="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(!open)}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Grid>
          <Box p={2}>
            <Typography variant="h5">
              ¿Esta seguro que desea cancelar esta venta?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => cancelarVenta()}
            variant="contained"
            color="primary"
            size="large"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
