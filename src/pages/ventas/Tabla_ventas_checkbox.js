import React, { useState, useEffect, Fragment, useRef, useContext } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Input from "@material-ui/core/Input";
import EliminarProductoVenta from "./EliminarProductoVenta";

import { useDebounce } from "use-debounce";
import {
  findProductArray,
  verifiPrising,
  calculatePrices2
} from "../../config/reuserFunctions";
import { VentasContext } from '../../context/Ventas/ventasContext';
import { Avatar } from "@material-ui/core";


const headCells = [
  {
    id: "Cantidad",
    numeric: false,
    disablePadding: true,
    label: "Cantidad",
    width: 20,
  },
  {
    id: "Descripcion",
    numeric: true,
    disablePadding: false,
    label: "Descripcion",
    width: 340,
  },
  {
    id: "Existencias",
    numeric: true,
    disablePadding: false,
    label: "Existencias",
    width: 40,
  },
  {
    id: "% Desc",
    numeric: true,
    disablePadding: false,
    label: "% Desc",
    width: 50,
  },
  {
    id: "U. Venta",
    numeric: true,
    disablePadding: false,
    label: "U. Venta",
    width: 50,
  },
  {
    id: "Precio U",
    numeric: true,
    disablePadding: false,
    label: "Precio U",
    width: 100,
  },
  {
    id: "Eliminar",
    numeric: true,
    disablePadding: false,
    label: "Eliminar",
    width: 10,
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 7
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  container: {
    height: "100%",
    '& ::-webkit-scrollbar': {
      display: 'none'
    }
  },
  table: {
    minWidth: 750,
    height: "55vh",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },

}));

export default function EnhancedTable({
  setDatosVentasActual,
}) {
  const classes = useStyles();
  const [ selected, setSelected ] = useState([]);
	const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { setProductoCambioPrecio, setPrecioSelectProductoVenta, updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);

  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(venta === null ? [] : venta.productos);
  }, [updateTablaVentas]);

  const handleClick = (name) => {
    let newSelected = [];
    const exist = selected.indexOf(name) !== -1;
    if(exist){
      newSelected = [];
    }else{
      newSelected = newSelected.concat([], name);
    } 
    const producto = name.id_producto.precios.precios_producto.filter((p) => p.precio_neto === name.precio_actual_producto);
    if(producto.length > 0) setPrecioSelectProductoVenta(producto);
    setProductoCambioPrecio(name);
    setSelected(newSelected);
  };

  const TwoClickInRowTableBuy = (e, producto) => {
    try {
      let timer;
      clearTimeout(timer);
      if (e.detail === 2) {
        handleClick(producto);
        setProductoCambioPrecio(producto);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };

  return (
    <div className={classes.root}>
      <Paper>
        <TableContainer className={classes.container}>
          {/* <div
            style={{
              display: 'flex', 
              width: '80%', 
              height: '60%', 
              alignItems: 'center',
              backgroundPosition: 'center',
              justifyContent: 'center',
              zIndex: 'auto',
              position: 'absolute',
            }}
          >
            <div
              style={{
                maxWidth: '40%'
              }}
            >
              <Avatar
                alt="Imagen fondo empresa"
                src={sesion.empresa.imagen}
                style={{
                  height: '100%',
                  width: '100%',
                  opacity: .2
                }}
              />
            </div>
          </div> */}
          <Table
            stickyHeader
            size="small"
            aria-labelledby="tableTitle"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 25, textAlign:"center" }}></TableCell>
                <TableCell style={{ width: 20, textAlign:"center" }}>Cantidad</TableCell>
                <TableCell style={{ width: 340 }}>Descripcion</TableCell>
                <TableCell style={{ width: 40, textAlign:"center" }}>Exis.</TableCell>
                <TableCell style={{ width: 50, textAlign:"center" }}><b>% Desct.</b></TableCell>
                <TableCell style={{ width: 40, textAlign:"center" }}>Rx.</TableCell>
                <TableCell style={{ width: 50, textAlign:"center" }}>U. Venta</TableCell>
                <TableCell style={{ width: 100, textAlign:"center" }}>Precio U</TableCell>
                <TableCell align="center" style={{ width: 10 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {datosTabla?.map((producto, index) => {
                const isItemSelected = isSelected(producto);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RenderTableRows
                    key={index}
                    producto={producto}
                    setUpdateTablaVentas={setUpdateTablaVentas}
                    updateTablaVentas={updateTablaVentas}
                    setDatosVentasActual={setDatosVentasActual}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    selected={selected}
                    TwoClickInRowTableBuy={TwoClickInRowTableBuy}
                    setSelected={setSelected}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RenderTableRows = ({
  producto,
  setUpdateTablaVentas,
  updateTablaVentas,
  setDatosVentasActual,
  TwoClickInRowTableBuy,
  handleClick,
  isItemSelected,
  labelId,
  setSelected,
  selected
}) => {
  // const [actuallyProduct, setActuallyProduct] = useState(producto);
  const [newCantidadProduct, setNewCantidadProduct] = useState(
    producto.cantidad_venta
  );
  
  const [ tempAmount, setTempAmount ] = useState(producto.cantidad_venta);

  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);


  useEffect(() => {
    setTempAmount(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  useEffect(() => {
    CalculeDataPricing(value);
  }, [value]);
  

  const calculateNewPricingAmount = (cantidad) => {
    try {
      setTempAmount(cantidad);
      setNewCantidadProduct(cantidad);
    } catch (error) {
      return false;
    }
  }

  const CalculeDataPricing = async (new_cant) => {
    if(new_cant === "" || new_cant == 0){
      setTempAmount(producto.cantidad_venta);
    }else{
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let productosVentas = venta === null ? [] : venta.productos;
      const venta_actual = venta === null ? [] : venta;
      let productosVentasTemp = productosVentas;
      let venta_existente =
        venta === null
          ? {
              subTotal: 0,
              total: 0,
              impuestos: 0,
              iva: 0,
              ieps: 0,
              descuento: 0,
              monedero: 0
            }
          : venta;

      let CalculosData = {};
      
      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(
        producto
      );
      if (producto_encontrado.found) {
        const { cantidad_venta, ...newP } =
          producto_encontrado.producto_found.producto;
        newP.cantidad_venta = new_cant
        const verify_prising = await verifiPrising(newP);
        const newPrising = verify_prising.found ? verify_prising.object_prising : newP.precio_actual_object;
        
        const new_resta = await calculatePrices2({newP, cantidad: cantidad_venta, precio_boolean: true, precio: newP.precio_actual_object, granel: newP.granel_producto, origen: "Tabla" });
        const new_suma = await calculatePrices2({newP, cantidad: new_cant, precio_boolean: true, precio: newPrising, granel: newP.granel_producto, origen: "Tabla" });

        if (verify_prising.found) {
          newP.precio_a_vender = new_suma.totalCalculo;
          newP.precio_anterior = newP.precio_actual_porducto;
          newP.precio_actual_producto = verify_prising.pricing;
          newP.precio_actual_object = verify_prising.object_prising;
        }else{
          newP.cantidad_venta = parseInt(new_cant);
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_a_vender = new_suma.totalCalculo;
        }

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(new_resta.subtotalCalculo) +
            new_suma.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(new_resta.totalCalculo) +
            new_suma.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(new_resta.impuestoCalculo) +
            new_suma.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(new_resta.ivaCalculo) +
            new_suma.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(new_resta.iepsCalculo) +
            new_suma.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(new_resta.descuentoCalculo) +
            new_suma.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(new_resta.monederoCalculo) +
            new_suma.monederoCalculo,
        };
      } else {
        console.log("El producto no existe");
      }

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
      setDatosVentasActual(CalculosData);
      //Recargar la tabla de los productos
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        style={{height: '15px'}}
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={producto._id}
        selected={isItemSelected}
        hover
        onClick={(e) => TwoClickInRowTableBuy(e,producto)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            onClick={(event) => {
              if(selected.length > 0) setSelected([]);
              handleClick(producto);
            }}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell>
          <Input
            inputRef={textfield}
            onChange={(e) => calculateNewPricingAmount(e.target.value)}
            value={tempAmount}
            type="number"
            name="cantidad_venta"
          />
        </TableCell>
        <TableCell>
          {producto.id_producto.datos_generales.nombre_comercial}
        </TableCell>
        <TableCell  style={{ textAlign:"center"}} >
          {producto.concepto === "medida"
            ? producto.cantidad
            : producto.inventario_general.map(
                (existencia) => `${existencia.cantidad_existente}`
              )}
        </TableCell>
        <TableCell  style={{ textAlign:"center"}} >
          %{" "}
          {producto.descuento_activo === true
            ? producto.descuento.porciento
            : 0}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          {producto.inventario_general.map(
            (existencia) => `${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          $ { producto.precio_actual_producto}
        </TableCell>
        <TableCell style={{ textAlign:"center"}} >
          <EliminarProductoVenta
            producto={producto}
            setDatosVentasActual={setDatosVentasActual}
          />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
