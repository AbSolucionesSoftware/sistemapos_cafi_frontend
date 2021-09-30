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
import { CREAR_COMPRA } from "../../../../gql/Compras/compras";
import Close from "@material-ui/icons/Close";

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
  const { productosCompra, datosCompra } = useContext(ComprasContext);
  const [openDelete, setOpenDelete] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [crearCompra] = useMutation(CREAR_COMPRA);

  const realizarCompraBD = async () => {
    datosCompra.productos = productosCompra;

    try {
      const clean_data = cleanTypenames(datosCompra);

      const result = await crearCompra({
        variables: {
          input: clean_data,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          usuario: sesion._id,
        },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      if (error.networkError.result) {
        console.log(error.networkError.result.errors);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const handleToggleDelete = () => {
    setOpenDelete(!openDelete);
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
          onClick={() => realizarCompraBD()}
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
          onClick={() => realizarCompraBD()}
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
  } = useContext(ComprasContext);

  const cancelarCompra = () => {
    /* reset states */
    setDatosCompra(initial_state_datosProducto);
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
