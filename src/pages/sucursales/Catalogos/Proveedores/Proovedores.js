import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import {
  Box,
  CircularProgress,
  DialogContent,
  Grid,
  IconButton,
  InputBase,
  Paper,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import TablaProovedores from "./ListaProveedores";
import CrearCliente from "../Cliente/CrearCliente";
import ErrorPage from "../../../../components/ErrorPage";
import DescripcionCatalogo from "../../../../components/DescripcionCatalogo";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTES } from "../../../../gql/Catalogos/clientes";
import ClientesInactivosComponent from "../Cliente/ClientesInactivos";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
  root: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Proveedores() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const descripcion =
    "En este apartado se registran los proveedores que se podrán seleccionar en la compra de un producto.";
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/distribution.svg"
              alt="icono numero calzado"
              className={classes.icon}
            />
          </Box>
          Proveedores
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Proveedores
            </Typography>
            <Box m={1} display="flex" flexDirection="row">
              <DescripcionCatalogo texto={descripcion} />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <ProveedoresComponent />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ProveedoresComponent = () => {
  const classes = useStyles();
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.defaultValue);
  };

  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES, {
    variables: {
      tipo: "PROVEEDOR",
      filtro,
      empresa: sesion.empresa._id,
      eliminado: false,
    },
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { obtenerClientes } = data;

  return (
    <Box my={3}>
      <Grid container spacing={2}>
        <Grid item md={6} xs={8}>
          <Paper className={classes.root}>
            <InputBase
              fullWidth
              placeholder="Buscar proveedor..."
              onChange={(e) => setValues(e.target.value)}
              onKeyPress={pressEnter}
              value={values}
            />
            <IconButton onClick={() => setFiltro(values)}>
              <Search />
            </IconButton>
          </Paper>
        </Grid>
        <Grid
          item
          md={6}
          xs={4}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {permisosUsuario.accesos.catalogos.clientes.agregar ===
          false ? null : (
            <ClientesInactivosComponent tipo="PROVEEDOR" />
          )}
          <Box mx={1} />
          {permisosUsuario.accesos.catalogos.provedores.ver === false ? null : (
            <CrearCliente
              tipo="PROVEEDOR"
              accion="registrar"
              refetch={refetch}
            />
          )}
        </Grid>
      </Grid>
      <Box mt={3}>
        <TablaProovedores obtenerClientes={obtenerClientes} refetch={refetch} />
      </Box>
    </Box>
  );
};
