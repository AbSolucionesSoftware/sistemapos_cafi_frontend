import React, { useState, useContext, Fragment, useEffect } from "react";
import { Divider, BottomNavigation, Button, Grid } from "@material-ui/core";
import { Avatar, Box, Typography } from "@material-ui/core";
import { withRouter } from "react-router";
import { FaPowerOff } from "react-icons/fa";
import useStyles from "./styles";
import moment from "moment";
import "moment/locale/es";

import DepositoRetiroCaja from "../../pages/ventas/Operaciones/DepositoRetiroCaja";
import Turnos from "../../pages/ventas/AbrirCerrarTurno/Turnos";
import PreCorteCaja from "../../pages/ventas/Operaciones/PreCorteCaja";
import VentaEnEspera from "../../pages/ventas/Operaciones/VentaEnEspera";
import ProductoRapidoIndex from "../../pages/ventas/ArticuloRapido/indexArticuloRapido";

import SnackBarMessages from "../SnackBarMessages";
import { VentasContext } from "../../context/Ventas/ventasContext";
import Acceso from "../AccesosPassword/Acceso";
import { AccesosContext } from "../../context/Accesos/accesosCtx";
import ListaCotizaciones from "../../pages/ventas/Cotizacion/ListaCotizaciones";
import { PowerSettingsNew, Settings } from "@material-ui/icons";

function NavegacionVentas(props) {
  const {
    alert,
    setAlert,
    abrirTurnosDialog,
    setAbrirTurnosDialog,
    setUbicacionTurno,
  } = useContext(VentasContext);

  const {
    reloadAdministrador,
    setReloadAdministrador,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const classes = useStyles();
  const [value, setValue] = useState("venta-general");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  moment.locale("es");

  const signOut = () => {
    if (sesion.turno_en_caja_activo === true && turnoEnCurso) {
      setAbrirTurnosDialog(!abrirTurnosDialog);
      setUbicacionTurno("SESION");
    } else {
      localStorage.removeItem("sesionCafi");
      localStorage.removeItem("tokenCafi");
      localStorage.removeItem("DatosVentas");
      localStorage.removeItem("turnoEnCurso");
      localStorage.removeItem("ListaEnEspera");
      props.history.push("/");
    }
  };

  function Mi_función(e) {
    if (e.keyCode === 112) {
      Administrador();
    }
  }

  function Administrador() {
    if (sesion.accesos.ventas.administrador.ver === true) {
      props.history.push("/admin");
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "administrador",
        tipo_acceso: "ver",
      });
    }
  }

  useEffect(() => {
    if (reloadAdministrador === true) {
      props.history.push("/admin");
      setReloadAdministrador(false);
    }
  }, [reloadAdministrador]);

  window.addEventListener("keydown", Mi_función);

  return (
    <Box height="100%">
      <Acceso setReloadAdministrador={setReloadAdministrador} />
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.navigationTop}
      >
        <ProductoRapidoIndex />
        <Divider orientation="vertical" />
        <ListaCotizaciones />
        <Divider orientation="vertical" />
        <DepositoRetiroCaja />
        <Divider orientation="vertical" />
        <Turnos />
        <Divider orientation="vertical" />
        <PreCorteCaja />
        <Divider orientation="vertical" />
        <VentaEnEspera />
        {/* <Button
          onClick={() => Administrador()}
          style={{ textTransform: "none", height: "100%", width: "60%" }}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/admin.svg"
                alt="icono admin"
                className={classes.iconSizeSecondSuperior}
              />
            </Box>
            <Box>
              <Typography variant="body2">
                <b>Administrador</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" style={{ color: "#808080" }}>
                <b>F1</b>
              </Typography>
            </Box>
          </Box>
        </Button> */}
        {/* <Divider orientation="vertical" /> */}
        {/* <Button
          onClick={() => {
            signOut();
          }}
          style={{ textTransform: "none", height: "100%", width: "40%" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            style={{ textTransform: "none", height: "100%", width: "100%" }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <FaPowerOff
                className={classes.iconSizeSuperior}
                style={{ color: "red" }}
              />
            </Box>
            <Box>
              <Typography variant="body2">
                <b>Salir</b>
              </Typography>
            </Box>
          </Box>
        </Button> */}
        {/* <Box
          display="flex"
          justifyContent="flex-end"
          style={{ height: "100%", width: "100%" }}
        >
          <Box mr={3} display="flex" alignItems="center">
            <Avatar
              alt="Remy Sharp"
              srsc="/static/images/avatar/1.jpg"
              className={classes.avatar}
            />
            <div>
              <Box>
                <Typography color="textSecondary">{sesion?.nombre}</Typography>
                {!turnoEnCurso?.numero_caja ? (
                  ""
                ) : (
                  <Typography color="textSecondary">
                    <b>Caja: </b>
                    {turnoEnCurso?.numero_caja}
                  </Typography>
                )}
              </Box>
            </div>
          </Box>
          <Box mr={3} display="flex" alignItems="center">
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/calendario.svg"
              alt="icono admin"
              className={classes.avatar}
            />
            <div>
              <Box>
                <Typography color="textSecondary">
                  {moment().format("MM/DD/YYYY")}
                </Typography>
                <Typography color="textSecondary">
                  <b>{moment().format("h:mm")} hrs.</b>
                </Typography>
              </Box>
            </div>
          </Box>
        </Box> */}
      </BottomNavigation>
    </Box>
  );
}

export default withRouter(NavegacionVentas);
