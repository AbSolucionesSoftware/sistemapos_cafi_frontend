import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core";
import { Close, Search } from "@material-ui/icons";
import ErrorPage from "../../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTES } from "../../../../gql/Catalogos/clientes";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx";
import CrearCliente from "../../Catalogos/Cliente/CrearCliente";
import { ClienteProvider } from "../../../../context/Catalogos/crearClienteCtx";
import { Alert } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "50vh",
  },
}));

export default function ListaClientesFacturas() {
  const [open, setOpen] = useState(false);
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => handleOpen()} size="small">
        <Search />
      </IconButton>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box style={{ display: "flex" }}>
            <Typography variant="h6">Selecionar cliente</Typography>
            <Box flexGrow={1} />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleClose()}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <RenderLista handleClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => handleClose()}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const RenderLista = ({ handleClose }) => {
  const classes = useStyles();
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");
  const [selected, setSelected] = useState("");
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES, {
    variables: { tipo: "CLIENTE", filtro },
  });

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.value);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="55vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage />;
  }

  const { obtenerClientes } = data;

  const obtenerClienteTabla = (click, row) => {
    setSelected(row.nombre_cliente);
    if (click === 2) {
      setDatosFactura({
        ...datosFactura,
        receiver: {
          ...datosFactura.receiver,
          Name: row.nombre_cliente,
          Rfc: row.rfc,
        },
      });
      handleClose();
    }
  };

  return (
    <Fragment>
      <Box mb={2} display="flex" alignItems="center">
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por: Numero de cliente, clave o nombre"
          variant="outlined"
          onChange={(e) => setValues(e.target.value)}
          onKeyPress={pressEnter}
          value={values}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setFiltro(values)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <ClienteProvider>
          <CrearCliente tipo="CLIENTE" accion="registrar" refetch={refetch} />
        </ClienteProvider>
      </Box>
      <Box my={1}>
        <Alert severity="info">
          Para seleccionar un cliente haz un doble click!
        </Alert>
      </Box>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell minwidth="100">No. Cliente</TableCell>
                <TableCell minwidth="100">Clave</TableCell>
                <TableCell minwidth="150">Nombre</TableCell>
                <TableCell minwidth="150">Razon Social</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerClientes.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    onClick={(e) => obtenerClienteTabla(e.detail, row)}
                    selected={row.nombre_cliente === selected}
                  >
                    <TableCell>
                      <Typography>{row.numero_cliente}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.clave_cliente}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.nombre_cliente}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.razon_social}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};
