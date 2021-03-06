import React ,{useState} from 'react'
import ProductosForm from "./ProductosForm"
import PageHeader from "../../components/PageHeader";
//import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../components/useTable";
import * as productoService from "../../services/productoService";
import Controls from "../../components/controls/Controls"
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../components/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles(theme =>({

    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },  
    searchInput: {
        width: '75%'
    },
    newButton: {
        position:'absolute',
        right:'10px'
    }
    
}))

    //cabecera de la tabla useTable

    const headCells = [

        {id: 'descripcion', label: 'Descripción'},
        {id: 'marca', label: 'Marca'},
        {id: 'cantidad', label: 'Cantidad'},
        {id: 'categoria', label: 'Categoría', disableSorting:true},
        {id: 'color', label: 'Color'},
        {id: 'talla', label: 'Talla'},
        {id: 'calidad', label: 'Calidad'},
        {id: 'precio', label: 'Precio'},
      //  {id: 'extensiones', label: 'Extensiones'},
      // {id: 'estado', label: 'Estado'},
        {id: 'fechaAlta', label: 'Fecha Ingreso'},
        { id: 'actions', label: 'Acciones', disableSorting: true }


    ]


//aqui se mostrará la lista de productos
export default function Productos() {
   const classes = useStyles();
   const [recordForEdit, setRecordForEdit] = useState(null)
   const [records, setRecords] = useState(productoService.getAllProductos())
   const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
   const [openPopup, setOpenPopup] = useState(false);

   const {
       TblContainer,
       TblHead,
       TblPagination,
       recordsAfterPagingAndSorting
   } = useTable(records, headCells, filterFn);

   //herramienta de búsqueda 
   const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(x => x.descripcion.toLowerCase().includes(target.value))
        }
    })
}



const addOrEdit = (producto, resetForm) => {
        if(producto.id == 0)
        productoService.insertProductos(producto)
        else
        productoService.updateProducto(producto)

        resetForm()
//    
   
   setRecordForEdit(null)
    setOpenPopup(false)
    setRecords(productoService.getAllProductos())
}

//funcion boton editar registro 
const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
}
  
    // al importar el PageHeader manda un error que se soluciona pegando las etiquetas : <> </> (React Fragment )
    return(
        <> 
        <PageHeader
      title="Nuevo Producto"
      subTitle="Formulario de Alta"
      icon={<AddBoxIcon fontSize="large"/>}
      />
      <Paper className={classes.pageContent}>

          <Toolbar>
        <Controls.Input label="Buscar Producto"
        className={classes.searchInput}
            InputProps={ {
                startAdornment: (<InputAdornment position="start">
                <Search/>
                </InputAdornment>)
            }}
                onChange={handleSearch}
        />
        <Controls.Button
        text="Nuevo"
        variant="outlined"
        startIcon={<AddIcon/>}
        className ={classes.newButton}
        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
        
        />


          </Toolbar>
        <TblContainer>
            <TblHead />
            <TableBody>
                {
                    recordsAfterPagingAndSorting().map(item =>
                        (<TableRow key={item.id}>
                            <TableCell>{item.descripcion}</TableCell>
                            <TableCell>{item.marca}</TableCell>
                            <TableCell align="center">{item.cantidad}</TableCell>
                            <TableCell>{item.categoria}</TableCell>
                            <TableCell>{item.color}</TableCell>
                            <TableCell>{item.talla}</TableCell>
                            <TableCell>{item.calidad}</TableCell>
                            <TableCell>{item.precio}</TableCell>
                          
                            <TableCell>{item.fechaAlta}</TableCell>
                            <TableCell>
                                <Controls.ActionButton
                                color="primary"
                                onClick={()=>{openInPopup(item)}}>
                                    <EditOutlinedIcon fontSize="small"
                                    />
                                </Controls.ActionButton>
                                <Controls.ActionButton
                                color="secondary">
                                    <CloseIcon fontSize="small"/>
                                </Controls.ActionButton>
                                
                                </TableCell>


                        </TableRow>)
                        
                        )




                }

            </TableBody>

        </TblContainer>
        <TblPagination />
        </Paper>
        <Popup
        title = "Formulario de Productos"
        openPopup = {openPopup}
        setOpenPopup={setOpenPopup}
        >

                    <ProductosForm 
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}/>

        </Popup>

        </>
    )

}