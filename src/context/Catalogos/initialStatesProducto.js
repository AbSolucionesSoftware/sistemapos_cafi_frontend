export const initial_state_datos_generales = {
    receta_farmacia: false,
};
export const initial_state_precios = {
    monedero: false,
    monedero_electronico: 0,
    iva_activo: true,
    ieps_activo: false,
    ieps: 0,
    iva: 16,
    granel: false,
    inventario: {
        inventario_minimo: 0,
        inventario_maximo: 0,
        unidad_de_inventario: 'Pz',
    },
    precio_de_compra: {
        precio_con_impuesto: 0,
        precio_sin_impuesto: 0,
        iva: 0,
        ieps: 0
    },
    unidad_de_compra: {
        unidad: "Pz",
        cantidad: 1,
        precio_unitario_sin_impuesto: 0,
        precio_unitario_con_impuesto: 0,

    },
};

export const initial_state_unidadVentaXDefecto = {
    codigo_barras: '',
    unidad: 'Pz',
    cantidad: 1,
    precio: 0,
    unidad_principal: true,
    default: true
}

export const initial_state_preciosP = [
    {
        numero_precio: 1,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    },
    {
        numero_precio: 2,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    },
    {
        numero_precio: 3,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    },
    {
        numero_precio: 4,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    },
    {
        numero_precio: 5,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    },
    {
        numero_precio: 6,
        utilidad: 0,
        precio_neto: 0,
        unidad_mayoreo: 0,
        precio_venta: 0
    }
]

export const initial_state_unidadesVenta = [];

export const initial_state_almacen_inicial = {
    id_almacen: "",
    almacen: "",
    cantidad: 0,
    fecha_de_expiracion: "",
}
export const initial_state_centro_de_costos = {}

export const initial_state_preciosPlazos = {
    precio_piezas: [],
    precio_cajas: [],
    precio_costales: [],
};

export const initial_state_subcategorias = [];
export const initial_state_imagenes = [];
export const initial_state_imagenes_eliminadas = [];
export const initial_state_onPreview = { index: '', image: '' };
export const initial_state_validacion = { error: false, message: '' };
export const initial_state_subcostos = [];
export const initial_state_selectedDate = null;
export const initial_state_presentaciones = [{_id: "234gh45h32j423g4h23234", codigo_barras: "34534435454", nombre_comercial: "Tenis NIKE", medida: "27.5", color: "NEGRO", precio: "$350.00", cantidad: 1}];