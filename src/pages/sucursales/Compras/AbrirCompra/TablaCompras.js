import React, { useContext, useState, forwardRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { ComprasContext } from "../../../../context/Compras/comprasContext";
import { Close, Edit } from "@material-ui/icons";
import { initial_state_datosProducto } from "./initial_states";
import { SetOrResetData } from "./productos/setOrResetData";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
import { formatoMexico } from "../../../../config/reuserFunctions";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function ListaCompras() {
  const classes = useStyles();
  const { productosCompra } = useContext(ComprasContext);

  const productos_ordernados = [...productosCompra].reverse();

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table stickyHeader size="small">
          {/* <caption>A basic table example with a caption</caption> */}
          <TableHead>
            <TableRow>
              <TableCell>Código de barras</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Precio de compra</TableCell>
              <TableCell padding="checkbox">Cantidad</TableCell>
              <TableCell padding="checkbox">Cantidad regalo</TableCell>
              <TableCell padding="checkbox">Cantidad total</TableCell>
              <TableCell padding="checkbox">Presentaciones</TableCell>
              <TableCell>IVA</TableCell>
              <TableCell>IEPS</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Remover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos_ordernados.map((producto, index) => {
              return (
                <RenderProductosCompra
                  key={index}
                  producto={producto}
                  index={index}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RenderProductosCompra = ({ producto, index }) => {
  const {
    datosCompra,
    setDatosProducto,
    setProductoOriginal,
    setPreciosVenta,
    isEditing,
    setIsEditing,
    editFinish,
  } = useContext(ComprasContext);
  const [isSelected, setIsSelected] = useState(false);
  const productoCTX = useContext(RegProductoContext);

  const seStates = {
    setDatosGenerales: productoCTX.setDatosGenerales,
    setPrecios: productoCTX.setPrecios,
    setValidacion: productoCTX.setValidacion,
    setPreciosP: productoCTX.setPreciosP,
    setImagenes: productoCTX.setImagenes,
    setUnidadesVenta: productoCTX.setUnidadesVenta,
    almacen_inicial: productoCTX.almacen_inicial,
    setAlmacenInicial: productoCTX.setAlmacenInicial,
    setUnidadVentaXDefecto: productoCTX.setUnidadVentaXDefecto,
    setCentroDeCostos: productoCTX.setCentroDeCostos,
    setPreciosPlazos: productoCTX.setPreciosPlazos,
    setSubcategorias: productoCTX.setSubcategorias,
    setOnPreview: productoCTX.setOnPreview,
    setSubcostos: productoCTX.setSubcostos,
    setImagenesEliminadas: productoCTX.setImagenesEliminadas,
    setPresentaciones: productoCTX.setPresentaciones,
    setPresentacionesEliminadas: productoCTX.setPresentacionesEliminadas,
    datosCompra,
  };

  const handleEdit = () => {
    setIsSelected(true);
    setIsEditing({ producto, index, finish: false });
    setDatosProducto(producto);
    SetOrResetData("SET", seStates, producto.producto);
    setProductoOriginal(producto.producto);
    setPreciosVenta(producto.producto.precios.precios_producto);
  };

  const handleCancelEdit = () => {
    setIsSelected(false);
    setIsEditing({});
    setDatosProducto(initial_state_datosProducto);
    SetOrResetData("RESET", seStates);
  };

  useEffect(() => {
    setIsSelected(false);
  }, [editFinish]);

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      selected={isSelected}
      style={
        isEditing.producto && !isSelected
          ? {
              pointerEvents: "none",
              opacity: 0.4,
            }
          : null
      }
    >
      <TableCell>
        {producto.producto.datos_generales
          ? producto.producto.datos_generales.codigo_barras
            ? producto.producto.datos_generales.codigo_barras
            : "-"
          : "-"}
      </TableCell>
      <TableCell>
        {producto.producto.datos_generales.nombre_comercial}
      </TableCell>
      <TableCell width={180}>
        <b>$ {formatoMexico(producto.total)}</b>
      </TableCell>
      <TableCell>{producto.cantidad}</TableCell>
      <TableCell>{producto.cantidad_regalo}</TableCell>
      <TableCell>{producto.cantidad_total}</TableCell>
      <TableCell>
        {producto.producto.presentaciones.length > 0
          ? producto.producto.presentaciones.length
          : "N/A"}
      </TableCell>
      <TableCell>{producto.producto.precios.iva}%</TableCell>
      <TableCell>{producto.producto.precios.ieps}%</TableCell>
      <TableCell>
        {isSelected ? (
          <IconButton
            color="inherit"
            size="small"
            onClick={() => handleCancelEdit()}
          >
            <Close />
          </IconButton>
        ) : (
          <IconButton color="primary" size="small" onClick={() => handleEdit()}>
            <Edit />
          </IconButton>
        )}
      </TableCell>
      <TableCell>
        <ModalDeleteProducto index={index} isSelected={isSelected} />
      </TableCell>
    </TableRow>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDeleteProducto = ({ index, isSelected }) => {
  const {
    productosCompra,
    setProductosCompra,
    datosCompra,
    setDatosCompra,
  } = useContext(ComprasContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const eliminarCompra = () => {
    let copy_compras = [...productosCompra].reverse();
    let objeto_eliminado = copy_compras.splice(index, 1);

    setDatosCompra({
      ...datosCompra,
      subtotal: datosCompra.subtotal - objeto_eliminado[0].subtotal,
      impuestos: datosCompra.impuestos - objeto_eliminado[0].impuestos,
      total: datosCompra.total - objeto_eliminado[0].total,
    });
    setProductosCompra([...copy_compras].reverse());
    handleClose();
  };

  return (
    <div>
      <IconButton
        color="secondary"
        size="small"
        onClick={handleClickOpen}
        disabled={isSelected}
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="modal-eliminar-compra"
      >
        <DialogTitle id="modal-eliminar-compra">
          {"Seguro que quiere eliminar esto de la lista?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={eliminarCompra} color="secondary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
