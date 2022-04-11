import React, { Fragment, useState } from "react";
import useStyles from "../styles";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import ListaVentasRealizadas from "./ListaVentasRealizadas";
import { FcSearch } from "react-icons/fc";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentasRealizadas() {
  const classes = useStyles();
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 86) {
      handleClickOpen();
    }
  }

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso}
      >
        <Box>
          <Box>
            <FcSearch style={{ fontSize: 45 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Buscar Folio</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + V</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center"> 
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/lista-de-espera.svg"
                  alt="icono caja"
                  className={classes.iconSizeDialogs}
                />
                <Box mx={2} />
                <Typography variant="h6">Ventas Realizadas</Typography>
              </Box>
              <Button size="small" color="secondary" variant="contained" onClick={() => handleClickOpen()}>
                <Close />
              </Button>
            </Box>
        </DialogTitle>
        <DialogContent>
            <ListaVentasRealizadas handleClose={handleClickOpen} />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
