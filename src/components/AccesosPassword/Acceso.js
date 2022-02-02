import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  makeStyles,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import { VentasContext } from "../../context/Ventas/ventasContext";
import { useApolloClient } from  "@apollo/client";
import { LOGEAR_USUARIO_ACCESOS } from "../../gql/Catalogos/usuarios";
import BackdropComponent from "../Layouts/BackDrop";
import { AccesosContext } from "../../context/Accesos/accesosCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
    },
    "& .obligatorio": {
      color: "red",
    },
    paddingTop: 0,
    alignItems: "center",
    justifyItems: "center",
  },
}));

export default function Acceso() {
  const classes = useStyles();
  const client = useApolloClient();

  const { setAlert } = useContext(VentasContext);

  const {
    departamentos,
    abrirPanelAcceso,
    setAbrirPanelAcceso,
    setReloadProductoRapido,
    setReloadAdministrador,
    setReloadCancelarVenta,
    setReloadVerPrecios,
    setReloadVerPreCorte,
    setReloadEliminarVentaEspera,
    setReloadCrearCotizacion,
  } = useContext(AccesosContext);

  const [datosUser, setDatosUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickClose = async () => {
    setDatosUser([]);
    setAbrirPanelAcceso(false);
  };

  const obtenerDatos = (e) => {
    setDatosUser({ ...datosUser, [e.target.name]: e.target.value });
  };

  const input = {
    numero_usuario: parseInt(datosUser.numero_usuario),
    password: datosUser.password,
    departamento: departamentos.departamento,
    subDepartamento: departamentos.subDepartamento,
    tipo_acceso: departamentos.tipo_acceso,
  };

  const obtenerQuery = async () => {
    try {
      setLoading(true);
      const response = await client.query({
        query: LOGEAR_USUARIO_ACCESOS,
        variables: { input },
        fetchPolicy: "network-only",
      });
      if (response.data.obtenerAccesoPermiso.permiso_concedido === true) {
        SwitchPermisos(response.data.obtenerAccesoPermiso.subDepartamento);
        setAbrirPanelAcceso(false);
        setLoading(false);
        setAlert({
          message: "Permiso Autorizado",
          status: "success",
          open: true,
        });
        setDatosUser([]);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const SwitchPermisos = (subDepartamento) => {
    switch (subDepartamento) {
      case "administrador":
        setReloadAdministrador(true);
        break;
      case "producto_rapido":
        setReloadProductoRapido(true);
        break;
      case "cancelar_venta":
        setReloadCancelarVenta(true);
        break;
      case "precios_productos":
        setReloadVerPrecios(true);
        break;
      case "pre_corte":
        setReloadVerPreCorte(true);
        break;
      case "cotizaciones":
        setReloadEliminarVentaEspera(true);
        break;
      case "eliminar_ventas":
        setReloadCrearCotizacion(true);
        break;
      default:
        setAlert({
            message: "Permiso no autorizado",
            status: "error",
            open: true,
        });
        break;
    }
  };

  return (
    <Fragment>
      <Dialog
        maxWidth="xs"
        open={abrirPanelAcceso}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <BackdropComponent loading={loading} />
        <Box p={3}>
          <Box p={1}>
            <Typography variant="h6">
              <b>Por favor autoriza con tu usuario y contraseña</b>
            </Typography>
          </Box>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>
                <b>Numero Usuario:</b>
              </Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  name="numero_usuario"
                  size="small"
                  variant="outlined"
                  onChange={obtenerDatos}
                />
              </Box>
            </Box>
          </div>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>
                <b>Contrasena:</b>
              </Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  name="password"
                  variant="outlined"
                  onChange={obtenerDatos}
                />
              </Box>
            </Box>
          </div>
        </Box>
        <DialogActions>
          <Button
            color="primary"
            size="medium"
            variant="outlined"
            onClick={() => obtenerQuery()}
          >
            Aceptar
          </Button>
          <Button
            color="secondary"
            size="medium"
            variant="outlined"
            onClick={handleClickClose}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
