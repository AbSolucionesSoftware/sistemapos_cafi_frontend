import React, { Fragment, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import FormularioPrecios from "../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional";
import { Close } from "@material-ui/icons";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import Done from "@material-ui/icons/Done";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ agregarCompra, handleClose }) {
  const [open, setOpen] = useState(false);
  const { datosProducto, productoOriginal /* setDatosProducto */ } = useContext(
    ComprasContext
  );
  const {
    precios,
    setPrecios,
    setUnidadesVenta,
    setPreciosP,
    setUnidadVentaXDefecto,
  } = useContext(RegProductoContext);

  const toggleDrawer = () => setOpen(!open);

  const resetProducto = () => {
    /* SET STATES WHEN UPDATING */
    const { precios_producto, ...new_precios } = productoOriginal.precios;
    const unidadxdefecto = productoOriginal.unidades_de_venta.filter(
      (res) => res.default
    );
    /* setDatosProducto({...datosProducto, mantener_precio: true}) */
    setPrecios(new_precios);
    setUnidadesVenta(productoOriginal.unidades_de_venta);
    setPreciosP(productoOriginal.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    toggleDrawer();
  };

  const actualizarContextProducto = () => {
    toggleDrawer();
    let precio_unitario_con_impuesto =
      datosProducto.costo / datosProducto.cantidad;
    let precio_unitario_sin_impuesto =
      precios.precio_de_compra.precio_sin_impuesto / datosProducto.cantidad;

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;

    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_con_impuesto: datosProducto.costo,
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(2)
        ),
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(2)
        ),
        cantidad: parseInt(datosProducto.cantidad),
      },
    });
  };

  return (
    <Fragment>
      <Button
        color="primary"
        size="medium"
        onClick={() => actualizarContextProducto()}
      >
        Actualizar precios
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => resetProducto()}
        aria-labelledby="alert-precios-compra-title"
        aria-describedby="alert-precios-compra-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText id="alert-precios-compra-description">
            <FormularioPrecios />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            size="large"
            startIcon={<Close />}
            onClick={() => resetProducto()}
          >
            Cancelar
          </Button>
          <Button
            size="large"
            onClick={() => {
              /* setDatosProducto({...datosProducto, mantener_precio: false}) */
              agregarCompra("actualizar_precios");
              handleClose();
              toggleDrawer();
            }}
            startIcon={<Done />}
            color="primary"
            variant="contained"
            disabled={!precios.precio_de_compra.precio_con_impuesto}
          >
            Aceptar y agregar compra
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
