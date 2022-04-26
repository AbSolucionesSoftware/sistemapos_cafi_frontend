import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import {
  Dialog,
  Typography,
  Box,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Chip,
} from "@material-ui/core";
import DatosDeCompra from "./DatosDeCompra";
import {
  formatoFecha,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { AssignmentOutlined, Done } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "72vh",
  },
});

export default function ListaProductos({ obtenerComprasRealizadas }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root} variant="outlined">
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Almacen</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha de compra</TableCell>
              <TableCell>Compra a credito</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerComprasRealizadas.map((compra, index) => (
              <RenderRowsCompras key={index} compra={compra} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RenderRowsCompras = ({ compra }) => {
  const {
    almacen,
    proveedor,
    fecha_registro,
    compra_credito,
    credito_pagado,
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
        {compra_credito === true ? (
          <Chip
          label={
            credito_pagado === true ? 'Credito: Pagado' : "Credito: Pendiente"
          }
          color={credito_pagado === true ? "primary" : "secondary"}
          variant="outlined"
        />
        ) : null}
      </TableCell>
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
        <DetallesCompra compra={compra} />
      </TableCell>
    </TableRow>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetallesCompra = ({ compra }) => {
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
              Datos de venta
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
          <DatosDeCompra compra={compra} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            size="large"
            startIcon={<Done />}
            onClick={() => handleOpen()}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
