import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid,Box, TextField } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from '@material-ui/core';
import {Toolbar, Typography, Paper, IconButton, Tooltip, Dialog, Checkbox ,Slide, Button} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { TraspasosAlmacenContext } from "../../context/Almacenes/traspasosAlmacen";
import TableSelectMedidas from './TableSelectMedidas';
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
  
];

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
  // productSelected: PropTypes.object.isRequired,
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
  },
  input:{
    width:180
  }
  ,
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
    fontSize:18,
    flex: '1',
  },
}));

const DialogTallas = (props) => {
 const [medida, setMedida] = useState({piezas: true, cajas: false});
 const close= () => {
   try {
     props.setOpenTallas();
     props.setProductSelected(undefined)
   } catch (error) {
     
   }
 }
 const update = () => {
   setMedida({...medida, piezas: !medida.piezas, cajas: !medida.cajas})
 }
  return(
    <Dialog open={props.openTallas} TransitionComponent={Transition} fullWidth maxWidth="md"minHeight="md" maxHeight="md">
      
      <Box m={1} display="flex" justifyContent="flex-end">
          
       
            <Button variant="contained" color="secondary" onClick={() => close()} size="large">
              <CloseIcon />
            </Button>
			
      </Box>
     
      <Grid container  justifyContent="space-evenly" style={{marginLeft:'2%'}}>
        <Checkbox checked={medida.piezas}  color="primary" onChange={() => update()} disabled={!props.productSelected.inventario_general.cantidad_existente_maxima} />
        <Typography color="primary" style={{marginTop:10}}>Piezas</Typography> 
        {
          (props.productSelected.inventario_general.cantidad_existente_maxima) ?
            <div style={{marginLeft:'2%'}}>
              <Checkbox checked={true} color="primary" />
              <Typography color="primary" style={{marginTop:10}}>{props.productSelected.inventario_general.unidad_maxima} </Typography> 
            </div>
          :
            <div/>
        }
      </Grid> 
      
     
        <TableSelectMedidas producto = {props.productSelected}/>
      <Box display="flex" justifyContent="flex-end" m={1} mr={5}>
        <Button  variant="contained" color="primary"style={{width:"20%"}} >
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
  const [ openTallas, setOpenTallas] = useState(false);
  const { productSelected, setProductSelected } = props;
   const {
        setProductosTras,
        productosTras, 
        setError
    } = useContext(TraspasosAlmacenContext);



const setValueToTrans =() =>{
  try {

    if(productosTras.find(element => element._id === productSelected._id)) { 
      //sumar la cantidad nueva y modificar, verificar que la cantidad del producto no sea mayor
      setError({ error: true, message: 'Este producto no se pu' });  
      return;
    }
    setProductosTras([...productosTras, productSelected]);
  
     return;
  } catch (error) {

  }
}

const deleteItem =() =>{
  try {
    
    let prodSet =  [] ;
    
   
    if(productosTras.length){
      prodSet = productosTras;
    }
    
    setProductSelected(undefined)
    setProductosTras(prodSet.filter(item => item._id !== productSelected._id));
  } catch (error) {

  }
}

useEffect(() => {
  setOpenTallas(true)  
}, [productSelected])   
  
          
function onlyNumbers(value){
    const onlyNums = value.toString().replace(/[^0-9]/g, '');
    const intValue = parseInt(onlyNums);
    setCantidadTo(intValue);
}

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: productSelected !== undefined,
      })}
    
    >
      {productSelected !== undefined  ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {productSelected.datos_generales.nombre_comercial} 
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.title}
        </Typography>
      )}

      {(productSelected !== undefined )? (
        <Grid>  
            {(props.add ) ?
                (productSelected.datos_generales.tipo_producto === 'OTROS') ? 
                  <Box width="280px">
                    <Typography color="primary">Cantidad</Typography>
                    <TextField
                        className={classes.input}
                        
                        size="small"
                        name="cantidad"
                        variant="outlined"
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        value={cantidadTo}
                        onChange={(value) => onlyNumbers(value.target.value)}
                        
                    />
                  
                    <Tooltip title="Agregar">
                        <IconButton aria-label="add" onClick={() => setValueToTrans()} >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                  </Box>
                  :
                     
                   
                  <DialogTallas openTallas={openTallas} setOpenTallas={setOpenTallas} setProductSelected={setProductSelected}  productSelected={productSelected} /> 
                :
                <Box width="100%">
                    <Tooltip title="Eliminar">
                        <IconButton aria-label="delete" onClick={() => deleteItem()} >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
                
          
        </Grid>
      ) : (
        <div/>
      )}
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
    minWidth: 650,
   
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const {
        productosTras, productosTo
    } = useContext(TraspasosAlmacenContext);
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
  const data = (!props.add) ? productosTras : productosTo  ; 

  const handleClick = (event, elemento) => {
    if(selected!== undefined){
      const selectedIndex = selected._id === elemento._id;
     
      // let newSelected = [];
      if(selectedIndex){
          setSelected(undefined);
      }else{
          setSelected(elemento);
       
         
      } 
    }else{
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
        <EnhancedTableToolbar productSelected={selected} setProductSelected={setSelected} title={props.title} add={props.add} productosTras ={productosTras}  />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              productSelected={selected}
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
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

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
                      
                     
                    </TableRow>
                  );
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