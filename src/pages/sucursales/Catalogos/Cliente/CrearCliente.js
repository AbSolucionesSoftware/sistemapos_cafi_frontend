import React, { useState, Fragment, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { Button, AppBar, IconButton } from "@material-ui/core";
import { Dialog, DialogActions, Tabs, Tab, Box } from "@material-ui/core";
import RegistrarInfoBasica from "./RegistrarInfoBasica";
import RegistrarInfoCredito from "./RegistroInfoCredito";
import { Add, Edit } from "@material-ui/icons";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import {
  CREAR_CLIENTE,
  ACTUALIZAR_CLIENTE,
} from "../../../../gql/Catalogos/clientes";

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
      {value === index && (
        <Box p={3} minHeight="70vh">
          {children}
        </Box>
      )}
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
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconSvg: {
    width: 50,
  },
}));

export default function CrearCliente({ tipo, accion, datos, refetch, ventas, handleClickOpen }) {
  const classes = useStyles();
  const { cliente, setCliente, setError, update, setUpdate } =
    useContext(ClienteCtx);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const limpiarCampos = useCallback(() => {
    setCliente({
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
      estado_cliente: true,
    });
  }, [setCliente]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleModal = () => {
    setOpen(true);
    if (datos) {
      setCliente(datos);
    }
  };

  const onCloseModal = () => {
    setOpen(false);
    limpiarCampos();
  };

  /* Mutations */
  const [crearCliente] = useMutation(CREAR_CLIENTE);
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  const saveData = async () => {
    if (
      !cliente.numero_cliente ||
      !cliente.clave_cliente ||
      !cliente.nombre_cliente ||
      !cliente.telefono ||
      !cliente.email ||
      !cliente.direccion.calle ||
      !cliente.direccion.municipio ||
      !cliente.direccion.estado ||
      !cliente.direccion.pais
    ) {
      if (tipo !== "CLIENTE" && !cliente.representante) {
        setError(true);
        return;
      }
      setError(true);
      return;
    }
    setLoading(true);
    try {
      if (accion === "registrar") {
        cliente.tipo_cliente = tipo;
        cliente.empresa = sesion.empresa._id;
        cliente.sucursal = sesion.sucursal._id;
        if (tipo === "CLIENTE") {
          cliente.representante = "";
        }
        const input = cliente;
        const clienteBase = await crearCliente({
          variables: {
            input,
          },
        });

        if (ventas === true) {
          const venta = JSON.parse(localStorage.getItem("DatosVentas"));
          let venta_actual = venta === null ? {} : venta;
          // console.log(venta_actual);
          localStorage.setItem(
            "DatosVentas",
            JSON.stringify({
              subTotal:
                venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
              total: venta_actual.total === undefined ? 0 : venta_actual.total,
              impuestos:
                venta_actual.impuestos === undefined
                  ? 0
                  : venta_actual.impuestos,
              iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
              ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
              descuento:
                venta_actual.descuento === undefined
                  ? 0
                  : venta_actual.descuento,
              tipo_cambio: venta_actual.tipo_cambio
                ? venta_actual.descuento
                : {},
              cliente: clienteBase.data.crearCliente,
              venta_cliente: true,
              productos:
                venta_actual.productos?.length > 0 ? venta_actual.productos : [],
            })
          );
          onCloseModal();
          handleClickOpen();
        }
      } else {
        const {
          numero_cliente,
          _id,
          clave_cliente,
          sucursal,
          empresa,
          ...input
        } = cliente;
        await actualizarCliente({
          variables: {
            input: input,
            id: cliente._id,
          },
        });
      }
      if (refetch) {
        refetch();
      }
      setUpdate(!update);
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setError(false);
      setLoading(false);
      onCloseModal();
    } catch (error) {
      setAlert({ message: error.message, status: "error", open: true });
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      {accion === "registrar" ? (
        refetch ? (
          <IconButton color="primary" onClick={toggleModal}>
            <Add />
          </IconButton>
        ) : (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={toggleModal}
          >
            <Add /> Nuevo {tipo}
          </Button>
        )
      ) : (
        <IconButton onClick={toggleModal}>
          <Edit />
        </IconButton>
      )}
      <Dialog open={open} onClose={onCloseModal} fullWidth maxWidth="md">
        <div className={classes.root}>
          <BackdropComponent loading={loading} setLoading={setLoading} />
          <AppBar position="static" color="default" elevation={0}>
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
                label="Datos Crediticios"
                icon={
                  <img
                    src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/fiscal.svg"
                    alt="icono factura"
                    className={classes.iconSvg}
                  />
                }
                {...a11yProps(1)}
              />
              <Box ml={58} mt={3}>
                <Box>
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
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <RegistrarInfoBasica tipo={tipo} accion={accion} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RegistrarInfoCredito tipo={tipo} accion={accion} />
          </TabPanel>
        </div>
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
