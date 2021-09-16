import React, { Fragment, useContext, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import FormularioPrecios from "../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional";
import { Close, LocalOffer } from "@material-ui/icons";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import Done from "@material-ui/icons/Done";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({agregarCompra, handleClose}) {
  const [open, setOpen] = useState(false);
  const { datosProducto } = useContext(ComprasContext);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Fragment>
      <Button
        color="primary"
        size="medium"
        onClick={() => toggleDrawer()}
        startIcon={<LocalOffer />}
        disabled={!datosProducto.producto.datos_generales}
      >
        Actualizar precios
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={toggleDrawer}
        aria-labelledby="alert-precios-compra-title"
        aria-describedby="alert-precios-compra-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText id="alert-precios-compra-description">
            <FormularioPrecios />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" size="large" startIcon={<Close />} onClick={toggleDrawer}>
            Cancelar
          </Button>
          <Button
            size="large"
            onClick={() => {
              agregarCompra();
              handleClose();
              toggleDrawer();
            }}
            startIcon={<Done />}
            color="primary"
            variant="contained"
          >
            Aceptar y agregar compra
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

