import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography, Toolbar, AppBar } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { Link, withRouter } from "react-router-dom";
import { grey } from "@material-ui/core/colors";
import { ShoppingCart } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.navbar,
    color: grey[800],
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
}));

function NavegacionAdmin(props) {
  const classes = useStyles();
  const token = localStorage.getItem("sesionCafi");
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let usuario;

  if (token !== null) usuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const signOut = () => {
    localStorage.removeItem("sesionCafi");
    localStorage.removeItem("tokenCafi");
    localStorage.removeItem("ListaEnEspera");
    props.history.push("/");
  };

  return (
    <div>
      <AppBar position="fixed" className={classes.appbar} elevation={0}>
        <Toolbar>
          <Avatar alt="Remy Sharp" src={usuario.imagen} />
          <Box className={classes.title}>
            <Typography variant="h6" color="inherit">
              Bienvenido {`${usuario.nombre}`}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/ventas/venta-general"
            size="large"
            className={classes.menuButton}
            startIcon={<ShoppingCart />}
          >
            Panel de venta
          </Button>
          {sesion.turno_en_caja_activo === true && turnoEnCurso ? (
            <Button
              color="secondary"
              size="large"
              className={classes.menuButton}
              variant="contained"
              disabled={true}
            >
              TURNO ACTIVO
            </Button>
          ) : (
            <CerrarSesionDialog signOut={signOut} />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const CerrarSesionDialog = ({ signOut }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="secondary"
        size="large"
        className={classes.menuButton}
        startIcon={<PowerSettingsNewIcon />}
        variant="contained"
        onClick={handleClickOpen}
      >
        Cerrar sesión
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>¿Seguro que deseas cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={signOut} color="secondary" variant="contained">
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(NavegacionAdmin);
