import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import FormularioPrecios from "../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional";
import { Close, LocalOffer } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <div>
      <Button
        color="primary"
        size="large"
        onClick={() => toggleDrawer()}
        startIcon={<LocalOffer />}
      >
        Editar precios
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
          <Button
            size="large"
            onClick={() => toggleDrawer()}
            startIcon={<Close />}
            color="primary"
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

