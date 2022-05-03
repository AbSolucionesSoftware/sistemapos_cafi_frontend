import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CrearProducto from "./crearProducto";
import DescuentoProductos from "./Descuentos/Descuento";
import EliminarProducto from "./EliminarProducto";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "70vh",
	'& ::-webkit-scrollbar': {
		display: 'none'
	}
  },
  avatar: {
    width: 130,
    height: 130,
  },
});

export default function ListaProductos({ obtenerProductos, productosRefetch }) {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Codigo barras</TableCell>
              <TableCell>Clave alterna</TableCell>
              <TableCell>Nombre comercial</TableCell>
              <TableCell>Existencia</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="hide-scroll">
            {obtenerProductos.map((producto, index) => {
              return (
                <RenderTableRows
                  key={index}
                  producto={producto}
                  productosRefetch={productosRefetch}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const RenderTableRows = ({ producto, productosRefetch }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <Fragment>
      <TableRow>
        <TableCell>{producto.datos_generales.codigo_barras}</TableCell>
        <TableCell>{producto.datos_generales.clave_alterna}</TableCell>
        <TableCell>{producto.datos_generales.nombre_comercial}</TableCell>
        <TableCell>
          {producto.inventario_general.map(
            (existencia) =>
              `${existencia.cantidad_existente} ${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell>{producto.datos_generales.tipo_producto}</TableCell>
        <TableCell align="center" padding="checkbox">
          {sesion.accesos.catalogos.productos.editar === false ? (null):(
            <CrearProducto
              accion={true}
              datos={producto}
              productosRefetch={productosRefetch}
            />
          )}
        </TableCell>
        <TableCell align="center" padding="checkbox">
          <DescuentoProductos
            datos={producto}
            productosRefetch={productosRefetch}
          />
        </TableCell>
        <TableCell align="center" padding="checkbox">
          {sesion.accesos.catalogos.productos.eliminar === false ? (null):(
            <EliminarProducto
              datos={producto}
              productosRefetch={productosRefetch}
            />
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
