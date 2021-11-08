import React, {
  useContext,
  useState,
  Fragment,
  useEffect,
  useCallback,
} from "react";
import {
  Typography,
  MenuItem,
  Divider,
  Tooltip,
  FormLabel,
} from "@material-ui/core";
import { Box, FormControl, Grid, Select } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";

import { Done } from "@material-ui/icons";
import TablaPresentaciones from "./TablaPresentaciones";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { AlmacenProvider } from "../../../../../context/Almacenes/crearAlmacen";
import ContainerRegistroAlmacen from "../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen";
import CrearColorProducto from "./crearColor";
import CrearTallasProducto from "./crearTalla";

const useStyles = makeStyles((theme) => ({
  colorContainer: {
    border: "1px solid rgba(0,0,0, .3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    margin: 1,
    borderRadius: "15%",
    cursor: "pointer",
  },
}));

const GenCodigoBarras = () => {
  return Math.floor(
    Math.random() * (999999999999 - 100000000000 + 1) + 100000000000
  ).toString();
};

export default function ColoresTallas({
  obtenerConsultasProducto,
  refetch,
  datos,
  from,
  withoutPrice,
}) {
  const {
    almacen_inicial,
    setAlmacenInicial,
    presentaciones,
    datos_generales,
  } = useContext(RegProductoContext);
  const { almacenes, colores, tallas, calzados } = obtenerConsultasProducto;
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const medidas =
    datos_generales.tipo_producto === "ROPA" ? [...tallas] : [...calzados];
  const [onUpdate, setOnUpdate] = useState([]);

  const obtenerColoresSeleccinados = useCallback(() => {
    let colors = [];
    let medidas = [];
    const copy_presentaciones = [...presentaciones];

    copy_presentaciones.forEach((element) => {
      if (element.color._id) colors.push(element.color);
      if (element.medida._id) medidas.push(element.medida);
    });

    var hashColor = {};
    var hashMedida = {};
    const colores_existentes = colors.filter((color) => {
      var existColor = !hashColor[color._id];
      hashColor[color._id] = true;
      return existColor;
    });
    const medidas_existentes = medidas.filter((medida) => {
      var existMedida = !hashMedida[medida._id];
      hashMedida[medida._id] = true;
      return existMedida;
    });

    setColoresSeleccionados([...colores_existentes]);
    setMedidasSeleccionadas([...medidas_existentes]);
  }, [presentaciones]);

  const obtenerAlmacenes = (event, child) => {
    setAlmacenInicial({
      ...almacen_inicial,
      [event.target.name]: event.target.value,
      [child.props.name]: child.props.id,
    });
  };

  useEffect(() => {
    obtenerColoresSeleccinados();
  }, [obtenerColoresSeleccinados]);

  return (
    <div>
      <Box>
        <Grid container spacing={2}>
          {!datos.medidas_registradas ? (
            <Grid item md={4}>
              <Box width="100%">
                <Typography>Almacen</Typography>
                <Box display="flex">
                  <FormControl
                    disabled={presentaciones.length === 0 || from === "compra"}
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="almacen"
                    error={
                      presentaciones.length > 0 && !almacen_inicial.almacen
                    }
                  >
                    <Select
                      name="almacen"
                      value={almacen_inicial.almacen}
                      onChange={obtenerAlmacenes}
                    >
                      <MenuItem value="">
                        <em>Seleccione uno</em>
                      </MenuItem>
                      {almacenes ? (
                        almacenes.map((res) => {
                          return (
                            <MenuItem
                              name="id_almacen"
                              key={res._id}
                              value={res.nombre_almacen}
                              id={res._id}
                            >
                              {res.nombre_almacen}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem value="" />
                      )}
                    </Select>
                    {presentaciones.length > 0 && !almacen_inicial.almacen ? (
                      <FormLabel>* Campo obligatorio</FormLabel>
                    ) : null}
                  </FormControl>
                  {from === "compra" ? null : (
                    <AlmacenProvider>
                      <ContainerRegistroAlmacen
                        accion="registrar"
                        refetch={refetch}
                      />
                    </AlmacenProvider>
                  )}
                </Box>
              </Box>
            </Grid>
          ) : null}

          <Grid item md={!datos.medidas_registradas ? 4 : 6}>
            <Box
              width="100%"
              style={
                onUpdate.length > 0
                  ? {
                      pointerEvents: "none",
                      opacity: 0.4,
                    }
                  : null
              }
            >
              <Box display="flex" alignItems="center">
                <Typography>
                  {datos_generales.tipo_producto === "ROPA"
                    ? "Talla"
                    : "Número"}
                </Typography>
                <Box mx={1} />
                <CrearTallasProducto
                  setMedidasSeleccionadas={setMedidasSeleccionadas}
                  refetch={refetch}
                />
              </Box>
              <Grid container>
                {medidas.map((talla, index) => (
                  <RenderTallas
                    key={index}
                    talla={talla}
                    coloresSeleccionados={coloresSeleccionados}
                    medidasSeleccionadas={medidasSeleccionadas}
                    setMedidasSeleccionadas={setMedidasSeleccionadas}
                    datos={datos}
                  />
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid item md={!datos.medidas_registradas ? 4 : 6}>
            <Box
              width="100%"
              style={
                onUpdate.length > 0
                  ? {
                      pointerEvents: "none",
                      opacity: 0.4,
                    }
                  : null
              }
            >
              <Box display="flex" alignItems="center">
                <Typography>Color</Typography>
                <Box mx={1} />
                <CrearColorProducto refetch={refetch} />
              </Box>
              <Grid container>
                {colores.map((color, index) => (
                  <Colores
                    key={index}
                    color={color}
                    coloresSeleccionados={coloresSeleccionados}
                    setColoresSeleccionados={setColoresSeleccionados}
                    medidasSeleccionadas={medidasSeleccionadas}
                    datos={datos}
                  />
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Box mt={3} />
        <TablaPresentaciones
          from={from}
          withoutPrice={withoutPrice}
          datos={datos}
          setOnUpdate={setOnUpdate}
          onUpdate={onUpdate}
        />
      </Box>
    </div>
  );
}

const RenderTallas = ({
  talla,
  coloresSeleccionados,
  medidasSeleccionadas,
  setMedidasSeleccionadas,
  datos,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    setPresentaciones,
    presentaciones,
    datos_generales,
    preciosP,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
    almacen_inicial
  } = useContext(RegProductoContext);
  const [selected, setSelected] = useState(false);

  const seleccionarMedidas = useCallback(() => {
    medidasSeleccionadas.forEach((res) => {
      if (res._id === talla._id) setSelected(true);
    });
  }, [talla._id, medidasSeleccionadas]);

  useEffect(() => {
    if (datos.medidas_registradas) {
      return seleccionarMedidas();
    }
  }, [seleccionarMedidas]);

  const handleAddTallas = (value) => {
    const medidas_seleccionadas_temp = [...medidasSeleccionadas];

    if (!selected) {
      medidas_seleccionadas_temp.push(talla);
      setSelected(value);
    } else {
      medidas_seleccionadas_temp.forEach((res, index) => {
        if (res._id === talla._id) {
          medidas_seleccionadas_temp.splice(index, 1);
          setSelected(value);
          presentaciones.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.medida._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          });
        }
      });
    }

    let presentacion_temp = [];
    const array_medidad_finales = [...presentaciones];

    if (!coloresSeleccionados.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        presentacion_temp.push({
          _id: "",
          almacen: almacen_inicial.id_almacen,
          existencia: false,
          codigo_barras: GenCodigoBarras(),
          nombre_comercial: datos_generales.nombre_comercial,
          medida: producto_medida,
          color: { nombre: "", hex: "" },
          precio: preciosP[0].precio_neto,
          cantidad: 0,
          cantidad_nueva: 0,
          nuevo: true,
        });
      }
    } else if (
      !coloresSeleccionados.length &&
      array_medidad_finales.length > 0
    ) {
      /* SI NO HAY COLORES REGISTRADOS PERO YA HAY TALLAS SE AGREGAN MAS */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        const result = array_medidad_finales.filter(
          (res) => res.medida._id === producto_medida._id
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            _id: "",
            almacen: almacen_inicial.id_almacen,
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: datos_generales.nombre_comercial,
            medida: producto_medida,
            color: { nombre: "", hex: "" },
            precio: preciosP[0].precio_neto,
            cantidad: 0,
            cantidad_nueva: 0,
            nuevo: true,
          });
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      medidas_seleccionadas_temp.length === 1 &&
      value
    ) {
      /* SI HAY COLORES SE LE AGREGA TALLA POR PRIMERA VEZ */
      for (let i = 0; i < array_medidad_finales.length; i++) {
        for (let k = 0; k < medidas_seleccionadas_temp.length; k++) {
          presentacion_temp.push({
            _id: "",
            almacen: almacen_inicial.id_almacen,
            existencia: array_medidad_finales[i].existencia,
            codigo_barras: array_medidad_finales[i].codigo_barras,
            nombre_comercial: array_medidad_finales[i].nombre_comercial,
            medida: medidas_seleccionadas_temp[k],
            color: array_medidad_finales[i].color,
            precio: array_medidad_finales[i].precio,
            cantidad: array_medidad_finales[i].cantidad,
            cantidad_nueva: array_medidad_finales[i].cantidad_nueva,
            nuevo: true,
          });
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      medidas_seleccionadas_temp.length > 0
    ) {
      /* YA HAY COLORES Y MEDIDAS EN LAS PRESENTACIONES, SE AGREGAN NORMAL */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        for (let k = 0; k < coloresSeleccionados.length; k++) {
          const producto_color = coloresSeleccionados[k];
          const presentacion_existente = array_medidad_finales.filter(
            (producto_array_final) =>
              producto_array_final.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.color._id
          );
          if (!presentacion_existente.length) {
            presentacion_temp.push({
              _id: "",
              almacen: almacen_inicial.id_almacen,
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: datos_generales.nombre_comercial,
              medida: producto_medida,
              color: producto_color,
              precio: preciosP[0].precio_neto,
              cantidad: 0,
              cantidad_nueva: 0,
              nuevo: true,
            });
          } else {
            presentacion_temp.push(presentacion_existente[0]);
          }
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      !medidas_seleccionadas_temp.length
    ) {
      /* SI NO HAY TALLAS SE VUELVE A LISTAR LOS COLORES QUE YA ESTABAN EN PRESENTACIONES */
      const presentaciones_existentes = array_medidad_finales.filter(
        (producto) => producto.medida._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            _id: objeto_presentaciones_final._id,
            almacen: objeto_presentaciones_final.almacen,
            existencia: objeto_presentaciones_final.existencia,
            codigo_barras: objeto_presentaciones_final.codigo_barras,
            nombre_comercial: objeto_presentaciones_final.nombre_comercial,
            medida: {},
            color: objeto_presentaciones_final.color,
            precio: objeto_presentaciones_final.precio,
            cantidad: objeto_presentaciones_final.cantidad,
            cantidad_nueva: objeto_presentaciones_final.cantidad_nueva,
            nuevo: true,
          });
        }
      }
    }

    setMedidasSeleccionadas([...medidas_seleccionadas_temp]);
    setPresentaciones(presentacion_temp);
  };

  return (
    <Grid item>
      <div
        className={classes.colorContainer}
        onClick={() => handleAddTallas(!selected)}
        style={
          selected
            ? {
                backgroundColor: theme.palette.primary.main,
              }
            : null
        }
      >
        <Typography
          variant="button"
          style={{
            color: theme.palette.getContrastText(
              selected ? theme.palette.primary.main : "#FFFFFF"
            ),
            fontSize: 16,
          }}
        >
          {talla.talla}
        </Typography>
      </div>
    </Grid>
  );
};

const Colores = ({
  color,
  coloresSeleccionados,
  setColoresSeleccionados,
  medidasSeleccionadas,
  datos,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    presentaciones,
    setPresentaciones,
    datos_generales,
    preciosP,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
    almacen_inicial
  } = useContext(RegProductoContext);

  const [selected, setSelected] = useState(false);

  const seleccionarColores = useCallback(() => {
    coloresSeleccionados.forEach((res) => {
      if (res._id === color._id) setSelected(true);
    });
  }, [color._id, coloresSeleccionados]);

  useEffect(() => {
    if (datos.medidas_registradas) {
      return seleccionarColores();
    }
  }, [seleccionarColores]);

  const obtenerColores = (value) => {
    if (!selected) {
      coloresSeleccionados.push(color);
      setSelected(value);
    } else {
      coloresSeleccionados.forEach((res, index) => {
        if (res._id === color._id) {
          coloresSeleccionados.splice(index, 1);
          setSelected(value);
          presentaciones.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.color._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          });
        }
      });
    }
    let presentacion_temp = [];
    const array_medidad_finales = [...presentaciones];

    if (!medidasSeleccionadas.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        presentacion_temp.push({
          _id: "",
          almacen: almacen_inicial.id_almacen,
          existencia: false,
          codigo_barras: GenCodigoBarras(),
          nombre_comercial: datos_generales.nombre_comercial,
          medida: {},
          color: producto_color,
          precio: preciosP[0].precio_neto,
          cantidad: 0,
          cantidad_nueva: 0,
          nuevo: true,
        });
      }
    } else if (
      !medidasSeleccionadas.length &&
      array_medidad_finales.length > 0
    ) {
      /* SI YA HAY COLORES REGISTRADOS SE AGREGAN MAS */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        const result = array_medidad_finales.filter(
          (res) => res.color._id === producto_color._id
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            _id: "",
            almacen: almacen_inicial.id_almacen,
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: datos_generales.nombre_comercial,
            medida: {},
            color: producto_color,
            precio: preciosP[0].precio_neto,
            cantidad: 0,
            cantidad_nueva: 0,
            nuevo: true,
          });
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      coloresSeleccionados.length === 1 &&
      value
    ) {
      /* SI YA HAY TALLAS SE LE AGREGA EL COLOR POR PRIMERA VEZ */
      for (let i = 0; i < array_medidad_finales.length; i++) {
        for (let k = 0; k < coloresSeleccionados.length; k++) {
          presentacion_temp.push({
            _id: "",
            almacen: almacen_inicial.id_almacen,
            existencia: array_medidad_finales[i].existencia,
            codigo_barras: array_medidad_finales[i].codigo_barras,
            nombre_comercial: array_medidad_finales[i].nombre_comercial,
            medida: array_medidad_finales[i].medida,
            color: coloresSeleccionados[k],
            precio: array_medidad_finales[i].precio,
            cantidad: array_medidad_finales[i].cantidad,
            cantidad_nueva: array_medidad_finales[i].cantidad_nueva,
            nuevo: true,
          });
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      coloresSeleccionados.length > 0
    ) {
      /* YA HAY TALLAS Y MEIDAS EN LAS PRESENTACIONES, SE REGISTRAN NORMAL */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        for (let k = 0; k < medidasSeleccionadas.length; k++) {
          const producto_medida = medidasSeleccionadas[k];
          const presentacion_existente = array_medidad_finales.filter(
            (producto_array_final) =>
              producto_array_final.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.color._id
          );
          if (!presentacion_existente.length) {
            presentacion_temp.push({
              _id: "",
              almacen: almacen_inicial.id_almacen,
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: datos_generales.nombre_comercial,
              medida: producto_medida,
              color: producto_color,
              precio: preciosP[0].precio_neto,
              cantidad: 0,
              cantidad_nueva: 0,
              nuevo: true,
            });
          } else {
            presentacion_temp.push(presentacion_existente[0]);
          }
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      !coloresSeleccionados.length
    ) {
      /* SI NO HAY COLORES SE VUELVE A LISTAR LAS TALLAS QUE YA ESTABAN EN PRESENTACIONES */
      const presentaciones_existentes = array_medidad_finales.filter(
        (producto) => producto.color._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            _id: objeto_presentaciones_final._id,
            almacen: objeto_presentaciones_final.almacen,
            existencia: objeto_presentaciones_final.existencia,
            codigo_barras: objeto_presentaciones_final.codigo_barras,
            nombre_comercial: objeto_presentaciones_final.nombre_comercial,
            medida: objeto_presentaciones_final.medida,
            color: { nombre: "", hex: "" },
            precio: objeto_presentaciones_final.precio,
            cantidad: objeto_presentaciones_final.cantidad,
            cantidad_nueva: objeto_presentaciones_final.cantidad_nueva,
            nuevo: true,
          });
        }
      }
    }

    setColoresSeleccionados([...coloresSeleccionados]);
    setPresentaciones(presentacion_temp);
  };

  return (
    <Grid item>
      <Tooltip
        title={color.nombre}
        placement="top"
        arrow
        TransitionComponent={Zoom}
      >
        <div
          className={classes.colorContainer}
          style={{
            backgroundColor: color.hex,
            color: theme.palette.getContrastText(color.hex),
          }}
          onClick={() => obtenerColores(!selected)}
        >
          {selected ? <Done /> : null}
        </div>
      </Tooltip>
    </Grid>
  );
};
