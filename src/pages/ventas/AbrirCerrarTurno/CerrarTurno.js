import React, { Fragment, useContext, useState } from "react";
import useStyles from "../styles";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { REGISTRAR_TURNOS } from "../../../gql/Ventas/abrir_cerrar_turno";

import moment from "moment";
import "moment/locale/es";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { useMutation } from "@apollo/client";
import { withRouter } from "react-router-dom";
moment.locale("es");

function CerrarTurno(props) {
  const { handleClickOpen, setLoading, loading } = props;
  const [CrearRegistroDeTurno] = useMutation(REGISTRAR_TURNOS);
  const { setAlert, setTurnoActivo, ubicacionTurno } = useContext(
    VentasContext
  );
  const [error, setError] = useState(false);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const classes = useStyles();
  const [montoTurno, setMontoTurno] = useState([]);
  const [cerrarTurno, setCerrarTurno] = useState([]);

  const obtenerCamposMontos = (e) => {
    setMontoTurno({ ...montoTurno, [e.target.name]: e.target.value });
  };

  const obtenerCampos = (e) => {
    setCerrarTurno({ ...cerrarTurno, [e.target.name]: e.target.value });
  };

  const input = {
    horario_en_turno: cerrarTurno.horario_en_turno,
    concepto: "CERRAR TURNO",
    token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : "",
    numero_caja: turnoEnCurso ? turnoEnCurso?.numero_caja.toString() : "",
    comentarios: cerrarTurno.comentarios,
    id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
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
      hora: "",
      minutos: "",
      segundos: "",
      completa: "",
    },
    hora_salida: {
      hora: moment().format("hh"),
      minutos: moment().format("mm"),
      segundos: moment().format("ss"),
      completa: moment().format("HH:mm:ss"),
    },
    fecha_entrada: {
      year: "",
      mes: "",
      dia: "",
      no_semana_year: "",
      no_dia_year: "",
      completa: "",
    },
    fecha_salida: {
      year: moment().format("YYYY"),
      mes: moment().format("MM"),
      dia: moment().format("DD"),
      no_semana_year: moment().week().toString(),
      no_dia_year: moment().dayOfYear().toString(),
      completa: moment().format("YYYY-MM-DD"),
    },
    fecha_movimiento: moment().locale("es-mx").format(),
    montos_en_caja: {
      monto_efectivo: {
        monto: parseFloat(
          montoTurno.monto_efectivo ? montoTurno.monto_efectivo : 0
        ),
        metodo_pago: "01",
      },
      monto_tarjeta_debito: {
        monto: parseFloat(
          montoTurno.monto_tarjeta_debito ? montoTurno.monto_tarjeta_debito : 0
        ),
        metodo_pago: "28",
      },
      monto_tarjeta_credito: {
        monto: parseFloat(
          montoTurno.monto_tarjeta_credito
            ? montoTurno.monto_tarjeta_credito
            : 0
        ),
        metodo_pago: "04",
      },
      monto_creditos: {
        monto: parseFloat(
          montoTurno.monto_creditos ? montoTurno.monto_creditos : 0
        ),
        metodo_pago: "99",
      },
      monto_monedero: {
        monto: parseFloat(
          montoTurno.monto_puntos ? montoTurno.monto_puntos : 0
        ),
        metodo_pago: "05",
      },
      monto_transferencia: {
        monto: parseFloat(
          montoTurno.monto_transferencia ? montoTurno.monto_transferencia : 0
        ),
        metodo_pago: "03",
      },
      monto_cheques: {
        monto: parseFloat(
          montoTurno.monto_cheques ? montoTurno.monto_cheques : 0
        ),
        metodo_pago: "02",
      },
      monto_vales_despensa: {
        monto: parseFloat(
          montoTurno.monto_vales_despensa ? montoTurno.monto_vales_despensa : 0
        ),
        metodo_pago: "08",
      },
    },
  };

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
    turno_en_caja_activo: false,
    _id: sesion._id,
  };

  const actualizarTurnoSesion = (ubicacionTurno) => {
    if (ubicacionTurno === "SESION") {
      localStorage.removeItem("sesionCafi");
      localStorage.removeItem("tokenCafi");
      localStorage.removeItem("turnoEnCurso");
      localStorage.removeItem("ListaEnEspera");
      localStorage.removeItem("DatosVentas");
      props.history.push("/");
    } else {
      localStorage.setItem("sesionCafi", JSON.stringify(arraySesion));
      localStorage.removeItem("DatosVentas");
      localStorage.removeItem("ListaEnEspera");
      localStorage.removeItem("turnoEnCurso");
    }
  };

  const enviarDatos = async () => {
    setLoading(true);
    try {
      if (!cerrarTurno.horario_en_turno) {
        setError(true);
        setLoading(false);
        setAlert({
          message: `Por favor elija que turno está cerrando`,
          status: "error",
          open: true,
        });
        return;
      } else {
        await CrearRegistroDeTurno({
          variables: {
            activa: false,
            input,
          },
        });
        setAlert({
          message: `Turno cerrado con exito`,
          status: "success",
          open: true,
        });

        actualizarTurnoSesion(ubicacionTurno);

        setLoading(false);
        handleClickOpen();
        setTurnoActivo(true);
      }
    } catch (error) {
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      setLoading(false);
      handleClickOpen();
    }
  };

  return (
    <Fragment>
      <DialogContent>
        <Box mb={2}>
          <Typography>
            <b>Montos a Depositar</b>
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>
              {" "}
              Monto Efectivo:
            </Typography>
            <TextField
              fullWidth
              name="monto_efectivo"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}> Creditos:</Typography>
            <TextField
              fullWidth
              name="monto_creditos"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>
              {" "}
              Tarjeta Debito:
            </Typography>
            <TextField
              fullWidth
              name="monto_tarjeta_debito"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>
              {" "}
              Tarjeta Credito:
            </Typography>
            <TextField
              fullWidth
              name="monto_tarjeta_credito"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>Monedero:</Typography>
            <TextField
              fullWidth
              name="monto_puntos"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>Transferencias:</Typography>
            <TextField
              fullWidth
              name="monto_transferencia"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>Cheques:</Typography>
            <TextField
              fullWidth
              name="monto_cheques"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography className={classes.titulos}>
              Vales de despensa:
            </Typography>
            <TextField
              fullWidth
              name="monto_vales_despensa"
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
              type="number"
              defaultValue={0}
              color="primary"
              onChange={obtenerCamposMontos}
            />
          </Grid>
        </Grid>
        <Box my={2} display="flex">
          <Typography>
            <b>Monto total efectivo: </b>
          </Typography>
          <Box mx={1} />
          <Typography>${montoTurno.monto_efectivo} Mx.</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.titulos}>
              <span className="obligatorio">* </span> Turno:
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              error={error && !cerrarTurno.horario_en_turno}
            >
              <Select
                onChange={obtenerCampos}
                id="form-producto-tipo"
                name="horario_en_turno"
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                <MenuItem value="VESPERTINO">Vespertino</MenuItem>
                <MenuItem value="MATUTINO">Matutino</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} justify="flex-end">
            <Typography className={classes.titulos}>Comentarios:</Typography>
            <TextField
              fullWidth
              multiline
              onChange={obtenerCampos}
              rows={2}
              size="small"
              name="comentarios"
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
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Aceptar
          </Button>
        </Box>
      </DialogActions>
    </Fragment>
  );
}

export default withRouter(CerrarTurno);
