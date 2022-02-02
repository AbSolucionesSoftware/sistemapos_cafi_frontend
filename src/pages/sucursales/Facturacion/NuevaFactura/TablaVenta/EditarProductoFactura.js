import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";

import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { Edit } from "@material-ui/icons";
import {
  calculatePrices2,
  formatoMexico,
} from "../../../../../config/reuserFunctions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModificarProductoFactura({ venta, producto, index }) {
  const [open, setOpen] = useState(false);

  const [producto_base, setProductoBase] = useState({ ...producto });
  const [venta_base, setVentaBase] = useState({ ...venta });

  const [ cantidad_base, setCantidad] = useState(producto_base.cantidad_venta)
  const [ precio_base, setPrecio] = useState(producto_base.precio_actual_object.precio_neto);
  const [ error, setError] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProductoBase(producto);
    setVentaBase(venta);
  };

  const obtenerDatos = async (e) => {
    const { name, value } = e.target;
    if(name === "cantidad_venta"){
      setCantidad(value);
    }else{
      setPrecio(value);
    }
    if (!value) return;
    //##################
    let venta_copy = { ...venta_base };
    let copy_producto = { ...producto_base };
    let { precio_actual_object, cantidad_venta, granel_producto } = {
      ...copy_producto,
    };

    const { precios } = { ...copy_producto.producto };

    //meter el precio original para restalo a la venta
    const resta_base = await calculatePrices2({
      newP: copy_producto,
      cantidad: cantidad_venta,
      granel: granel_producto,
      precio_boolean: true,
      precio: precio_actual_object,
    });
    //restal resultados a la venta
    console.log(resta_base);

    venta_copy.iva = venta_copy.iva - resta_base.ivaCalculo;
    venta_copy.ieps = venta_copy.ieps - resta_base.iepsCalculo;
    venta_copy.impuestos = venta_copy.impuestos - resta_base.impuestoCalculo;
    venta_copy.subTotal = venta_copy.subTotal - resta_base.subtotalCalculo;
    venta_copy.total = venta_copy.total - resta_base.totalCalculo;
    venta_copy.monedero = venta_copy.monedero - resta_base.monederoCalculo;

    //realizar calculos de cantidad
    //meter el precio nuevo para sumarlo a la venta
    let suma_nuevo;

    if (name === "cantidad_venta") {
      suma_nuevo = await calculatePrices2({
        newP: producto,
        cantidad: parseFloat(value),
        granel: granel_producto,
        precio_boolean: true,
        precio: precio_actual_object,
      });
      copy_producto.cantidad_venta = parseFloat(value);
      setProductoBase({ ...copy_producto, [name]: parseFloat(value) });
    } else {
      //sacar impuestos
      const { iva, ieps } = precios;
      let suma_impuestos =
        parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
        parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);

      //sacar precio_venta
      let PVCI = parseFloat((parseFloat(value) / cantidad_venta).toFixed(2));
      let PVSI = parseFloat((PVCI / (suma_impuestos + 1)).toFixed(2));

      //restar descuento a precio_venta si hay
      if (precio_actual_object.dinero_descontado !== null) {
        PVSI = PVSI - precio_actual_object.dinero_descontado;
      }
      //sacar iva e ieps
      let iva_precio = parseFloat(
        PVSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`).toFixed(2)
      );
      let ieps_precio = parseFloat(
        PVSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`).toFixed(2)
      );
      //sacar utilidad
      let PCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
      let utilidad = parseFloat((((PVSI - PCSI) / PCSI) * 100).toFixed(2));

      let precios_nuevos = { ...precio_actual_object };

      precios_nuevos.ieps_precio = ieps_precio;
      precios_nuevos.iva_precio = iva_precio;
      precios_nuevos.precio_venta = PVSI;
      precios_nuevos.precio_neto = PVCI;
      precios_nuevos.utilidad = utilidad;
      if (precio_actual_object.unidad_maxima) {
        precio_actual_object.precio_general = parseFloat(value);
      }

      suma_nuevo = await calculatePrices2({
        newP: producto,
        cantidad: cantidad_venta,
        granel: granel_producto,
        precio_boolean: true,
        precio: precios_nuevos,
      });
      setProductoBase({
        ...copy_producto,
        precio_actual_object: precios_nuevos,
      });
    }
    //sumar resultados a la venta
    console.log(suma_nuevo);
    venta_copy.iva = venta_copy.iva + suma_nuevo.ivaCalculo;
    venta_copy.ieps = venta_copy.ieps + suma_nuevo.iepsCalculo;
    venta_copy.impuestos = venta_copy.impuestos + suma_nuevo.impuestoCalculo;
    venta_copy.subTotal = venta_copy.subTotal + suma_nuevo.subtotalCalculo;
    venta_copy.total = venta_copy.total + suma_nuevo.totalCalculo;
    venta_copy.monedero = venta_copy.monedero + suma_nuevo.monederoCalculo;
    setVentaBase(venta_copy);
  };
  console.log(venta_base);

  const verificarCampoVacio = (value) => {
    if (!value) {
      setError(true)
    }else{
      setError(false)
    }
  };

  const guardarPrecios = () => {
    if(error) return
    console.log("hola");
  }

  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {producto_base.producto.datos_generales.nombre_comercial}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Box mb={2}>
              <Typography>
                <b>Producto</b>
              </Typography>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 50 }}>Cantidad</TableCell>
                      <TableCell style={{ width: 50 }}>Precio</TableCell>
                      <TableCell style={{ width: 100 }}>Subtotal</TableCell>
                      <TableCell style={{ width: 100 }}>Impuestos</TableCell>
                      <TableCell style={{ width: 100 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow tabIndex={-1}>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={cantidad_base}
                          type="number"
                          name="cantidad_venta"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {producto_base.unidad}
                              </InputAdornment>
                            ),
                          }}
                          onChange={obtenerDatos}
                          placeholder={producto ? producto.cantidad_venta : ""}
                          onBlur={(e) => verificarCampoVacio(e.target.value)}
                          error={error && !cantidad_base}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={precio_base}
                          type="number"
                          name="precio_neto"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                          onChange={obtenerDatos}
                          placeholder={producto.precio_actual_object.precio_neto}
                          onBlur={(e) => verificarCampoVacio(e.target.value)}
                          error={error && !precio_base}
                        />
                      </TableCell>
                      <TableCell>
                        ${formatoMexico(producto_base.subtotal_total_producto)}
                      </TableCell>
                      <TableCell>
                        ${formatoMexico(producto_base.impuestos_total_producto)}
                      </TableCell>
                      <TableCell>
                        ${formatoMexico(producto_base.total_total_producto)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box>
              <Typography>
                <b>Impuestos</b>
              </Typography>
            </Box>
            <Divider />
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Activo</TableCell>
                    <TableCell style={{ width: 50 }}>Base</TableCell>
                    <TableCell style={{ width: 50 }}>Impuesto</TableCell>
                    <TableCell style={{ width: 100 }}>Tasa o Cuota</TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        /* checked={precios.iva_activo} */
                        /* onChange={obtenerIva} */
                        name="iva_activo"
                      />
                    </TableCell>
                    <TableCell style={{ width: 50 }}>IVA</TableCell>
                    <TableCell style={{ width: 50 }}>IEPS</TableCell>
                    <TableCell style={{ width: 100 }}>
                      <FormControl fullWidth size="small">
                        <Select
                        /* value={age} */
                        /* onChange={handleChange} */
                        >
                          <MenuItem value="Tasa">Tasa</MenuItem>
                          <MenuItem value="Cuota">Cuota</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                  <TableRow tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        /* checked={precios.iva_activo} */
                        /* onChange={obtenerIva} */
                        name="iva_activo"
                      />
                    </TableCell>
                    <TableCell style={{ width: 50 }}>Base</TableCell>
                    <TableCell style={{ width: 50 }}>Impuesto</TableCell>
                    <TableCell style={{ width: 100 }}>Tasa o Cuota</TableCell>
                    <TableCell style={{ width: 100 }}>
                      Valor Tasa o Cuota
                    </TableCell>
                    <TableCell style={{ width: 100 }}>Importe</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Typography>
              <b>Venta</b>
            </Typography>
          </Box>
          <Divider />
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 50 }}>IVA</TableCell>
                  <TableCell style={{ width: 50 }}>IEPS</TableCell>
                  <TableCell style={{ width: 100 }}>Subtotal</TableCell>
                  <TableCell style={{ width: 100 }}>Impuestos</TableCell>
                  <TableCell style={{ width: 100 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell>
                    <b>${formatoMexico(venta_base.iva)}</b>
                  </TableCell>
                  <TableCell>
                    <b>${formatoMexico(venta_base.ieps)}</b>
                  </TableCell>
                  <TableCell>
                    <b> ${formatoMexico(venta_base.subTotal)}</b>
                  </TableCell>
                  <TableCell>
                    <b>${formatoMexico(venta_base.impuestos)}</b>
                  </TableCell>
                  <TableCell>
                    <b> ${formatoMexico(venta_base.total)}</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => guardarPrecios()} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
