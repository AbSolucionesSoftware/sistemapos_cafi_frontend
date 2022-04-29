import {
  AppBar,
  Box,
  Button,
  Dialog,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import FiltrosVenta from "./FiltrosVenta";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

export default function ReportesVentas() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/cart-add.svg"
              alt="icono ventas"
              style={{ width: 100 }}
            />
          </Box>
          Reportes Ventas
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Reportes Ventas
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <FiltrosVenta />
      </Dialog>
    </Box>
  );
}
