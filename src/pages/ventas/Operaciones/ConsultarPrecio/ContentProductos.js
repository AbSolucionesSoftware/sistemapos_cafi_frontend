import React, { Fragment } from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorPage from "../../../../components/ErrorPage";
import VistaProductoNormal from "./ProductoNormal";
import VistaProductoMedidas from "./ProductoMedidas";

export default function ProductosViewComponent({ dataQuery }){
  let productoBase = null;
  const { data, loading, error } = dataQuery;

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="53vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        <ErrorPage />
      </Box>
    );
  }

  if (data && data.obtenerUnProductoVentas.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        NO HAY
      </Box>
    );
  }

  if (data) productoBase = data.obtenerUnProductoVentas;

  if (productoBase === null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        BUSCA UN PRODUCTO
      </Box>
    );
  }

  return (
    <Fragment>
      {productoBase.length === 1 ? (
        <VistaProductoNormal productoBase={productoBase[0]} />
      ) : (
        <VistaProductoMedidas productos={productoBase} />
      )}
    </Fragment>
  );
};
