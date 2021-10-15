import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import DatosProducto from "./productos/DatosProducto";

import { FcPlus } from "react-icons/fc";
import { Box } from "@material-ui/core";
import ListaCompras from "./TablaCompras";
import { Grid } from "@material-ui/core";
import {
  ComprasContext,
  ComprasProvider,
} from "../../../../context/Compras/comprasContext";
import { Done, Timer } from "@material-ui/icons";
import {
  cleanTypenames,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import {
  initial_state_datosCompra,
  initial_state_datosProducto,
  initial_state_precios_venta,
  initial_state_productoOriginal,
  initial_state_productosCompra,
} from "./initial_states";
import { useMutation } from "@apollo/client";
import { CREAR_COMPRA, CREAR_COMPRA_ESPERA } from "../../../../gql/Compras/compras";
import Close from "@material-ui/icons/Close";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    paddingTop: 3,
    alignItems: "center",
    justifyItems: "center",
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCompra({ status }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {status === "enEspera" ? (
        <Button
          fullWidth
          onClick={handleClickOpen}
          color="primary"
          variant="contained"
          size="large"
        >
          continuar compra
        </Button>
      ) : (
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <FcPlus className={classes.icon} />
            </Box>
            Abrir una compra
          </Box>
        </Button>
      )}
      <ComprasProvider>
        <ModalCompra open={open} handleClose={handleClose} />
      </ComprasProvider>
    </div>
  );
}

const ModalCompra = ({ open, handleClose }) => {
  const classes = useStyles();
  const {
    productosCompra,
    datosCompra,
    setDatosProducto,
    setProductosCompra,
    setDatosCompra,
    setProductoOriginal,
    setPreciosVenta,
  } = useContext(ComprasContext);
  const [openDelete, setOpenDelete] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [loading, setLoading] = useState(false);

  const [crearCompra] = useMutation(CREAR_COMPRA);
  const [crearCompraEnEspera] = useMutation(CREAR_COMPRA_ESPERA)

  const limpiarCampos = () => {
    setDatosProducto(initial_state_datosProducto);
    setProductosCompra(initial_state_productosCompra);
    setDatosCompra(initial_state_datosCompra);
    setProductoOriginal(initial_state_productoOriginal);
    setPreciosVenta(initial_state_precios_venta);
  };

  const realizarCompraBD = async (compra_en_espera) => {
    setLoading(true);
    try {
      datosCompra.productos = productosCompra;
      const clean_data = cleanTypenames(datosCompra);

      if (compra_en_espera) {
        const result = await crearCompraEnEspera({
          variables: {
            input: clean_data,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            usuario: sesion._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearCompraEnEspera.message}`,
          status: "success",
          open: true,
        });
      } else {
        const result = await crearCompra({
          variables: {
            input: clean_data,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            usuario: sesion._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearCompra.message}`,
          status: "success",
          open: true,
        });
      }
      setLoading(false);
      limpiarCampos();
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error de servidor`,
        status: "error",
        open: true,
      });
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result.errors);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const handleToggleDelete = () => {
    if (productosCompra.length > 0) {
      setOpenDelete(!openDelete);
    } else {
      limpiarCampos();
      handleClose();
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle style={{ padding: 0 }}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Nueva compra
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToggleDelete}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
              <CancelarCompra
                handleClose={handleClose}
                handleToggleDelete={handleToggleDelete}
                openDelete={openDelete}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <DatosProducto />
        <Box my={2} />
        <ListaCompras />
      </DialogContent>

      <DialogActions>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          mx={2}
        >
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  Subtotal: <b>${formatoMexico(datosCompra.subtotal)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  Impuestos: <b>${formatoMexico(datosCompra.impuestos)}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ fontSize: 18 }}>
                  <b>Total: ${formatoMexico(datosCompra.total)}</b>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Button
          color="inherit"
          size="large"
          onClick={() => handleToggleDelete()}
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button
          autoFocus
          color="primary"
          variant="text"
          size="large"
          onClick={() => realizarCompraBD(true)}//realiza la compra en espera en la funcion
          disabled={!productosCompra.length}
          startIcon={<Timer />}
        >
          Compra en espera
        </Button>
        <Button
          autoFocus
          color="primary"
          variant="contained"
          size="large"
          onClick={() => realizarCompraBD(false)}
          disabled={!productosCompra.length}
          startIcon={<Done />}
        >
          Realizar compra
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CancelarCompra = ({ handleClose, handleToggleDelete, openDelete }) => {
  const {
    setProductosCompra,
    setDatosCompra,
    setPreciosVenta,
    setProductoOriginal,
    setDatosProducto
  } = useContext(ComprasContext);

  const cancelarCompra = () => {
    /* reset states */
    setDatosProducto(initial_state_datosProducto);
    setDatosCompra(initial_state_datosCompra);
    setPreciosVenta(initial_state_precios_venta);
    setProductoOriginal(initial_state_productoOriginal);
    setProductosCompra(initial_state_productosCompra);
    /* cerrar modales */
    handleToggleDelete();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleToggleDelete}
        aria-labelledby="modal-eliminar-compra"
      >
        <DialogTitle id="modal-eliminar-compra">
          ¿Quieres cancelar esta compra?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleToggleDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={cancelarCompra} color="secondary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
