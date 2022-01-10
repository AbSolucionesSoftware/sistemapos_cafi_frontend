import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from "@material-ui/core";
import { ComprasContext } from "../../../../context/Compras/comprasContext";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { formaPago } from "../../Facturacion/catalogos";
import { Done } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmarCompra({ realizarCompraBD }) {
  const [open, setOpen] = useState(false);
  const [loading_modal, setLoadingModal] = useState(false);
  const {
    productosCompra,
    datosCompra,
    setDatosCompra,
    issue,
    descuentoCompra,
    setDescuentoCompra,
  } = useContext(ComprasContext);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const obtenerFormaPago = (forma_pago) => {
    setDatosCompra({
      ...datosCompra,
      forma_pago,
    });
  };

  const aplicarDescuento = (descuento_aplicado) => {
    if (!descuento_aplicado) {
      setDescuentoCompra({
        ...descuentoCompra,
        subtotal: datosCompra.subtotal,
        total: datosCompra.total,
        descuento_aplicado,
        porcentaje: 0,
        cantidad_descontada: 0,
        precio_con_descuento: 0,
      });
      return;
    }
    setDescuentoCompra({
      ...descuentoCompra,
      descuento_aplicado,
    });
  };

  const obtenerPorcentaje = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDescuentoCompra({
        ...descuentoCompra,
        subtotal: datosCompra.subtotal,
        total: datosCompra.total,
        porcentaje: 0,
        cantidad_descontada: 0,
        precio_con_descuento: 0,
      });
      return;
    }
    let porcentaje = parseFloat(value);
    let cantidad_descontada = Math.round(
      (datosCompra.subtotal * porcentaje) / 100
    );
    let precio_con_descuento = datosCompra.subtotal - cantidad_descontada;

    setDescuentoCompra({
      ...descuentoCompra,
      subtotal: parseFloat((precio_con_descuento).toFixed(2)),
      total: parseFloat((precio_con_descuento + datosCompra.impuestos).toFixed(2)),
      porcentaje,
      cantidad_descontada,
      precio_con_descuento: parseFloat((precio_con_descuento).toFixed(2)),
    });
  };

  const obtenerPrecio = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDescuentoCompra({
        ...descuentoCompra,
        subtotal: datosCompra.subtotal,
        total: datosCompra.total,
        porcentaje: 0,
        cantidad_descontada: 0,
        precio_con_descuento: 0,
      });
      return;
    }

    let cantidad_descontada = parseFloat(value);
    let porcentaje = Math.round(
      (cantidad_descontada / datosCompra.subtotal) * 100
    );
    /* let descuento_porcentaje = 100 - porcentaje; */
    let precio_con_descuento = datosCompra.subtotal - cantidad_descontada;

    setDescuentoCompra({
      ...descuentoCompra,
      subtotal: parseFloat((precio_con_descuento).toFixed(2)),
      total: parseFloat((precio_con_descuento + datosCompra.impuestos).toFixed(2)),
      porcentaje,
      cantidad_descontada,
      precio_con_descuento: parseFloat((precio_con_descuento).toFixed(2)),
    });
  };

  return (
    <div>
      <Button
        autoFocus
        color="primary"
        variant="contained"
        size="large"
        onClick={() => handleClickOpen()}
        disabled={!productosCompra.length || issue}
        startIcon={<Done />}
      >
        Realizar compra
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="dialog-confirmacion-compra"
        aria-describedby="dialog-confirmacion-compra-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <Box>
            <Typography>
              <b>Total de productos:</b>
              {" " + productosCompra.length}
            </Typography>
            <Typography>
              <b>Subtotal:</b>
              {" $" +
                formatoMexico(
                  !descuentoCompra.subtotal
                    ? datosCompra.subtotal
                    : descuentoCompra.subtotal
                )}
            </Typography>
            <Typography>
              <b>Impuestos:</b>
              {" $" + formatoMexico(datosCompra.impuestos)}
            </Typography>
            <Typography>
              <b>Total:</b>
              {" $" +
                formatoMexico(
                  !descuentoCompra.total
                    ? datosCompra.total
                    : descuentoCompra.total
                )}
            </Typography>
          </Box>

          <Box my={2}>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              name="forma_pago"
            >
              <InputLabel id="forma_pago">Forma de pago</InputLabel>
              <Select
                labelId="forma_pago"
                value={datosCompra.forma_pago}
                name="forma_pago"
                onChange={(e) => obtenerFormaPago(e.target.value)}
                label="Forma de pago"
              >
                {formaPago.map((res, index) => (
                  <MenuItem
                    key={index}
                    value={res.Value}
                  >{`${res.Value} - ${res.Name}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={descuentoCompra.descuento_aplicado}
                  onChange={(e) => aplicarDescuento(e.target.checked)}
                  name="descuento_aplicado"
                />
              }
              label="Aplicar descuento"
            />
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => obtenerPrecio(e.target.value)}
                  disabled={!descuentoCompra.descuento_aplicado}
                  value={descuentoCompra.cantidad_descontada}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  type="number"
                  size="small"
                  fullWidth
                  onChange={(e) => obtenerPorcentaje(e.target.value)}
                  disabled={!descuentoCompra.descuento_aplicado}
                  value={descuentoCompra.porcentaje}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={loading_modal}
          >
            Cancelar
          </Button>
          <Button
            onClick={() =>
              realizarCompraBD(false, undefined, handleClose, setLoadingModal)
            }
            color="primary"
            startIcon={
              loading_modal ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
            disabled={loading_modal}
          >
            Realizar Compra
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
