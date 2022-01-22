import React, { Fragment, useContext, useState } from "react";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  Box,
  TextField,
  Typography,
  Table,
  Checkbox,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { Add, DeleteOutline, LocalOffer } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { unitCodes, unitCodes_granel } from "../unidades";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `5px 5px`,
    },
  },
}));

export default function PreciosDeCompra() {
  const classes = useStyles();
  const {
    datos_generales,
    precios,
    unidadesVenta,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    update,
  } = useContext(RegProductoContext);
  const [unidades, setUnidades] = useState({
    unidad: precios.unidad_de_compra.unidad,
    codigo_unidad: precios.unidad_de_compra.codigo_unidad,
    unidad_principal: false,
    cantidad: 1,
  });

  const obtenerUnidadesVentas = (e, child) => {
    if (e.target.name === "cantidad") {
      let cantidad = parseFloat(e.target.value);
      setUnidades({
        ...unidades,
        cantidad: cantidad,
        precio: cantidad * unidadVentaXDefecto.precio,
      });
    } else if (e.target.name === "unidad") {
      const { codigo_unidad, unidad } = child.props.unidad;
      setUnidades({
        ...unidades,
        [e.target.name]: unidad,
        codigo_unidad,
        precio: unidades.cantidad * unidadVentaXDefecto.precio,
      });
    } else {
      setUnidades({
        ...unidades,
        [e.target.name]: e.target.value,
      });
    }
  };

  const obtenerPrecioUVentas = (value) => {
    console.log("obtenreprecio");
    if (unidades.descuento_activo && unidades.descuento_activo === true) {
      console.log("entra");
      //calcular nuevo precio entre %
      let precio_neto = Math.round(
        value -
          value *
            parseFloat(
              `0.${
                unidades.descuento.porciento < 10
                  ? `0${unidades.descuento.porciento}`
                  : unidades.descuento.porciento
              }`
            )
      );
      setUnidades({
        ...unidades,
        precio: parseFloat(value),
        descuento: { ...unidades.descuento, precio_neto },
      });
    } else {
      setUnidades({
        ...unidades,
        precio: parseFloat(value),
      });
    }
  };

  const agregarNuevaUnidad = () => {
    if (!unidades.unidad || !unidades.precio || !unidades.cantidad) return;
    unidades.descuento_activo = null;
    const { precio, cantidad } = unidades;
    const { iva, ieps } = precios;

    let suma_impuestos =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let PVCI = parseFloat((precio / cantidad).toFixed(2));
    let PVSI = parseFloat((PVCI / (suma_impuestos + 1)).toFixed(2));

    let PCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    let iva_precio = parseFloat(
      PVSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`).toFixed(2)
    );
    let ieps_precio = parseFloat(
      PVSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`).toFixed(2)
    );
    let utilidad = parseFloat((((PVSI - PCSI) / PCSI) * 100).toFixed(2));

    let new_unidad = {
      ...unidades,
      precio_unidad: {
        numero_precio: 1,
        precio_venta: PVSI,
        precio_neto: PVCI,
        unidad_mayoreo: 0,
        iva_precio,
        ieps_precio,
        utilidad,
        unidad_maxima: false,
      },
    };

    if (unidades.codigo_unidad === "XBX" || unidades.codigo_unidad === "KGM") {
      new_unidad.precio_unidad.precio_general = precio;
      new_unidad.precio_unidad.cantidad_unidad = cantidad;
      new_unidad.precio_unidad.unidad_maxima = true;
    }
    setUnidadesVenta([...unidadesVenta, new_unidad]);
    setUnidades({
      unidad: "Pz",
      codigo_unidad: "H87",
      unidad_principal: false,
    });
  };

  const descuentoUnidadXdefecto = (descuento_activo) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      descuento_activo,
    })
  } 

  const checkUnidadDefault = (checked) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      unidad_principal: checked,
    });
    if (checked) {
      let nuevo_array = [];
      for (let i = 0; i < unidadesVenta.length; i++) {
        const element = unidadesVenta[i];
        let new_element = {
          _id: element._id,
          codigo_barras: element.codigo_barras,
          unidad: element.unidad,
          codigo_unidad: element.codigo_unidad,
          precio: parseFloat(element.precio),
          cantidad: parseFloat(element.cantidad),
          unidad_principal: false,
          default: element.default,
          descuento: element.descuento,
          descuento_activo: element.descuento_activo,
          precio_unidad: element.precio_unidad,
        };
        nuevo_array.push(new_element);
      }
      setUnidadesVenta([...nuevo_array]);
    }
  };

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setUnidades({
      ...unidades,
      codigo_barras,
    });
  };

  return (
    <Fragment>
      <Box className={classes.formInputFlex} justifyContent="center">
        <Box width={100}>
          <Typography>Unidad</Typography>
          <Box display="flex">
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              name="unidad"
            >
              {precios.granel ? (
                <Select
                  name="unidad"
                  value={unidades.unidad}
                  onChange={obtenerUnidadesVentas}
                >
                  {unitCodes_granel.map((res, index) => (
                    <MenuItem key={index} unidad={res} value={res.unidad}>
                      {res.unidad}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  name="unidad"
                  value={unidades.unidad}
                  onChange={obtenerUnidadesVentas}
                >
                  {unitCodes.map((res, index) => (
                    <MenuItem key={index} unidad={res} value={res.unidad}>
                      {res.unidad}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Box>
        </Box>
        <Box width={180}>
          <Typography>
            Cantidad{" "}
            <b>
              {unidades.unidad === "Caja"
                ? "(pz por caja)"
                : unidades.unidad === "Costal"
                ? "(kg por costal)"
                : ""}
            </b>
          </Typography>
          <TextField
            disabled={unidades.codigo_unidad === "H87"}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            size="small"
            name="cantidad"
            variant="outlined"
            onChange={obtenerUnidadesVentas}
            value={unidades.cantidad ? unidades.cantidad : ""}
            fullWidth
          />
        </Box>
        <Box width={130}>
          <Typography>
            Precio por <b>{unidades.unidad}</b>
          </Typography>
          <TextField
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            size="small"
            name="precio"
            variant="outlined"
            onChange={(e) => obtenerPrecioUVentas(e.target.value)}
            value={unidades.precio ? unidades.precio : ""}
            fullWidth
          />
        </Box>
        {unidades.descuento_activo === true ? (
          <Box width={130}>
            <Typography>
              <b>$ </b>Descuento
            </Typography>
            <TextField
              inputProps={{ readOnly: true }}
              size="small"
              variant="outlined"
              value={unidades.descuento.precio_neto}
              fullWidth
            />
          </Box>
        ) : null}
        <Box width={240}>
          <FormControl
            variant="outlined"
            size="small"
            name="codigo_barras"
            fullWidth
          >
            <Typography>Código de barras</Typography>
            <OutlinedInput
              fullWidth
              disabled={update}
              id="input-codigo-barras"
              name="codigo_barras"
              value={unidades.codigo_barras ? unidades.codigo_barras : ""}
              onChange={obtenerUnidadesVentas}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    onClick={() => GenCodigoBarras()}
                    edge="end"
                    color="primary"
                    disabled={update}
                  >
                    Generar
                  </Button>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box display="flex" alignItems="flex-end">
          <Button
            color="primary"
            onClick={() => agregarNuevaUnidad()}
            startIcon={<Add fontSize="large" />}
            /* startIcon={
              actualizarUnidad ? (
                <Done fontSize="large" />
              ) : (
                <Add fontSize="large" />
              )
            } */
            variant="outlined"
            size="large"
          >
            Guardar
          </Button>
        </Box>
      </Box>
      <Box>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código de barras</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Aplicar Descuento</TableCell>
                <TableCell>Unidad Principal</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow /* selected={actualizarUnidad ? true : false} */>
                <TableCell>{datos_generales.codigo_barras}</TableCell>
                <TableCell>{unidadVentaXDefecto.unidad}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {unidadVentaXDefecto.descuento_activo !== null ? (
                      <LocalOffer
                        color={
                          unidadVentaXDefecto.descuento_activo === true
                            ? "primary"
                            : "action"
                        }
                      />
                    ) : null}
                    <Box mr={1} />
                    <Typography>
                      <b>
                        $
                        {formatoMexico(
                          unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento.precio_neto
                            : unidadVentaXDefecto.precio
                        )}
                      </b>
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{unidadVentaXDefecto.cantidad}</TableCell>
                <TableCell>
                  {unidadVentaXDefecto.descuento_activo !== undefined &&
                  unidadVentaXDefecto.descuento_activo !== null ? (
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={
                          unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento_activo
                            : false
                        }
                        onChange={(e) =>
                          descuentoUnidadXdefecto(e.target.checked)
                        }
                        inputProps={{ "aria-label": "check descuento" }}
                        color="primary"
                        disabled={unidadVentaXDefecto.descuento_activo === null}
                      />
                      <Typography color="primary">
                        %
                        {parseFloat(
                          unidadVentaXDefecto.descuento_activo !== null
                            ? unidadVentaXDefecto.descuento.porciento
                            : 0
                        )}
                      </Typography>
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={unidadVentaXDefecto.unidad_principal}
                    onChange={(e) => checkUnidadDefault(e.target.checked)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                    disabled={unidadesVenta.length === 0}
                  />
                </TableCell>
                <TableCell>
                  {/* {actualizarUnidad ? (
                    <IconButton
                      color="primary"
                      onClick={() => cancelarUpdate()}
                    >
                      <Close color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => updateUnidadPrincipal()}
                    >
                      <EditOutlined color="primary" />
                    </IconButton>
                  )} */}
                </TableCell>
              </TableRow>
              {unidadesVenta.map((unidades, index) => {
                if (unidades.default !== true)
                  return (
                    <RenderUnidadesRows
                      key={index}
                      unidades={unidades}
                      index={index}
                    />
                  );
                return null;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fragment>
  );
}

const RenderUnidadesRows = ({ unidades, index }) => {
  const {
    unidadesVenta,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
  } = useContext(RegProductoContext);

  const checkUnidadPrincipal = () => {
    let nuevo_array = [];
    for (let i = 0; i < unidadesVenta.length; i++) {
      const element = unidadesVenta[i];
      let new_element = {
        _id: element._id,
        codigo_barras: element.codigo_barras,
        unidad: element.unidad,
        codigo_unidad: element.codigo_unidad,
        precio: parseFloat(element.precio),
        cantidad: parseFloat(element.cantidad),
        unidad_principal: i === index ? true : false,
        default: element.default,
        descuento: element.descuento,
        descuento_activo: element.descuento_activo,
        precio_unidad: element.precio_unidad,
      };
      nuevo_array.push(new_element);
    }
    setUnidadesVenta([...nuevo_array]);
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      unidad_principal: false,
    });
  };

  const aplicarDescuento = (value) => {
    let nuevo_array = [];
    for (let i = 0; i < unidadesVenta.length; i++) {
      const element = unidadesVenta[i];

      let new_element = {
        _id: element._id,
        codigo_barras: element.codigo_barras,
        unidad: element.unidad,
        codigo_unidad: element.codigo_unidad,
        precio: parseFloat(element.precio),
        cantidad: parseFloat(element.cantidad),
        unidad_principal: element.unidad_principal,
        default: element.default,
        descuento: element.descuento,
        descuento_activo: i === index ? value : element.descuento_activo,
        precio_unidad: element.precio_unidad,
      };
      nuevo_array.push(new_element);
    }
    setUnidadesVenta([...nuevo_array]);
  };

  return (
    <TableRow>
      <TableCell>{unidades.codigo_barras}</TableCell>
      <TableCell>{unidades.unidad}</TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          {unidades.descuento_activo !== null ? (
            <LocalOffer
              color={unidades.descuento_activo ? "primary" : "action"}
            />
          ) : null}
          <Box mr={1} />
          <Typography>
            <b>
              $
              {formatoMexico(
                unidades.descuento_activo === true
                  ? unidades.descuento.precio_neto
                  : unidades.precio
              )}
            </b>
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{unidades.cantidad}</TableCell>
      <TableCell>
        {unidades.descuento_activo !== null ? (
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={
                unidades.descuento_activo ? unidades.descuento_activo : false
              }
              onChange={(e) => aplicarDescuento(e.target.checked)}
              inputProps={{ "aria-label": "check descuento" }}
              color="primary"
              disabled={unidades.descuento_activo === null}
            />
            <Typography color="primary">
              %
              {parseFloat(
                unidades.descuento && unidades.descuento !== null
                  ? unidades.descuento.porciento
                  : 0
              )}
            </Typography>
          </Box>
        ) : null}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={unidades.unidad_principal}
          onChange={(e) => checkUnidadPrincipal(e.target.checked)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
      </TableCell>
      <TableCell>
        <ModalDelete unidades={unidades} index={index} />
      </TableCell>
    </TableRow>
  );
};

const ModalDelete = ({ unidades, index }) => {
  const [open, setOpen] = useState(false);
  const {
    unidadesVenta,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
  } = useContext(RegProductoContext);

  const toggleModal = () => {
    setOpen(!open);
  };

  const eliminarUnidad = () => {
    unidadesVenta.splice(index, 1);
    if (unidadesVenta.length === 0 || unidades.unidad_principal) {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad_principal: true,
      });
    }
    setUnidadesVenta([...unidadesVenta]);
    toggleModal();
  };

  return (
    <div>
      <IconButton color="primary" onClick={() => toggleModal()}>
        <DeleteOutline color="primary" />
      </IconButton>
      <Dialog open={open} onClose={toggleModal}>
        <DialogTitle>{"se eliminará esta unidad de venta"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => toggleModal()} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => eliminarUnidad()} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
