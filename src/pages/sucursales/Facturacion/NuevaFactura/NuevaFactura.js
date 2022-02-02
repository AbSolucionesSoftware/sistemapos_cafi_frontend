import React, { forwardRef, Fragment, useContext, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";

import RegistroFactura from "./RegistroFactura";
import DetallesFactura from "./TablaVenta/TablaDetallesFactura";
import { ClienteProvider } from "../../../../context/Catalogos/crearClienteCtx";
import {
  FacturacionCtx,
  FacturacionProvider,
} from "../../../../context/Facturacion/facturacionCtx";

import { useQuery } from "@apollo/client";
import { OBTENER_SERIES } from "../../../../gql/Facturacion/Facturacion";
import ErrorPage from "../../../../components/ErrorPage";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import RealizarFactura from "./RealizarFactura";
import { factura_initial_state } from "./initial_factura_states";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NuevaFactura() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ClienteProvider>
        <Button fullWidth onClick={() => handleClickOpen()}>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <img
                src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/factura-2.png"
                alt="icono Factura"
                style={{ width: 100 }}
              />
            </Box>
            Generar nuevo CFDI
          </Box>
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={() => handleClose()}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Generar nuevo CFDI
              </Typography>
              <Box m={1}>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => handleClose()}
                  color="secondary"
                  size="large"
                >
                  <CloseIcon style={{ fontSize: 30 }} />
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <FacturacionProvider>
            <FacturaModalContent handleClose={handleClose} />
          </FacturacionProvider>
        </Dialog>
      </ClienteProvider>
    </div>
  );
}

const FacturaModalContent = ({ handleClose }) => {
  const { setDatosFactura, setCodigoPostal, setProductosFactura } = useContext(
    FacturacionCtx
  );
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const { loading, data, error } = useQuery(OBTENER_SERIES, {
    variables: {
      sucursal: sesion.sucursal._id,
      empresa: sesion.empresa._id,
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { seriesCfdi } = data.obtenerSeriesCdfi;

  let serie_default = [];
  serie_default = seriesCfdi.filter((serie) => serie.default === true);
  if (!serie_default.length) {
    serie_default = [{ folio: "", serie: "" }];
    console.log(serie_default);
  }

  const limpiarCampos = () => {
    setDatosFactura(factura_initial_state);
    setProductosFactura([]);
    setCodigoPostal("");
  };

  const cancelarCFDI = () => {
    limpiarCampos();
    handleClose();
  };

  return (
    <Fragment>
      <DialogContent>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        {!seriesCfdi.length ? (
          <Alert severity="warning">No tienes Series CFDI registradas</Alert>
        ) : null}
        <Box my={2}>
          <RegistroFactura serie_default={serie_default} />
        </Box>
        {/* <Box>
          <ListaDocumentos />
        </Box> */}
        <DetallesFactura />
      </DialogContent>

      <DialogActions>
        <RealizarFactura setAlert={setAlert} />
      </DialogActions>
    </Fragment>
  );
};
