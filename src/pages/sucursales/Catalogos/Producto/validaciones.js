export function validaciones(datos1, datos2, datos3, datos7) {
    /* si no hay datos1 y datos 2 */
    if (
        !datos1.clave_alterna ||
        !datos1.tipo_producto ||
        !datos1.nombre_generico ||
        !datos1.nombre_comercial
    ) {
        if (!datos2.precio_de_compra.precio_con_impuesto ||
            !datos2.precio_de_compra.precio_sin_impuesto ||
            !datos2.unidad_de_compra.cantidad) {
            return { error: true, message: 'Campo obligatorio', vista1: true, vista2: true };
        }
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else if (
        /* si solo hay datos1 */
        !datos2.precio_de_compra.precio_con_impuesto || !datos2.precio_de_compra.precio_sin_impuesto || !datos2.unidad_de_compra.cantidad
    ) {
        return { error: true, message: 'Campo obligatorio', vista2: true };
    } else if (
        /* si solo hay datos2 */
        !datos1.clave_alterna || !datos1.tipo_producto || !datos1.nombre_generico || !datos1.nombre_comercial
    ) {
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else if(
        /* si hay cantidad almacen pero no hay almacen seleccionado */
        datos3.cantidad > 0 && !datos3.almacen
    ) {
        return { error: true, message: 'Campo obligatorio', vista3: true };
    } else if(
        /* si no hay colo */
        datos7.length > 0 && !datos3.almacen
    ){
        return { error: true, message: 'Campo obligatorio', vista7: true };
    } else {
        /* si hay todos los datos */
        return { error: false, message: '' };
    }
}