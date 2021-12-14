import React, { forwardRef, Fragment, useContext, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import Alert from "@material-ui/lab/Alert";

import RegistroFactura from "./RegistroFactura";
import DetallesFactura from "./TablaDetallesFactura";
import { ClienteProvider } from "../../../../context/Catalogos/crearClienteCtx";
import {
  FacturacionCtx,
  FacturacionProvider,
} from "../../../../context/Facturacion/facturacionCtx";

import { useMutation, useQuery } from "@apollo/client";
import {
  CREAR_FACTURA,
  OBTENER_SERIES,
} from "../../../../gql/Facturacion/Facturacion";
import ErrorPage from "../../../../components/ErrorPage";
import moment from "moment";
import { verificarDatosFactura } from "./validacion_factura";
import { factura_initial_state } from "./initial_factura_states";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
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
                  /* variant="contained" */
                  color="inherit"
                  onClick={() => handleClose()}
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
  const classes = useStyles();
  const {
    datosFactura,
    setDatosFactura,
    codigo_postal,
    setCodigoPostal,
    productosFactura,
    setProductosFactura,
    setError,
  } = useContext(FacturacionCtx);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [loadingSpin, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const [CrearFactura] = useMutation(CREAR_FACTURA);

  const { loading, data, error, refetch } = useQuery(OBTENER_SERIES, {
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

  const crearFactura = async () => {
    try {
      setLoading(true);
      let nuevo_obj = { ...datosFactura };
      const productos = [
        {
          ProductCode: "50161509",
          IdentificationNumber: "61ae61a6360b5eb744c95158",
          Description: "AZUCAR MORENA",
          /* Unit: "Unidad de Servicio", */
          UnitCode: "E48",
          UnitPrice: "0.50",
          Quantity: "100",
          Subtotal: "50.00",
          Discount: "10",
          Taxes: [
            {
              Total: "6.4",
              Name: "IVA",
              Base: "40",
              Rate: "0.16",
              IsRetention: "false",
            },
          ],
          Total: "46.40",
        },
      ];

      //poner la fecha de facturacion
      if (datosFactura.date === "1") {
        nuevo_obj.date = moment().subtract(1, "d").format();
      } else if (datosFactura.date === "2") {
        nuevo_obj.date = moment().subtract(2, "d").format();
      } else {
        nuevo_obj.date = moment().format();
      }

      nuevo_obj.items = productos;
      nuevo_obj.expedition_place = codigo_postal;

      /* validar todos los datos */
      const result = verificarDatosFactura(nuevo_obj);

      console.log(result);
      if (result.length) {
        setError({ status: true, message: result[0].message });
        setLoading(false);
        return;
      }
      setError({ status: false, message: "" });

      /* let result = await CrearFactura({
        variables: {
          input: datosFactura,
        },
      }); */
      /* console.log("result", result); */
      setLoading(false);
      /* setAlert({
        message: `¡Listo! ${result.data.crearFactura.message}`,
        status: "success",
        open: true,
      }); */
      /* limpiarCampos(); */
    } catch (error) {
      console.log(error);
      console.log(error.response);
      setLoading(false);
      if (error.response) {
        setAlert({
          message: error.response,
          status: "error",
          open: true,
        });
      } else if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };
  return (
    <Fragment>
      <DialogContent>
        <Backdrop className={classes.backdrop} open={loadingSpin}>
          <CircularProgress color="inherit" />
        </Backdrop>
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

      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={() => handleClose()} size="large">
          Cancelar
        </Button>
        <Button
          color="primary"
          startIcon={<DoneIcon />}
          size="large"
          onClick={() => crearFactura()}
        >
          Generar CFDI
        </Button>
      </DialogActions>
    </Fragment>
  );
};
