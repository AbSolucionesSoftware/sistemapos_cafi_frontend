import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid,Box, TextField } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from '@material-ui/core';
import {Toolbar, Typography, Paper, IconButton, Tooltip, Dialog, Checkbox ,Slide, Button} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import { TraspasosAlmacenContext } from "../../context/Almacenes/traspasosAlmacen";
import TallasColoresTraspasos from './TallasColoresTraspasos';
import TableSelectMedidas from './TableSelectMedidas';
import { useQuery } from '@apollo/client';
import {  OBTENER_CONSULTAS } from "../../gql/Catalogos/productos";
import { RegProductoContext } from '../../context/Catalogos/CtxRegProducto';
// function createData(name, cantidad, precio) {
//   return { name, cantidad, precio };
// }

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'codeBarras', numeric: false, disablePadding: false, label: 'Código de barras' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Nombre' },
  { id: 'tipo', numeric: true, disablePadding: false, label: 'Tipo' },
  { id: 'cantidad', numeric: true, disablePadding: false, label: 'Cantidad' },

];
const getUnidadMax  = (cantidad_existente_maxima,unidadMaxima) => {
  //console.log('getCantidad',cantidad_nueva, cantidad_medida, accion)
  const UNIDAD_MAXIMA = {
    'Caja' :  'Cantidad existente en cajas: ' + cantidad_existente_maxima,
    'Costal' : 'Cantidad existente en costales: ' + cantidad_existente_maxima,
  }  
  return UNIDAD_MAXIMA[unidadMaxima];
}

function EnhancedTableHead(props) {
  const { classes,  order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
     
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  // product_selected: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    maxWidth:650
  },
  input:{
    width:180
  }
  ,
  inputCantidad:{
    width:120,
    height:10
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    fontSize:16,
    flex: '1',
     display: 'flex',
    flexWrap: 'wrap',
  },
}));

const DialogTallas = (props) => {

  const [new_medidas, setNew_medidas] = useState([]);
  const {setProductosTras, productosTras} = useContext(TraspasosAlmacenContext);
 

  

    

  const setProd = () =>{
    let newMedidasCopy = new_medidas;
    let cantidad_total = 0;
    

     try {
     
       let prodSelect = null;
    prodSelect = (props.almacenOrigen !== null) ? {
      _id: props.product_selected._id,
      datos_generales:  props.product_selected.datos_generales,
      medidas_producto: props.product_selected.medidas_producto,
      inventario_general: props.product_selected.inventario_general,
      unidades_de_venta: props.product_selected.unidades_de_venta,
      precios: props.product_selected.precios,
      empresa:props.product_selected.empresa,
      sucursal:props.product_selected.sucursal,
      usuario: props.product_selected.usuario
    }
    :

    {
       _id: props.product_selected._id,
      datos_generales:  props.product_selected.datos_generales,
      precios: props.product_selected.precios,
       medidas_producto: [],
      inventario_general: [{unidad_maxima:''}],
      unidades_de_venta: [],
      empresa:props.product_selected.empresa,
      sucursal:props.product_selected.sucursal,
      usuario: props.product_selected.usuario 
    }; 
    let existe = false;
    let copyProductosTras = productosTras;
    let medidasTo =[];
    //Count all new_medidas from array

    for (let newMed in newMedidasCopy){ 
        cantidad_total +=  newMedidasCopy[newMed].nuevaCantidad;
        //cantidad_total += newMedidasCopy[newMed];
      medidasTo.push(newMedidasCopy[newMed])
    } 

    if(cantidad_total > 0){
    
      if(copyProductosTras.length){//Check have data context
        copyProductosTras.forEach(element => {
          if(element.product_selected._id === props.product_selected._id){
            existe = true;
            ///VA A SUMAR EN LAS MEDIDAS LAS CANTIDADES
            element.new_medidas = medidasTo;
            element.cantidad_total = cantidad_total;
            return;
          }
        });
    
        if(!existe){
          //console.log("NO está este producto", element.product_selected._id , props.product_selected._id );
          let obj= {product_selected:prodSelect, new_medidas:medidasTo, cantidad_total:parseInt(cantidad_total), unidad_maxima: false}
          copyProductosTras.push(obj)
      
        } 
      }else{ 
          let obj= {product_selected:prodSelect, new_medidas:medidasTo, cantidad_total:parseInt(cantidad_total), unidad_maxima: false}
          copyProductosTras.push(obj)
      }
         
      setProductosTras([...copyProductosTras])  
      setNew_medidas([]);
      close();
    }  
     } catch (error) {
       //console.log('MANDH',error)
     }
    
  }

  const close= () => {
    try {
      props.setOpenTallas();
      props.setproduct_selected(undefined)
    } catch (error) {
      //console.log(error)
    }
  }
 
  useEffect(() => {
    let new_medidasCopia = [];

    productosTras.forEach(prod => {
		
		if(prod.product_selected._id ===  props.product_selected._id){
			let element = null;
        for (const med in prod.new_medidas) {
          if (Object.hasOwnProperty.call(prod.new_medidas, med)) {
            element = prod.new_medidas[med];
            new_medidasCopia.push(element)
          }
        }
      }
    })  
    setNew_medidas(new_medidasCopia);
  }, [productosTras, props.product_selected._id])
     

  return(
    <Dialog open={props.openTallas} TransitionComponent={Transition} fullWidth maxWidth={"md"}minHeight={"md"} maxHeight={"md"}>
        <Box m={1} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="secondary" onClick={() => close()} size="large">
                  <CloseIcon />
                </Button>
          </Box>
      {
        (props.almacenOrigen === null) ? 
          <div>
            <TallasColoresTraspasos 
              obtenerConsultasProducto={props.obtenerConsultasProducto}
              refetch={props.obtenerConsultasProducto.refetch}
              producto={props.product_selected}
              new_medidas={new_medidas} 
              setNew_medidas={setNew_medidas}
            />
          </div>
        :
        <div>
        

          <TableSelectMedidas producto = {props.product_selected} new_medidas={new_medidas} setNew_medidas={setNew_medidas} />
          
        </div> 
      }    
      <Box display="flex" justifyContent="flex-end" m={1} mr={5}>
        <Button  variant="contained" color="primary"style={{width:"20%"}} onClick={setProd} >
          AGREGAR 
        </Button>
      </Box>   
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [cantidadTo, setCantidadTo] = useState('');
  const [error, setError] = useState({error:false, mensaje:''});
 
  const [ openTallas, setOpenTallas] = useState(false);
  const { product_selected, setproduct_selected, tipoPieza, update } = props;
   const {
        setProductosTras,
        productosTras, 
     
    } = useContext(TraspasosAlmacenContext);



const setValueToTrans =(cantidad_total) =>{
  try {
    setError({error:false, mensaje:''})
   
    if(cantidad_total === 0 || cantidad_total === '') return;
   let element = productosTras.find(element => element.product_selected._id === product_selected._id);
   
    if(element) {
 //console.log(cantidad_total, element)
      let totalCantExistMasNuevaCantidad = cantidad_total + element.cantidad_total
      //SUMA CANTIDAD TOTAL
      
      if(props.add){
        if(product_selected.inventario_general !== undefined){
          if( !tipoPieza.piezas ){
            if(totalCantExistMasNuevaCantidad <=  product_selected.inventario_general[0].cantidad_existente_maxima){
              element.cantidad_total += cantidad_total;
            }else{
              setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }  
          }else{
            if(totalCantExistMasNuevaCantidad <=  product_selected.inventario_general[0].cantidad_existente){
              element.cantidad_total += cantidad_total;
            
            }else{
              setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }
          }
        }else{
          element.cantidad_total += cantidad_total;
        }
      }else{
        element.cantidad_total = cantidad_total;
      }  
      return;


    }else{
      //Cuando sea el caso que no hay almacen de origen cambiar los datos que van a ir vacíos
      //
     
      //console.log(props.product_selected.precios)
      let prodSelect = {
        _id: props.product_selected._id,
        datos_generales:  props.product_selected.datos_generales,
        inventario_general: props.product_selected.inventario_general,
        unidades_de_venta: props.product_selected.unidades_de_venta,
        medidas_producto: props.product_selected.medidas_producto,
      
        precios: props.product_selected.precios,
        empresa:props.product_selected.empresa,
        sucursal:props.product_selected.sucursal,
        usuario: props.product_selected.usuario
      } 
    //VERIFICA CANTIDAD MAXIMA
    if(product_selected.inventario_general !== undefined){
      if(cantidad_total <=  product_selected.inventario_general[0].cantidad_existente){
      
        let obj= {product_selected:prodSelect, new_medidas:[], cantidad_total, unidad_maxima: tipoPieza.cajas};
        setProductosTras([...productosTras, obj]);
      }
      else{
        setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente.'})
      }
    }else{
       let obj= {product_selected:prodSelect, new_medidas:[], cantidad_total, unidad_maxima: tipoPieza.cajas};
        setProductosTras([...productosTras, obj]);
    }
    }
     return;
  } catch (error) {
     //console.log(error)
  }
}

const deleteItem =() =>{
  try {
    
    let prodSet =  [] ;
    
   
    if(productosTras.length){
      prodSet = productosTras;
    }
    
    setproduct_selected(undefined)
    //console.log(prodSet.filter(item => item.product_selected._id !== product_selected._id))
    setProductosTras(prodSet.filter(item => item.product_selected._id !== product_selected._id));

  } catch (error) {

  }
}

const editItem =() =>{
  try {
    if(product_selected.datos_generales.tipo_producto !== 'OTROS') {
      setOpenTallas(true);
      //console.log(props)
    }
   
  } catch (error) {

  }
}
useEffect(() => {
  try {
    if(props.add){
      setOpenTallas(true)
    }
    setCantidadTo(props.cant)
    
  } catch (error) {
    
  }
  
}, [product_selected])   
  
          
  function onlyNumbers(value){
      const onlyNums = value.toString().replace(/[^0-9]/g, '');
      const intValue = parseInt(onlyNums);
      try {
        if(props.almacenOrigen !== null){
          if( !tipoPieza.piezas  ){
            if(intValue <= product_selected.inventario_general[0].cantidad_existente_maxima){
              setCantidadTo(intValue);
              //console.log(intValue)
              return;
            } 
          }else{
            
              if(intValue <= product_selected.inventario_general[0].cantidad_existente){
                setCantidadTo(intValue);
                return;
              }
            }
          }else{
            setCantidadTo(intValue);
            return;
          }
      } catch (error) {
        
      }
    
  }



  const TipoPiezaComponent = () =>{
     try {
      const TIPO_PIEZA = {
        'Pz' :  {unidad_maxima: null, unidad_minima: 'Pz' },
        'Caja' : {unidad_maxima: 'Caja', unidad_minima: 'Pz' },
        'Kg' : {unidad_maxima: null, unidad_minima: 'Kg' },
        'Costal' : {unidad_maxima: 'Costal', unidad_minima: 'Kg' },
        'Lt' : {unidad_maxima: null, unidad_minima: 'Lt' }
      }
      

    
      return (
        <Box flexDirection={'row'} display="flex">
          <Box flexDirection={'row'}  >
          <Checkbox checked={tipoPieza.piezas}   color="primary" onChange={() => {update(); setCantidadTo(0)}} disabled={TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima === null} />
            <Typography color="primary" style={{marginLeft:10}}>{TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_minima}</Typography> 
          </Box>
    
          
        { 
          (TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima !== null) ? 
            <Box flexDirection={'row'} >
              <Checkbox checked={tipoPieza.cajas} color="primary" onChange={() => {update(); setCantidadTo(0)}}/>
              <Typography color="primary" style={{marginLeft:10}}>{TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima} </Typography> 
            </Box>
          :
            <div/>
          
          }
      
        </Box>
      );
     } catch (error) {
       
     }
    
    
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: product_selected !== undefined,
      })}
    
    >
    <Grid container>
      {product_selected !== undefined  ? (
        <Box style={{width:'100%'}}>
          <Typography className={classes.title} color="inherit" variant="subtitle2"  >
            {product_selected.datos_generales.nombre_comercial} 
          </Typography>
        </Box>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.title}
        </Typography>
      )}

      {(product_selected !== undefined )? (
      <Box > 
        {
          (error.error) ?
          <Typography color="inherit">{error.mensaje}</Typography>
          :
          <div/>
        } 
            {
            (props.add ) ?
                (product_selected.datos_generales.tipo_producto === 'OTROS') ? 
                  <Grid container  justifyContent="space-evenly" ml={1}>
                
                      {
                        (props.almacenOrigen === null)?
                        
                        <TipoPiezaComponent />
                        :
                        <Box flexDirection={'row'} display="flex">
                          <Box flexDirection={'row'}  >
                            <Checkbox checked={tipoPieza.piezas}   color="primary" onChange={() => {update(); setCantidadTo(0)}} disabled={props.product_selected.inventario_general[0].cantidad_existente_maxima === null} />
                            <Typography color="primary" style={{marginLeft:10}}>{props.product_selected.inventario_general[0].unidad_inventario}</Typography> 
                          </Box>
                          {
                            (props.product_selected.inventario_general[0].cantidad_existente_maxima !== null ) ?
                              <Box flexDirection={'row'} >
                                <Checkbox checked={tipoPieza.cajas} color="primary" onChange={() => {update(); setCantidadTo(0)}}/>
                                <Typography color="primary" style={{marginLeft:10}}>{"" + props.product_selected.inventario_general[0].unidad_maxima} </Typography> 
                              </Box>
                            :
                              <div/>
                          }
                        </Box>
                      }
                        
                      <Box width="180px" ml={2}>
                    
                        <Typography color="primary">Cantidad</Typography>
                        <TextField
                            className={classes.inputCantidad}
                            
                            size="small"
                            name="cantidad"
                            variant="outlined"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={cantidadTo}
                            onChange={(value) => onlyNumbers(value.target.value)}
                            
                        />
                      
                        <Tooltip title="Agregar">
                            <IconButton aria-label="add" onClick={() => setValueToTrans(cantidadTo)} >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                      </Box>
                      {
                        (props.almacenOrigen) ? 
                          <Box  width="150px" >
                            {
                              (props.product_selected.inventario_general[0].cantidad_existente_maxima !== null ) ? 
                                <Typography color="primary" style={{flexWrap: "wrap"}}>
                                  {getUnidadMax(props.product_selected.inventario_general[0].cantidad_existente_maxima,props.product_selected.inventario_general[0].unidad_maxima)}
                                  </Typography>
                              :
                              <div/>
                            }
                          </Box>
                        :
                        <div/>
                      }
                    </Grid>
                   
                  :    
                  <div>
                    <DialogTallas openTallas={openTallas} setOpenTallas={setOpenTallas} setproduct_selected={setproduct_selected}  product_selected={product_selected} almacenOrigen={props.almacenOrigen} obtenerConsultasProducto={props.obtenerConsultasProducto}refetch={props.refetch}/> 
                  </div> 
                :
                <Grid width={'100%'} container>
                  { (product_selected.datos_generales.tipo_producto === 'OTROS') ? 
                    <div>
                     
                      <Typography color="primary">Cantidad</Typography>
                      <TextField
                          className={classes.inputCantidad}
                          size="small"
                          name="cantidad"
                          variant="outlined"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={cantidadTo}
                          onChange={(value) => onlyNumbers(value.target.value)}
                          
                      />
                    
                      <Tooltip title="Agregar">
                          <IconButton aria-label="add" onClick={() => setValueToTrans(cantidadTo)} >
                              <AddIcon />
                          </IconButton>
                      </Tooltip>
                    </div>
                    :
                    
                    <DialogTallas openTallas={openTallas} setOpenTallas={setOpenTallas} setproduct_selected={setproduct_selected}  product_selected={product_selected} almacenOrigen={props.almacenOrigen} obtenerConsultasProducto={props.obtenerConsultasProducto}refetch={props.refetch}/> 
                     
                     
                  }
                  <Box mt={3} >
                  { (product_selected.datos_generales.tipo_producto !== 'OTROS') ? 
                     <Tooltip title="Editar">
                        <IconButton aria-label="delete" onClick={() => editItem()} >
                            <EditIcon />
                        </IconButton>
                    </Tooltip> 
                    :
                    <div/>
                    }
                    <Tooltip title="Eliminar">
                        <IconButton aria-label="delete" onClick={() => deleteItem()} >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                  </Box>  
                </Grid>
            }
                
          
        </Box>
      ) : (
        <div/>
      )}
      </Grid>
    </Toolbar>
  );
};

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

const useStyles = makeStyles((theme) => ({
  root: {
   
    marginLeft:theme.spacing(1),
    marginRight:theme.spacing(1),


  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 600,
    maxWidth:600
   
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState(undefined);
  const [cant, setCant] = useState(0);
  //const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tipoPieza, setTipoPieza] = useState({piezas: true, cajas: false});
  const sesion = JSON.parse(localStorage.getItem('sesionCafi'));



  const update = () => {
   setTipoPieza({...tipoPieza, piezas: !tipoPieza.piezas, cajas: !tipoPieza.cajas})
 }
 
  const {
        productosTras, productosTo,   productosEmpTo
    } = useContext(TraspasosAlmacenContext);

  const obtenerConsultasProducto = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.name);
      setSelected(event.target.checked);
      return;
    }
    setSelected([]);
  };
  const data = (!props.add) ?  productosTras  : (!props.almacenOrigen) ? productosEmpTo : productosTo  ; 

  const handleClick = (event, elemento, cant) => {
   
     if((elemento.datos_generales.tipo_producto === 'OTROS')){
          
        setCant(props.add ? 0 : cant)
      }

    
    if(selected!== undefined){
      const selectedIndex = selected._id === elemento._id;
     
      // let newSelected = [];
      if(selectedIndex){
          setSelected(undefined);
      }else{
          setSelected(elemento);
      } 
    }else{
      //console.log(elemento)
      setSelected(elemento);
    }
   
    
  };
    
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => {
    //return selected.indexOf(name) !== -1;
    
    if(selected!== undefined){
      const selectedIndex = selected._id === id;
   
      // let newSelected = [];
      if(!selectedIndex){
        return false;
      }else{
        return true;
      } 
    }else{
      return false;
    }
    
  } 

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
       
        <EnhancedTableToolbar product_selected={selected} setproduct_selected={setSelected} title={props.title} add={props.add} almacenOrigen={props.almacenOrigen} productosTras ={productosTras} tipoPieza={tipoPieza} update={update} cant={cant} obtenerConsultasProducto={(obtenerConsultasProducto.data) ? obtenerConsultasProducto.data.obtenerConsultasProducto :[]}refetch={( obtenerConsultasProducto.refetch ) ? obtenerConsultasProducto.refetch : null}  />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              product_selected={selected}
              order={order}
              orderBy={orderBy}
              handleSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected((props.add) ? row._id: row.product_selected._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                 
                  if(props.add){
                    
                    if(props.almacenOrigen) {
                 
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                        
                      >
                        <TableCell component="right" id={labelId} scope="row">
                          {(row.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.datos_generales.codigo_barras}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.datos_generales.nombre_comercial}
                        </TableCell>
                        
                        <TableCell align="right"> {row.datos_generales.tipo_producto}</TableCell>
                        <TableCell align="right"> {row.inventario_general[0].cantidad_existente }  {row.inventario_general[0].unidad_inventario} </TableCell>
                        
                        
                      
                      </TableRow>
                    );
                    }else{
                      return(
                        <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                        
                      >
                        <TableCell component="right" id={labelId} scope="row">
                          {(row.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.datos_generales.codigo_barras}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.datos_generales.nombre_comercial}
                        </TableCell>
                        <TableCell align="right"> {row.datos_generales.tipo_producto}</TableCell>
                        <TableCell align="right"> N/A</TableCell>
                      </TableRow>
                      );
                    }
                  }else{
                    
                    return(
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.product_selected, row.cantidad_total)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      
                    >
                      <TableCell component="right" id={labelId} scope="row">
                        {(row.product_selected.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.product_selected.datos_generales.codigo_barras}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.product_selected.datos_generales.nombre_comercial}
                      </TableCell>
                      <TableCell align="right"> {row.product_selected.datos_generales.tipo_producto}</TableCell>
                      <TableCell align="right"> {row.cantidad_total}</TableCell> 
                     
                    </TableRow>
                    )
                  }
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
       
      </Paper>
      
    </div>
  );
}