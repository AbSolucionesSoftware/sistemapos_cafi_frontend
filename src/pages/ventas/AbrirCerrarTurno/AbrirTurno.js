import React, { useContext, useState } from "react";
import useStyles from "../styles";

import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_CAJAS } from "../../../gql/Cajas/cajas";
import { REGISTRAR_TURNOS } from "../../../gql/Ventas/abrir_cerrar_turno";
import { VentasContext } from "../../../context/Ventas/ventasContext";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

export default function AbrirTurno({
  handleClickOpen,
  loading,
  type,
  setLoading,
}) {
  let sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const [CrearRegistroDeTurno] = useMutation(REGISTRAR_TURNOS);
  const { /* setTurnoActivo,  */setAlert } = useContext(VentasContext);

  const [error, setError] = useState(false);
  const [abrirTurno, setAbrirTurno] = useState([]);
  const [numeroCaja, setNumeroCaja] = useState("");

  const classes = useStyles();
  let obtenerCajasSucursal = [];

  const cajas = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  const obtenerTurno = (e) => {
    setAbrirTurno({ ...abrirTurno, [e.target.name]: e.target.value });
  };

  if (cajas.data) {
    obtenerCajasSucursal = cajas.data.obtenerCajasSucursal;
  }

  let arraySesion = {
    accesos: sesion.accesos,
    email: sesion.email,
    empresa: sesion.empresa,
    estado: sesion.estado,
    exp: sesion.exp,
    iat: sesion.iat,
    imagen: sesion.imagen,
    nombre: sesion.nombre,
    numero_usuario: sesion.numero_usuario,
    sucursal: sesion.sucursal,
    telefono: sesion.telefono,
    turno_en_caja_activo: true,
    _id: sesion._id,
  };

  const enviarDatos = async () => {
    setLoading(true);
    try {
      if (
        !abrirTurno.turno_en_curso ||
        !abrirTurno.caja_elegida ||
        !abrirTurno.monto_abrir
      ) {
        setError(true);
        setLoading(false);
        setAlert({
          message: `Por favor complete los datos obligatorios`,
          status: "error",
          open: true,
        });
        return;
      } else {
        const input = {
          horario_en_turno: abrirTurno.turno_en_curso,
          concepto: "ABRIR TURNO",
          numero_caja: numeroCaja.toString(),
          comentarios: abrirTurno.comentarios,
          id_caja: abrirTurno.caja_elegida,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          id_usuario: sesion._id,
          usuario_en_turno: {
            nombre: sesion.nombre,
            telefono: sesion.telefono,
            numero_usuario: sesion.numero_usuario.toString(),
            email: sesion.email,
          },
          hora_entrada: {
            hora: moment().format("hh"),
            minutos: moment().format("mm"),
            segundos: moment().format("ss"),
            completa: moment().format("HH:mm:ss"),
          },
          hora_salida: {
            hora: "",
            minutos: "",
            segundos: "",
            completa: "",
          },
          fecha_entrada: {
            year: moment().format("YYYY"),
            mes: moment().format("MM"),
            dia: moment().format("DD"),
            no_semana_year: moment().week().toString(),
            no_dia_year: moment().dayOfYear().toString(),
            completa: moment().format("YYYY-MM-DD"),
          },
          fecha_salida: {
            year: "",
            mes: "",
            dia: "",
            no_semana_year: "",
            no_dia_year: "",
            completa: "",
          },
          fecha_movimiento: moment().locale("es-mx").format(),
          montos_en_caja: {
            monto_efectivo: {
              monto: parseFloat(abrirTurno.monto_abrir),
              metodo_pago: "01",
            },
            monto_tarjeta_debito: {
              monto: 0,
              metodo_pago: "28",
            },
            monto_tarjeta_credito: {
              monto: 0,
              metodo_pago: "04",
            },
            monto_creditos: {
              monto: 0,
              metodo_pago: "99",
            },
            monto_monedero: {
              monto: 0,
              metodo_pago: "05",
            },
            monto_transferencia: {
              monto: 0,
              metodo_pago: "03",
            },
            monto_cheques: {
              monto: 0,
              metodo_pago: "02",
            },
            monto_vales_despensa: {
              monto: 0,
              metodo_pago: "08",
            },
          },
        };

        const variableTurnoAbierto = await CrearRegistroDeTurno({
          variables: {
            activa: true,
            input,
          },
        });

        if (variableTurnoAbierto.data.crearRegistroDeTurno === null) {
          setLoading(false);
          setAlert({
            message: `Lo sentimos esta caja ya esta en uso`,
            status: "error",
            open: true,
          });
        } else {
          localStorage.setItem(
            "turnoEnCurso",
            JSON.stringify(variableTurnoAbierto.data.crearRegistroDeTurno)
          );
          localStorage.setItem("sesionCafi", JSON.stringify(arraySesion));
          /* setTurnoActivo(true); */
          setAlert({
            message: `Turno abierto con exito`,
            status: "success",
            open: true,
          });
          /* if (type !== "FRENTE") {
            handleClickOpen();
          } */
          window.location.reload();
        }
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      /* if (type !== "FRENTE") {
        handleClickOpen();
      } */
    }
  };

  /* if (cajas.loading)
    return (
      <BackdropComponent loading={loading} />
      // <Box
      // display="flex"
      // flexDirection="column"
      // justifyContent="center"
      // alignItems="center"
      // height="80vh"
      // >
      // 	<CircularProgress />
      // </Box>
    ); */

  return (
    <div>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.titulos}> Empleado:</Typography>
            <TextField
              fullWidth
              size="small"
              name="nombre_usuario"
              onChange={obtenerTurno}
              disabled={true}
              value={sesion ? sesion.nombre : ""}
              id="form-producto-codigo-barras"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.titulos}>
              <span className="obligatorio">* </span>Turno:
            </Typography>
            <FormControl
              variant="outlined"
              disabled={turnoEnCurso ? true : false}
              fullWidth
              size="small"
              error={error && !abrirTurno.turno_en_curso}
            >
              <Select
                id="form-producto-tipo"
                name="turno_en_curso"
                onChange={obtenerTurno}
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                <MenuItem value="VESPERTINO">Vespertino</MenuItem>
                <MenuItem value="MATUTINO">Matutino</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography  className={classes.titulos}>
              <span className="obligatorio">* </span>Caja:
            </Typography>
            <FormControl
              variant="outlined"
              disabled={turnoEnCurso ? true : false}
              fullWidth
              size="small"
              error={error && !abrirTurno.caja_elegida}
            >
              <Select
                id="form-producto-tipo"
                name="caja_elegida"
                onChange={obtenerTurno}
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                {obtenerCajasSucursal.map((caja) => {
                  return caja.activa === true ? null : (
                    <MenuItem
                      key={caja.numero_caja}
                      value={caja._id}
                      onClick={() => setNumeroCaja(caja.numero_caja)}
                    >
                      Caja {caja.numero_caja}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography  className={classes.titulos}>
              {" "}
              <span className="obligatorio">* </span>Monto para abrir:
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="monto_abrir"
              inputProps={{ min: 0 }}
              type="number"
              onChange={obtenerTurno}
              id="form-producto-codigo-barras"
              variant="outlined"
              error={error && !abrirTurno.monto_abrir}
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.titulos}> Comentarios:</Typography>
            <TextField
              fullWidth
              size="small"
              name="comentarios"
              multiline
              rows={5}
              onChange={obtenerTurno}
              id="form-producto-codigo-barras"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box display="flex" alignItems="flex-end">
          <Button
            onClick={enviarDatos}
            variant="contained"
            color="primary"
            size="large"
            startIcon={loading || cajas.loading ? <CircularProgress color="inherit" size={20} /> : null}
            disabled={loading || cajas.loading}
          >
            Guardar
          </Button>
        </Box>
      </DialogActions>
    </div>
  );
}
