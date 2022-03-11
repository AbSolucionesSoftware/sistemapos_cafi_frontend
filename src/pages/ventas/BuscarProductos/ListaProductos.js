import React,{useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, CircularProgress, Tooltip } from "@material-ui/core";

const columns = [
  { id: "clave", label: "Clave", minWidth: 40, align: "center" },
  { id: "codigo", label: "C. Barras", minWidth: 40, align: "center" },
  { id: "descripcion", label: "Nombre/Descrip.", minWidth: 330 },
  { id: "medida", label: "Medida", minWidth: 40, align: "center" },
  { id: "color", label: "Color", minWidth: 40, align: "center" },
  { id: "existencia", label: "Exist.", minWidth: 30, align: "center" },
  { id: "unidad", label: "Unidad", minWidth: 30, align: "center" },
  { id: "precio", label: "Precio", minWidth: 30, align: "center" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: 15,
  },
  container: {
    height: "40vh",
  },
  colorContainer: {
		border: "1px solid rgba(0,0,0, .3)",
		height: 18,
		width: 18,
		borderRadius: "15%",
	  },
});

export default function ListaProductos({
  productosBusqueda,
  setProductoSeleccionado,
  loading,
}) {
/*   const classes = useStyles();
   useEffect(() => {
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
                  setProductoSeleccionado={setProductoSeleccionado}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function RowsProductos({ producto, setProductoSeleccionado }) {
  const classes = useStyles();
 //console.log(producto);
  let ComponenteMedida = () => {
    if(producto.medida){
      return(
      <TableCell align="center">
        <Tooltip
          title={producto.color.nombre}
          placement="top"
          arrow
        
        >
          <div
          className={classes.colorContainer}
          style={{
            backgroundColor: producto.color.hex,
          }}
          />
        </Tooltip>
      </TableCell>
      )
    }else{
      return(
        <TableCell align="center">{"N/A"}</TableCell>
      )
    }
  };

  let ComponenteColor = () => {
    if(producto.medida){
      return(<TableCell align="center">
        {producto.medida.talla}
      </TableCell>)
    }else{
      return(
        <TableCell align="center">{"N/A"}</TableCell>
        
      )
    }
  };
  return (
    <>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={producto._id}
        onClick={() => setProductoSeleccionado(producto)}
      >
        <TableCell align="center">
          {producto.id_producto.datos_generales.clave_alterna}
        </TableCell>
        <TableCell align="center">
          {producto.codigo_barras ? producto.codigo_barras : "N/A"}
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <ComponenteColor/>
        <ComponenteMedida/>
        
        <TableCell align="center">{producto.cantidad}</TableCell>
        <TableCell align="center">{producto.unidad}</TableCell>
        <TableCell align="center">{producto.precio}</TableCell>
      </TableRow>
    </>
  );
}
