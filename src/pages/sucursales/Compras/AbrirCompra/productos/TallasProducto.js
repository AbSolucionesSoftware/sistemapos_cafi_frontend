import React, { Fragment, useContext, useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { Close, Palette } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { OBTENER_CONSULTAS } from "../../../../../gql/Catalogos/productos";
import ErrorPage from "../../../../../components/ErrorPage";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import TallasProducto from "../../../Catalogos/Producto/TallasColores/TallasColores";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datosProducto } = useContext(ComprasContext);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });

  if (loading)
    return (
      <Button
        color="primary"
        size="medium"
        disabled={true}
        startIcon={<CircularProgress size={16} color="inherit" />}
      >
        Editar tallas y colores
      </Button>
    );

  if (error) return <ErrorPage error={error} />;

  const { obtenerConsultasProducto } = data;

  const toggleDrawer = () => setOpen(!open);

  return (
    <Fragment>
      <Button
        color="primary"
        size="medium"
        onClick={() => toggleDrawer()}
        startIcon={<Palette />}
        disabled={!datosProducto.producto.datos_generales}
      >
        Editar tallas y colores
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={toggleDrawer}
        aria-labelledby="alert-tallas-compra"
        aria-describedby="alert-tallas-compra-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText id="alert-tallas-compra-description">
            <TallasProducto
              datos={datosProducto.producto}
              obtenerConsultasProducto={obtenerConsultasProducto}
              refetch={refetch}
              from="compra"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => toggleDrawer()}
            startIcon={<Close />}
            color="primary"
            variant="contained"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
