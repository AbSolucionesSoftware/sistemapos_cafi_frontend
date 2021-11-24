import React, { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  FormControl,
  Divider,
  MenuItem,
  Select,
  Container,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  Grid,
} from "@material-ui/core";
import {
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import CatalogosProductosSAT from "./CatalogoProductosSAT";

import { useMutation } from "@apollo/client";
import {
  CREAR_CATEGORIA,
  CREAR_SUBCATEGORIA,
} from "../../../../../gql/Catalogos/categorias";
import { REGISTRAR_DEPARTAMENTO } from "../../../../../gql/Catalogos/departamentos";
import { REGISTRAR_MARCAS } from "../../../../../gql/Catalogos/marcas";
import SnackBarMessages from "../../../../../components/SnackBarMessages";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  obligatorio: {
    color: "red",
  },
}));

export default function RegistroInfoGenerales({
  obtenerConsultasProducto,
  refetch,
}) {
  const classes = useStyles();
  const {
    datos_generales,
    setDatosGenerales,
    validacion,
    precios,
    setPrecios,
    centro_de_costos,
    setSubcostos,
  } = useContext(RegProductoContext);
  const {
    subcategorias,
    setSubcategorias,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    update,
  } = useContext(RegProductoContext);
  const {
    categorias,
    departamentos,
    marcas,
    centro_costos,
  } = obtenerConsultasProducto;

  const obtenerCampos = (e) => {
    if (e.target.name === "monedero_electronico") {
      if (!e.target.value) {
        setPrecios({
          ...precios,
          [e.target.name]: "",
        });
        return;
      }
      setPrecios({
        ...precios,
        [e.target.name]: parseFloat(e.target.value),
      });
      return;
    }
    if (e.target.name === "codigo_barras") {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        codigo_barras: e.target.value,
      });
    }
    setDatosGenerales({
      ...datos_generales,
      [e.target.name]: e.target.value,
    });
  };

  const checkFarmacia = (e) => {
    setDatosGenerales({
      ...datos_generales,
      receta_farmacia: e.target.checked,
    });
  };

  const obtenerChecks = (e) => {
    if (e.target.name === "monedero" && e.target.checked) {
      setPrecios({
        ...precios,
        monedero_electronico: 1,
        monedero: e.target.checked,
      });
      return;
    }
    /* setPrecios({
			...precios,
			[e.target.name]: e.target.checked
		}); */
    if (e.target.name === "granel" && e.target.checked) {
      setPrecios({
        ...precios,
        [e.target.name]: e.target.checked,
        inventario: { ...precios.inventario, unidad_de_inventario: "Kg" },
        unidad_de_compra: { ...precios.unidad_de_compra, unidad: "Kg" },
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad: "Kg",
      });
    } else {
      setPrecios({
        ...precios,
        [e.target.name]: e.target.checked,
        inventario: { ...precios.inventario, unidad_de_inventario: "Pz" },
        unidad_de_compra: { ...precios.unidad_de_compra, unidad: "Pz" },
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad: "Pz",
      });
    }
  };

  const obtenerIDs = (event, child) => {
    setDatosGenerales({
      ...datos_generales,
      [event.target.name]: event.target.value,
      [child.props.name]: child.props.id,
    });
    if (child.props.categoria) {
      const { subcategorias } = child.props.categoria;
      setSubcategorias(subcategorias);
    }
  };

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setDatosGenerales({
      ...datos_generales,
      codigo_barras,
    });
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      codigo_barras,
    });
  };

  const verificarCampoVacio = (campo) => {
    if (!precios.monedero_electronico) {
      setPrecios({
        ...precios,
        monedero_electronico: 1,
      });
    }
  };

  useEffect(() => {
    if (update) {
      const categoria = categorias.filter(
        (res) => res._id === datos_generales.id_categoria
      );
      const costos = centro_costos.filter(
        (res) => res._id === centro_de_costos.id_cuenta
      );
      if (categoria.length > 0) {
        setSubcategorias(categoria[0].subcategorias);
      }
      if (costos.length > 0) {
        setSubcostos(costos[0].subcuentas);
      }
    }
  }, [update]);

  return (
    <Fragment>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <FormControl
              variant="outlined"
              size="small"
              name="codigo_barras"
              fullWidth
            >
              <Typography>Código de barras</Typography>
              <OutlinedInput
                disabled={update && datos_generales.codigo_barras}
                style={{ padding: 0 }}
                id="form-producto-codigo-barras"
                name="codigo_barras"
                value={
                  datos_generales.codigo_barras
                    ? datos_generales.codigo_barras
                    : ""
                }
                onChange={obtenerCampos}
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      disabled={update && datos_generales.codigo_barras}
                      onClick={() => GenCodigoBarras()}
                      /* edge="end" */
                      color="primary"
                      variant="outlined"
                      size="large"
                    >
                      Generar
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>
              <span className={classes.obligatorio}>* </span>Clave alterna
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.clave_alterna}
              name="clave_alterna"
              id="form-producto-clave-alterna"
              variant="outlined"
              value={
                datos_generales.clave_alterna
                  ? datos_generales.clave_alterna
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>
              <span className={classes.obligatorio}>* </span>Tipo de producto
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.tipo_producto}
            >
              <Select
                id="form-producto-tipo"
                name="tipo_producto"
                value={
                  datos_generales.tipo_producto
                    ? datos_generales.tipo_producto
                    : ""
                }
                onChange={obtenerCampos}
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                <MenuItem value="ROPA">Ropa</MenuItem>
                <MenuItem value="CALZADO">Calzado</MenuItem>
                <MenuItem value="OTROS">Otros</MenuItem>
              </Select>
              <FormHelperText>{validacion.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <CatalogosProductosSAT />
          </Grid>

          <Grid item md={4} xs={12}>
            <Typography>
              <span className={classes.obligatorio}>* </span>Nombre comercial
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.nombre_comercial}
              name="nombre_comercial"
              id="form-producto-nombre-comercial"
              variant="outlined"
              value={
                datos_generales.nombre_comercial
                  ? datos_generales.nombre_comercial
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>
              <span className={classes.obligatorio}>* </span>Nombre genérico
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.nombre_generico}
              name="nombre_generico"
              id="form-producto-nombre-generico"
              variant="outlined"
              value={
                datos_generales.nombre_generico
                  ? datos_generales.nombre_generico
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography>Descripción</Typography>
            <TextField
              fullWidth
              size="small"
              name="descripcion"
              id="form-producto-descripcion"
              variant="outlined"
              value={
                datos_generales.descripcion ? datos_generales.descripcion : ""
              }
              onChange={obtenerCampos}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Typography>Categoria</Typography>
            <Box display="flex">
              <FormControl variant="outlined" fullWidth size="small">
                <Select
                  id="form-producto-categoria"
                  value={
                    datos_generales.categoria ? datos_generales.categoria : ""
                  }
                  onChange={(event, child) => obtenerIDs(event, child)}
                  name="categoria"
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {categorias ? (
                    categorias.map((res) => {
                      return (
                        <MenuItem
                          name="id_categoria"
                          key={res._id}
                          value={res.categoria}
                          id={res._id}
                          categoria={res}
                        >
                          {res.categoria}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="categoria"
                name="categoria"
                refetch={refetch}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography>Subcategoria</Typography>
            <Box display="flex">
              <FormControl variant="outlined" fullWidth size="small">
                <Select
                  id="form-producto-subcategoria"
                  name="subcategoria"
                  value={
                    datos_generales.subcategoria
                      ? datos_generales.subcategoria
                      : ""
                  }
                  onChange={(event, child) => obtenerIDs(event, child)}
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {subcategorias ? (
                    subcategorias.map((res) => {
                      return (
                        <MenuItem
                          name="id_subcategoria"
                          key={res._id}
                          value={res.subcategoria}
                          id={res._id}
                        >
                          {res.subcategoria}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="subcategoria"
                name="subcategoria"
                refetch={refetch}
                subcategorias={subcategorias}
                setSubcategorias={setSubcategorias}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography>Departamento</Typography>
            <Box display="flex">
              <FormControl variant="outlined" fullWidth size="small">
                <Select
                  id="form-producto-departamento"
                  name="departamento"
                  value={
                    datos_generales.departamento
                      ? datos_generales.departamento
                      : ""
                  }
                  onChange={(event, child) => obtenerIDs(event, child)}
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {departamentos ? (
                    departamentos.map((res) => {
                      return (
                        <MenuItem
                          name="id_departamento"
                          key={res._id}
                          value={res.nombre_departamentos}
                          id={res._id}
                        >
                          {res.nombre_departamentos}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="departamento"
                name="nombre_departamentos"
                refetch={refetch}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography>Marca</Typography>
            <Box display="flex">
              <FormControl variant="outlined" fullWidth size="small">
                <Select
                  id="form-producto-marca"
                  name="marca"
                  value={datos_generales.marca ? datos_generales.marca : ""}
                  onChange={(event, child) => obtenerIDs(event, child)}
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {marcas ? (
                    marcas.map((res) => {
                      return (
                        <MenuItem
                          name="id_marca"
                          key={res._id}
                          value={res.nombre_marca}
                          id={res._id}
                        >
                          {res.nombre_marca}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="marca"
                name="nombre_marca"
                refetch={refetch}
              />
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" mt={4}>
          <Grid container>
            <Grid item md={3} xs={12}>
              {!update ? (
                <Box>
                  <Box>
                    <Typography>
                      <b>Granel</b>
                    </Typography>
                    <Divider />
                  </Box>
                  <div className={classes.formInput}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={precios.granel ? precios.granel : false}
                          onChange={obtenerChecks}
                          name="granel"
                        />
                      }
                      label="Vender a granel"
                    />
                  </div>
                </Box>
              ) : null}
            </Grid>
            <Grid item md={3} xs={12}>
              <Box>
                <Typography>
                  <b>Farmacia</b>
                </Typography>
                <Divider />
              </Box>
              <div className={classes.formInput}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        datos_generales.receta_farmacia
                          ? datos_generales.receta_farmacia
                          : false
                      }
                      onChange={checkFarmacia}
                      name="receta_farmacia"
                    />
                  }
                  label="Necesita receta"
                  name="receta_farmacia"
                />
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box>
                <Typography>
                  <b>Monedero eléctronico</b>
                </Typography>
                <Divider />
              </Box>
              <Box>
                <Box className={classes.formInput}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={precios.monedero}
                        onChange={obtenerChecks}
                        name="monedero"
                      />
                    }
                    label="Monedero electrónico"
                  />
                  <TextField
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                    label="Valor por punto"
                    name="monedero_electronico"
                    id="form-producto-monedero_electronico"
                    variant="outlined"
                    value={precios.monedero_electronico}
                    onChange={obtenerCampos}
                    disabled={precios.monedero ? false : true}
                    onBlur={() => verificarCampoVacio("monedero_electronico")}
                    error={precios.monedero_electronico === ""}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
}

const RegistrarNuevoSelect = ({
  tipo,
  name,
  refetch,
  subcategorias,
  setSubcategorias,
}) => {
  const [open, setOpen] = useState(false);
  const [validacion, setValidacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  Categorias Mutation */
  const [crearCategoria] = useMutation(CREAR_CATEGORIA);
  /*  Subcategorias Mutation */
  const [crearSubcategoria] = useMutation(CREAR_SUBCATEGORIA);
  /*  Departamentos Mutation */
  const [CrearDepartamentos] = useMutation(REGISTRAR_DEPARTAMENTO);
  /*  Marcas Mutation */
  const [CrearMarca] = useMutation(REGISTRAR_MARCAS);

  const handleToggle = () => {
    setOpen(!open);
  };

  const obtenerDatos = (e) => {
    setValue(e.target.value);
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!value) {
      setValidacion(true);
      return;
    }
    let variables = {
      input: {
        [name]: value,
      },
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    };
    if (tipo === "categoria") {
      variables = {
        input: {
          [name]: value,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      };
    }
    if (tipo === "subcategoria") {
      variables = {
        input: {
          [name]: value,
        },
        idCategoria: datos_generales.id_categoria,
      };
    }
    setLoading(true);
    try {
      switch (tipo) {
        case "categoria":
          const categoria_creada = await crearCategoria({ variables });
          refetch();
          const id_categoria = categoria_creada.data.crearCategoria._id;
          setDatosGenerales({
            ...datos_generales,
            categoria: value,
            id_categoria,
          });
          break;
        case "subcategoria":
          const subcategoria_creada = await crearSubcategoria({ variables });
          refetch();
          const id_subcategoria =
            subcategoria_creada.data.crearSubcategoria.message;
          setSubcategorias([
            ...subcategorias,
            { _id: id_subcategoria, subcategoria: value },
          ]);
          setDatosGenerales({
            ...datos_generales,
            subcategoria: value,
            id_subcategoria,
          });
          break;
        case "departamento":
          const departamento_creado = await CrearDepartamentos({ variables });
          refetch();
          const id_departamento =
            departamento_creado.data.crearDepartamentos.message;
          setDatosGenerales({
            ...datos_generales,
            departamento: value,
            id_departamento,
          });
          break;
        case "marca":
          const marca_creada = await CrearMarca({ variables });
          refetch();
          const id_marca = marca_creada.data.crearMarcas.message;
          setDatosGenerales({
            ...datos_generales,
            marca: value,
            id_marca,
          });
          break;
        default:
          break;
      }
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
      handleToggle();
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        color="primary"
        onClick={() => handleToggle()}
        disabled={tipo === "subcategoria" && !datos_generales.id_categoria}
      >
        <Add />
      </Button>
      <Dialog
        open={open}
        onClose={handleToggle}
        aria-labelledby={`modal-title-${tipo}`}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogTitle id={`modal-title-${tipo}`}>Registrar {tipo}</DialogTitle>
        <DialogContent>
          <form id={`registro-${name}`} onSubmit={(e) => guardarDatos(e)}>
            <TextField
              error={validacion}
              name={name}
              autoFocus
              label={tipo}
              fullWidth
              variant="outlined"
              onChange={obtenerDatos}
              helperText={validacion ? "Campo obligatorio" : ""}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggle()} color="primary">
            Cancelar
          </Button>
          <Button
            /* onClick={() => guardarDatos()} */
            form={`registro-${name}`}
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              loading ? <CircularProgress color="inherit" size={18} /> : null
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
