import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Delete } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarFolio({ venta, handleCloseInfoVenta }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancelSale = () => {

    console.log(venta)
    /* handleClose() */
  }

  return (
    <div>
      {handleCloseInfoVenta ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClickOpen}
          startIcon={<Delete />}
        >
          Cancelar venta
        </Button>
      ) : (
        <IconButton size="small" color="secondary" onClick={handleClickOpen}>
          <Delete />
        </IconButton>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>
            ¿Seguro que deseas cancelar esta venta?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Salir
          </Button>
          <Button onClick={handleCancelSale} color="secondary">
            Cancelar Venta
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
