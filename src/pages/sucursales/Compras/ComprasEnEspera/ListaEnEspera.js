import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Dialog,
  Typography,
  Box,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DatosDeCompraEspera from "./DatosDeCompraEspera";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@material-ui/core";

import {
  formatoFecha,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { AssignmentOutlined, DeleteOutlined, Done } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { ELIMINAR_COMPRA_ESPERA } from "../../../../gql/Compras/compras";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "75vh",
  },
});

export default function ListaEnEspera({ obtenerComprasEnEspera, refetch }) {
  const classes = useStyles();
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  return (
    <Paper className={classes.root} variant="outlined">
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Almacen</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha de compra</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Detalles</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerComprasEnEspera.map((compra, index) => (
              <RenderRowsComprasEspera
                key={index}
                compra={compra}
                refetch={refetch}
                setAlert={setAlert}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RenderRowsComprasEspera = ({ compra, refetch, setAlert }) => {
  const {
    almacen,
    proveedor,
    fecha_registro,
    subtotal,
    impuestos,
    total,
  } = compra;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{almacen.nombre_almacen}</TableCell>
      <TableCell>{proveedor.nombre_cliente}</TableCell>
      <TableCell>{formatoFecha(fecha_registro)}</TableCell>
      <TableCell>
        <b>${formatoMexico(subtotal)}</b>
      </TableCell>
      <TableCell>
        <b>${formatoMexico(impuestos)}</b>
      </TableCell>
      <TableCell>
        <b>${formatoMexico(total)}</b>
      </TableCell>
      <TableCell>
        <ModalContinuarCompra
          compra={compra}
          refetch={refetch}
          setAlert={setAlert}
        />
      </TableCell>
      <TableCell>
        <ModalEliminarCompra
          compra={compra}
          refetch={refetch}
          setAlert={setAlert}
        />
      </TableCell>
    </TableRow>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContinuarCompra = ({ compra, setAlert, refetch }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <Fragment>
      <IconButton onClick={() => handleOpen()}>
        <AssignmentOutlined />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleOpen}
        fullWidth
        maxWidth="lg"
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Datos de compra en espera
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={handleOpen}
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DatosDeCompraEspera
            compra={compra}
            refetch={refetch}
            setAlert={setAlert}
            handleOpenDetalles={handleOpen}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

const ModalEliminarCompra = ({ compra, setAlert, refetch }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eliminarCompraEnEspera] = useMutation(ELIMINAR_COMPRA_ESPERA);

  const handleOpen = () => {
    setOpen(!open);
  };

  const eliminarCompra = async () => {
    setLoading(true);
    try {
      const result = await eliminarCompraEnEspera({
        variables: {
          id: compra._id,
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.eliminarCompraEnEspera.message}`,
        status: "success",
        open: true,
      });
      refetch();
      setLoading(false);
      handleOpen();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
    }
  };
  return (
    <Fragment>
      <IconButton onClick={() => handleOpen()}>
        <DeleteOutlined color="error" />
      </IconButton>
      <Dialog open={open} onClose={handleOpen} TransitionComponent={Transition}>
        <DialogTitle>¿Desea eliminar esta compra?</DialogTitle>
        <DialogActions>
          <Button
            variant="text"
            color="inherit"
            size="large"
            startIcon={<Close />}
            onClick={() => handleOpen()}
          >
            Cancelar
          </Button>
          <Button
            variant="text"
            color="secondary"
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Done />
              )
            }
            onClick={() => eliminarCompra()}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
