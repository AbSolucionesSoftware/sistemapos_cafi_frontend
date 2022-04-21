import React, { Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { formatoMexico } from "../../../config/reuserFunctions";

const columns = [
  { id: "add", label: "", width: 30, align: "center" },
  { id: "clave", label: "Clave", minWidth: 40, align: "center" },
  { id: "codigo", label: "C. Barras", minWidth: 40, align: "center" },
  { id: "descripcion", label: "Nombre/Descrip.", minWidth: 330 },
  /* { id: "medida", label: "Medida", minWidth: 40, align: "center" },
  { id: "color", label: "Color", minWidth: 40, align: "center" }, */
  {
    id: "medida-color",
    label: "Color y Talla",
    minWidth: 200,
    align: "center",
  },
  { id: "existencia", label: "Exist.", minWidth: 30, align: "center" },
  { id: "unidad", label: "Unidad", minWidth: 30, align: "center" },
  { id: "precio", label: "Precio", minWidth: 30, align: "center" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 15,
    marginBottom: 15,
  },
  container: {
    height: "40vh",
  },
  colorContainer: {
    /* border: "1px solid rgba(0,0,0, .3)", */
    /* marginLeft: 8, */
    height: 28,
    width: 28,
    borderRadius: "15%",
    fontSize: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function ListaProductos({
  productosBusqueda,
  setProductoSeleccionado,
  productoSeleccionado,
  loading,
  agregarProductos,
}) {
  const classes = useStyles();
  /*  useEffect(() => {
     console.log('PRODUCTOS BUSQUEDA',productosBusqueda)
   }, [productosBusqueda]) */

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  const handleTableSelect = (e, producto) => {
    if (e.detail === 2 || e === "button") {
      setProductoSeleccionado(producto);
      agregarProductos(producto);
      return;
    }
    setProductoSeleccionado(producto);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {productosBusqueda?.map((producto, index) => {
              return (
                <RowsProductos
                  key={index}
                  producto={producto}
                  handleTableSelect={handleTableSelect}
                  productoSeleccionado={productoSeleccionado}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function RowsProductos({ producto, handleTableSelect, productoSeleccionado }) {
  const classes = useStyles();
  const theme = useTheme();

  try {
    let ComponenteMedidaColor = () => {
      if (producto.color && producto.medida) {
        return (
          <TableCell
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "56px",
            }}
          >
            <Tooltip title={producto.color.nombre} placement="top" arrow>
              <div
                className={classes.colorContainer}
                style={{
                  backgroundColor: producto.color.hex,
                  color: theme.palette.getContrastText(producto.color.hex),
                }}
              >
                {producto.medida.talla}
              </div>
            </Tooltip>
          </TableCell>
        );
      } else {
        return <TableCell align="center">{"N/A"}</TableCell>;
      }
    };
    /* let ComponenteColor = () => {
      if (producto.color) {
        return (
          <TableCell>
            <Tooltip title={producto.color.nombre} placement="top" arrow>
              <div
                className={classes.colorContainer}
                style={{
                  backgroundColor: producto.color.hex,
                }}
              />
            </Tooltip>
          </TableCell>
        );
      } else {
        return <TableCell align="center">{"N/A"}</TableCell>;
      }
    }; */

    /* let ComponenteMedida = () => {
      if (producto.medida) {
        return <TableCell align="center">{producto.medida.talla}</TableCell>;
      } else {
        return <TableCell align="center">{"N/A"}</TableCell>;
      }
    }; */

    let ComponentCantidad = () => {
      let cantidad = "";
      //console.log(producto)
      if (producto.id_producto.datos_generales.tipo_producto === "OTROS") {
        cantidad =
          producto.unidad === "Costal" || producto.unidad === "Caja"
            ? producto.inventario_general[0].cantidad_existente_maxima
            : producto.inventario_general[0].cantidad_existente;
      } else {
        cantidad = producto.cantidad;
      }
      return <TableCell align="center">{cantidad}</TableCell>;
    };

    return (
      <Fragment>
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={producto._id}
          onClick={(e) => handleTableSelect(e, producto)}
          selected={productoSeleccionado._id === producto._id}
        >
          <TableCell align="center">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => handleTableSelect("button", producto)}
            >
              <Add />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            {producto.id_producto.datos_generales.clave_alterna}
          </TableCell>
          <TableCell align="center">
            {producto.codigo_barras ? producto.codigo_barras : "N/A"}
          </TableCell>
          <TableCell>
            {producto.id_producto.datos_generales.nombre_comercial}
          </TableCell>
          {/* <ComponenteMedida />
          <ComponenteColor /> */}
          <ComponenteMedidaColor />
          <ComponentCantidad />
          <TableCell align="center">{producto.unidad}</TableCell>
          <TableCell align="center">
            ${producto.precio ? formatoMexico(producto.precio) : 0}
          </TableCell>
        </TableRow>
      </Fragment>
    );
  } catch (error) {
    console.log(error);
  }
}
