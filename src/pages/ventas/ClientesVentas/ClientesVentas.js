import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Slide,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ListaClientes from "../../sucursales/Catalogos/Cliente/ListaClientes";
import CrearCliente from "../../sucursales/Catalogos/Cliente/CrearCliente";
import { ClienteProvider } from "../../../context/Catalogos/crearClienteCtx";
import CloseIcon from "@material-ui/icons/Close";
import { FcBusinessman } from "react-icons/fc";

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
  icon: {
    fontSize: 100,
  },
  root: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

export default function ClientesVentas() {
  const classes = useStyles();

  const [values, setValues] = useState("");

  const pressEnter = (e) => {
    if (e.key === "Enter") setValues(e.target.defaultValue);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 67) {
      handleClickOpen();
    }
  }

  return (
    <>
      <ClienteProvider>
        <Button
          style={{
            height: "100%",
            width: "100%",
            border: ".6px solid #DBDBDB",
          }}
          onClick={handleClickOpen}
        >
          <Box>
            <Box>
              <FcBusinessman style={{ fontSize: 45 }} />
            </Box>
            <Box>
              <Typography variant="body2">
                <b>Clientes</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" style={{ color: "#808080" }}>
                <b>aLT + C</b>
              </Typography>
            </Box>
          </Box>
        </Button>
        <Dialog
          maxWidth="lg"
          open={open}
          onClose={handleClickOpen}
          TransitionComponent={Transition}
        >
          <DialogContent>
            <Grid container item lg={12}>
              <Box ml={3} display="flex" flexGrow={1} alignItems="center">
                <Box>
                  <FcBusinessman style={{ fontSize: 65 }} />
                </Box>
                <Typography variant="h6" className={classes.title}>
                  Clientes
                </Typography>
              </Box>
              <Box mr={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}
                  size="large"
                >
                  <CloseIcon style={{ fontSize: 30 }} />
                </Button>
              </Box>
            </Grid>
            <Box m={2} display="flex" justifyContent="space-between">
              <Box mr={5} minWidth="70%">
                <Paper className={classes.root}>
                  <InputBase
                    fullWidth
                    placeholder="Buscar cliente..."
                    onChange={(e) => setValues(e.target.value)}
                    onKeyPress={pressEnter}
                    value={values}
                  />
                  <IconButton onClick={() => setValues(values)}>
                    <Search />
                  </IconButton>
                </Paper>
              </Box>
              <CrearCliente
                tipo="CLIENTE"
                accion="registrar"
                ventas={true}
                handleClickOpen={handleClickOpen}
              />
            </Box>
            <Box mx={2}>
              <ListaClientes
                tipo="CLIENTE"
                filtro={values}
                ventas={true}
                handleClickOpen={handleClickOpen}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </ClienteProvider>
    </>
  );
}
