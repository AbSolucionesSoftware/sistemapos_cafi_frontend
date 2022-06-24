import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Delete } from "@material-ui/icons";
import { ELIMINAR_CUENTA } from "../../../../gql/Catalogos/centroCostos";
import { useMutation } from "@apollo/client";

export default function EliminarCuenta({ cuenta, refetch, setAlert }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [eliminarCuenta] = useMutation(ELIMINAR_CUENTA);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCuenta = async () => {
    setLoading(true);
    try {
      await eliminarCuenta({
        variables: {
          id: cuenta._id,
        },
      });
      setLoading(false);
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      handleClose();
    } catch (error) {
      setLoading(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleClickOpen}
        onFocus={(event) => event.stopPropagation()}
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se eliminará esta cuenta</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancelar
          </Button>
          <Button
            onClick={() => deleteCuenta()}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
