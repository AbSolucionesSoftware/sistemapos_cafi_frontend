import React, { forwardRef, Fragment, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import { DialogContent, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";

import RegistroFactura from "./RegistroFactura";
import DetallesFactura from "./TablaDetallesFactura";
import ListaDocumentos from "./TablaDocumento";
import { ClienteProvider } from "../../../../context/Catalogos/crearClienteCtx";
import { FacturacionProvider } from "../../../../context/Facturacion/facturacionCtx";

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
  root: {
    display: "flex",
    paddingLeft: theme.spacing(2),
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
  return (
    <Fragment>
      <DialogContent>
        <Box my={2}>
          <RegistroFactura />
        </Box>
        <Box pr={2} pl={2}>
          <ListaDocumentos />
        </Box>
        <Box pr={2} pl={2}>
          <DetallesFactura />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box mx={3}>
            <Typography variant="h6">
              <b>Subtotal:</b> $1000
            </Typography>
          </Box>
          <Box mx={3}>
            <Typography variant="h6">
              <b>Impuestos:</b> $1000
            </Typography>
          </Box>
          <Box mx={3}>
            <Typography variant="h6">
              <b>Total:</b> $1000
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={() => handleClose()} size="large">
          Cancelar
        </Button>
        <Button
          color="primary"
          startIcon={<DoneIcon />}
          size="large"
          onClick={() => handleClose()}
        >
          Generar CFDI
        </Button>
      </DialogActions>
    </Fragment>
  );
};
