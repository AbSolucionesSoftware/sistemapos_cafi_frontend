import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../styles";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import SnackBarMessages from "../../../components/SnackBarMessages";
import { calculatePrices, findProductArray } from "../../../config/reuserFunctions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreciosProductos() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState([]);

  const [preciosProductos, setPreciosProductos] = useState({})

  const {
    productoCambioPrecio,
    precioSelectProductoVenta,
    setPrecioSelectProductoVenta,
    setUpdateTablaVentas,
    updateTablaVentas
  } = useContext(VentasContext);
  // console.log(productoCambioPrecio.id_producto.precios.precios_producto[0]);
  const [selectPrisingProduct, setSelectPrisingProduct] = useState(
    precioSelectProductoVenta.length > 0 ? precioSelectProductoVenta[0] : {}
  );

  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  // console.log(productoCambioPrecio);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setPreciosProductos(productoCambioPrecio);
  }, [productoCambioPrecio ])

  const handleAceptChangePrising = async () => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? { subTotal: 0, total: 0, impuestos: 0, iva: 0, ieps: 0, descuento: 0, monedero: 0 }
        : venta;
    let productosVentasTemp = productosVentas;

    // console.log(precioSelectProductoVenta);
    if (
      selectPrisingProduct.precio_neto > 0 ||
      precioSelectProductoVenta.length > 0
    ) {

      const newProductoPrecioNuevo = { ...productoCambioPrecio };
      const newProductoPrecioActual = { ...productoCambioPrecio };

      //Calculos de impuestos que se van a restar de la venta;
      let calculoResta = {};
      //Calculos de impuestos que se van a sumar a la venta
      let calculoSuma = {};

      const producto_encontrado = await findProductArray(
        productosVentas,
        productoCambioPrecio
      );

      if (producto_encontrado.found) {
        //Hacer peticion para traer los precios a restar
        calculoResta = await calculatePrices(
          newProductoPrecioNuevo,
          newProductoPrecioNuevo.cantidad_venta,
          newProductoPrecioNuevo.granel_producto,
          newProductoPrecioNuevo.precio_actual_producto
        );

        //Hacer la peticion para traer los precios a sumar
        calculoSuma = await calculatePrices(
          newProductoPrecioActual,
          newProductoPrecioActual.cantidad_venta,
          newProductoPrecioActual.granel_producto,
          precioSelectProductoVenta[0].precio_neto
        );

        newProductoPrecioActual.precio_a_vender = precioSelectProductoVenta[0].precio_neto;
        newProductoPrecioActual.precio_seleccionado = true;
        newProductoPrecioActual.precio_actual_producto = precioSelectProductoVenta[0].precio_neto;
        console.log(newProductoPrecioActual);
        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newProductoPrecioActual
        );
      }

      
      //Crear objeto que guardara el cambio
      const CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) -
          parseFloat(calculoResta.subtotalCalculo) +
          calculoSuma.subtotalCalculo,
        total:
          parseFloat(venta_existente.total) -
          parseFloat(calculoResta.totalCalculo) +
          calculoSuma.totalCalculo,
        impuestos:
          parseFloat(venta_existente.impuestos) -
          parseFloat(calculoResta.impuestoCalculo) +
          calculoSuma.impuestoCalculo,
        iva:
          parseFloat(venta_existente.iva) -
          parseFloat(calculoResta.ivaCalculo) +
          calculoSuma.ivaCalculo,
        ieps:
          parseFloat(venta_existente.ieps) -
          parseFloat(calculoResta.iepsCalculo) +
          calculoSuma.iepsCalculo,
        descuento:
          parseFloat(venta_existente.descuento) -
          parseFloat(calculoResta.descuentoCalculo) +
          calculoSuma.descuentoCalculo,
        monedero: parseFloat(venta_existente.monedero) - parseFloat(calculoResta.monederoCalculo) +
          calculoSuma.monederoCalculo,
      };

      //Guardarlo en el localStorage
      localStorage.setItem(
        "DatosVentas",
        JSON.stringify({
          ...CalculosData,
          cliente:
            venta_actual.venta_cliente === true ? venta_actual.cliente : {},
          venta_cliente:
            venta_actual.venta_cliente === true
              ? venta_actual.venta_cliente
              : false,
          productos: productosVentasTemp,
        })
      );
      // newProductoPrecio = {...newProductoPrecio};
      setUpdateTablaVentas(!updateTablaVentas);
      setPrecioSelectProductoVenta([]);
      setPreciosProductos({});
      //Cerrar modal
      handleClickOpen();
    } else {
      setAlert({
        message: "Este precio no es valido.",
        status: "error",
        open: true,
      });
    }
  };

  const handleClick = (precio) => {
    let newSelected = [];
    newSelected = newSelected.concat([], precio);
    setSelectPrisingProduct(precio);
    setPrecioSelectProductoVenta(newSelected);
  };

  const isSelected = (name) => precioSelectProductoVenta.indexOf(name) !== -1;

  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.keyCode === 114) {
      handleClickOpen();
    }
  }

  return (
    <>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Button className={classes.borderBotonChico} onClick={handleClickOpen}>
        <Box>
          <Box>
            <img
              src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/ventas/money.svg"
              alt="icono money"
              style={{ fontSize: 35 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Precios</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F3</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Grid container item lg={12}>
            <Box display="flex" justifyContent="center">
              <Box mt={3}>
                <img
                  src="https://cafi-sistema-pos.s3.us-west-2.amazonaws.com/Iconos/money.svg"
                  alt="icono caja"
                  className={classes.iconSizeDialogs}
                />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box>
                <Box textAlign="right" mb={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClickOpen}
                    size="medium"
                  >
                    <CloseIcon />
                  </Button>
                </Box>
                <Box mt={2}>
                  <Typography variant="h6">Precios de Producto</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid>
            <div className={classes.formInputFlex}>
              <Box width="100%">
                <Typography>
                  Nombre:{" "}
                  {productoCambioPrecio
                    ? productoCambioPrecio?.id_producto?.datos_generales
                        ?.nombre_comercial
                    : ""}
                </Typography>
              </Box>
            </div>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 25 }}></TableCell>
                      <TableCell style={{ width: 20 }}>Precio</TableCell>
                      <TableCell style={{ width: 20 }}>Precio neto</TableCell>
                      <TableCell style={{ width: 200 }}>
                        Unidad mayoreo
                      </TableCell>
                      <TableCell style={{ width: 100 }}>% Utilidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {preciosProductos?.id_producto?.precios?.precios_producto?.map(
                      (precio, index) => {
                        const isItemSelected = isSelected(precio);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <RenderTableRows
                            key={index}
                            precio={precio}
                            isItemSelected={isItemSelected}
                            labelId={labelId}
                            handleClick={handleClick}
                          />
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleAceptChangePrising()}
            variant="contained"
            color="primary"
            size="large"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const RenderTableRows = ({ precio, isItemSelected, labelId, handleClick }) => {
  const doubleClick = (e) => {
    try {
      if (e.detail === 2) {
        handleClick(precio);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={precio.numero_precio}
        selected={isItemSelected}
        hover
        onClick={(e) => doubleClick(e)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            onClick={(event) => {
              handleClick(precio);
            }}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell align={"center"}>{precio.numero_precio}</TableCell>
        <TableCell align={"center"}>{precio.precio_neto > 0 ? precio.precio_neto.toFixed(4) : 0}</TableCell>
        <TableCell align={"center"}>{precio.unidad_mayoreo}</TableCell>
        <TableCell align={"center"}>{precio.utilidad}</TableCell>
      </TableRow>
    </Fragment>
  );
};
