import React, { useState, Fragment, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { Button, IconButton, Tabs } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  Box,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import FormularioUsuario from "./FormularioUsuario";
import AsignarPermisos from "./AsingarAccesos/AsignarPermisos";
import { Add, Edit } from "@material-ui/icons";
import { UsuarioContext } from "../../../../context/Catalogos/usuarioContext";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import arregloVacio from "./AsingarAccesos/arregloVacioAcceso";
import { useMutation } from "@apollo/client";
import {
  CREAR_USUARIO,
  ACTUALIZAR_USUARIO,
} from "../../../../gql/Catalogos/usuarios";
import { numerosRandom } from "../../../../config/reuserFunctions";
import { AppBar } from "@material-ui/core";
import { Tab } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-reg-product-${index}`}
      aria-labelledby={`reg-product-tab-${index}`}
      {...other}
    >
      {value === index && <Box minHeight="70vh">{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `reg-product-tab-${index}`,
    "aria-controls": `tabpanel-reg-product-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  iconSvg: {
    width: 50,
  },
}));

export default function CrearUsuario({ accion, datos }) {
  const classes = useStyles();
  const { usuario, setUsuario, setError, update, setUpdate } = useContext(
    UsuarioContext
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const limpiarCampos = useCallback(() => {
    setUsuario({
      direccion: {
        calle: "",
        no_ext: "",
        no_int: "",
        codigo_postal: "",
        colonia: "",
        municipio: "",
        localidad: "",
        estado: "",
        pais: "",
      },
      turno_en_caja_activo: false,
      estado_usuario: true,
      accesos: arregloVacio,
    });
  }, [setUsuario]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleModal = () => {
    setOpen(true);
    if (accion !== "registrar") {
      setUsuario(datos);
    }
  };

  const onCloseModal = () => {
    setOpen(false);
    limpiarCampos();
  };

  const obtenerAccesos = (event, departamento, subDepartamentos) => {
    const { name, checked } = event.target;
    setUsuario({
      ...usuario,
      accesos: {
        ...usuario.accesos,
        [departamento]: {
          ...usuario.accesos[departamento],
          [subDepartamentos]: {
            ...usuario.accesos[departamento][subDepartamentos],
            [name]: checked,
          },
        },
      },
    });
  };

  /* Mutations */
  const [crearUsuario] = useMutation(CREAR_USUARIO);
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);
  const saveData = async () => {
    if (accion === "registrar") {
      if (
        !usuario.nombre ||
        !usuario.password ||
        !usuario.repeatPassword ||
        !usuario.telefono ||
        !usuario.email
      ) {
        setError({ error: true, message: "Este campo es requerido" });
        return;
      }
      if (usuario.password !== usuario.repeatPassword) {
        setError({ error: true, message: "Las contraseñas no coinciden" });
        return;
      }
    } else {
      if (!usuario.nombre || !usuario.telefono || !usuario.email) {
        setError({ error: true, message: "Este campo es requerido" });
        return;
      }
    }
    setLoading(true);
    try {
      if (accion === "registrar") {
        usuario.numero_usuario = numerosRandom(100000000, 999999999);
        usuario.empresa = sesion.empresa._id;
        usuario.sucursal = sesion.sucursal._id;
        usuario.turno_en_caja_activo = false;
        const input = usuario;
        await crearUsuario({
          variables: {
            input,
          },
        });
      } else {
        const {
          numero_usuario,
          _id,
          sucursal,
          empresa,
          turno_en_caja_activo,
          estado_usuario,
          ...input
        } = usuario;
        await actualizarUsuario({
          variables: {
            input: input,
            id: usuario._id,
          },
        });
      }
      setUpdate(!update);
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setError({ error: false, message: "" });
      setLoading(false);
      onCloseModal();
    } catch (error) {
      setAlert({
        message: "Hubo un error en el servidor",
        status: "error",
        open: true,
      });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      {accion === "registrar" ? (
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={toggleModal}
          startIcon={<Add /> }
        >
          Agregar
        </Button>
      ) : (
        <IconButton onClick={toggleModal}>
          <Edit />
        </IconButton>
      )}
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            onCloseModal();
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle style={{ padding: 0 }}>
          <AppBar position="static" color="default" elevation={0}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab
                  label="Información básica"
                  icon={
                    <img
                      src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/perfil.svg"
                      alt="icono perfil"
                      className={classes.iconSvg}
                    />
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label="Permisos"
                  icon={
                    <img
                      src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/permisos.svg"
                      alt="icono factura"
                      className={classes.iconSvg}
                    />
                  }
                  {...a11yProps(1)}
                />
              </Tabs>
              <Box mx={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onCloseModal}
                  size="large"
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          <BackdropComponent loading={loading} setLoading={setLoading} />
          <TabPanel value={value} index={0}>
            <Box p={2}>
              <FormularioUsuario accion={accion} />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AsignarPermisos
              arregloAccesos={usuario.accesos}
              obtenerAccesos={obtenerAccesos}
            />
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={saveData}
            size="large"
            startIcon={<DoneIcon />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
