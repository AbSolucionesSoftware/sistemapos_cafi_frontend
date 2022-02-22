import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Grid, IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import TablaProovedores from "./ListaProveedores";
import CrearCliente from "../Cliente/CrearCliente";
import { ClienteProvider } from "../../../../context/Catalogos/crearClienteCtx";

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
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.defaultValue);
  };

  return (
    <div>
      <ClienteProvider>
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
              <Box m={1}>
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

          <Box mx={4} my={3}>
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
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {permisosUsuario.accesos.catalogos.provedores.ver ===
                false ? null : (
                  <CrearCliente tipo="PROVEEDOR" accion="registrar" />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box mx={4}>
            <TablaProovedores tipo="PROVEEDOR" filtro={filtro} />
          </Box>
        </Dialog>
      </ClienteProvider>
    </div>
  );
}
