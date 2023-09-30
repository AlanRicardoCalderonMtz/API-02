/* 
API para productos
Tabla - Productos - Colección

id
nombre producto
categoria
precio
existencia
*/

//Crear el servidor
const { json } = require('express');
const express = require('express');
const app = express();
// Que tome el puerto establecido a la nube (render )
const puerto = process.env.PORT || 3000;

// Midleware - Intermediario
app.use(express.json())

//Arreglo de objeto de Productos
let productos = [
    { id: 1, nombre_producto: "Cocina", categoria: "Elementos para cocinar", precio: "$200", existencia: "Si" },
    { id: 2, nombre_producto: "Lavadora", categoria: "Electrodomésticos", precio: "$500", existencia: "No" },
    { id: 3, nombre_producto: "Sartén antiadherente", categoria: "Elementos para cocinar", precio: "$30", existencia: "Si" },
    { id: 4, nombre_producto: "Smartphone", categoria: "Tecnología", precio: "$800", existencia: "Si" },
    { id: 5, nombre_producto: "Mesa de comedor", categoria: "Muebles", precio: "$350", existencia: "Si" },
    { id: 6, nombre_producto: "Laptop", categoria: "Tecnología", precio: "$1000", existencia: "No" },
    { id: 7, nombre_producto: "Camiseta", categoria: "Ropa", precio: "$20", existencia: "Si" },
    { id: 8, nombre_producto: "Cama queen size", categoria: "Muebles", precio: "$600", existencia: "Si" },
    { id: 9, nombre_producto: "Monitor de 27 pulgadas", categoria: "Tecnología", precio: "$300", existencia: "Si" },
    { id: 10, nombre_producto: "Licuadora", categoria: "Electrodomésticos", precio: "$50", existencia: "No" }
]

//GET - Listar todos los productos
app.get('/socios/v1/productos', (req, res) => {
    //res.send('Aquí el listado de todos los productos {JSON}');

    //1° Verificar si existen productos
    if (productos.length > 0) {
        //Existen productos 
        res.status(200).json({
            estado: 1,
            mensaje: "Existen productos",
            //var : contenido
            products: productos
        })
    } else {
        //No existen productos
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontraron productos",
            products: null
        })
    }
});

//GET - Monstrar productos por su ID
app.get('/socios/v1/productos/:id', (req, res) => {
    //El id viene en el parametros de la solicitud
    //res.send('Aquí los datos del producto por su id {JSON}');

    // Obtener el ID del producto desde los parámetros de la URL
    const productoID = req.params.id;

    // Buscar el producto por su ID en tu arreglo 
    const productoEncontrado = productos.find(producto => producto.id == productoID);
    if (productoEncontrado) {
        // Si se encontró el producto, devolverla en formato JSON
        res.status(200).json({
            estado: 1,
            mensaje: "Producto encontrado",
            product: productoEncontrado
        });
    } else {
        // Si no se encontró el producto, devolver un mensaje de error en JSON
        res.status(404).json({
            estado: 0,
            mensaje: "Producto no encontrado",
            product: null
        });
    }
});

// POST - Agregar un nuevo producto.
app.post('/socios/v1/productos', (req, res) => {
    //El producto viene en el body de la solicitud
    //res.send('Producto agregado correctamente {JSON}');

    const { nombre_producto, categoria, precio, existencia } = req.body
    const id = Math.round(Math.random() * 1000);
    if (nombre_producto == undefined || categoria == undefined || precio == undefined || existencia == undefined) {
        //Hay un error en la solicitud por parte del programador
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parametros en la solicitud",
        })
    } else {
        const producto = { id: id, nombre_producto: nombre_producto, categoria: categoria, precio: precio, existencia: existencia }
        const longitud_inicial = productos.length;
        productos.push(producto)
        if (productos.length > longitud_inicial) {
            //All bien por parte del cliente y servidor
            // 200 (todo ok) y 201(creado) 
            res.status(201).json({
                estado: 1,
                mensaje: "Producto creado",
                producto: producto
            })
        } else {
            //Error del servidor -> 'creador de la API o de la BD, Quien configura el servidor'
            // 500 -> error interno
            res.status(500).json({
                estado: 0,
                mensaje: "Ocurrio un error desconocido"
            })
        }
    }
});

//PUT - Actualizar un producto por su ID.
app.put('/socios/v1/productos/:id', (req, res) => {
    //El id viene en los parametros de la solicitud
    //Los datos del producto vienen body de la solicitud
    //res.send('El producto actualizado correctamente por su id {JSON}');

    const { id } = req.params;
    const { nombre_producto, categoria, precio, existencia } = req.body;
    //verificar que nombre y descripcion vengan en el body
    if (nombre_producto == undefined || categoria == undefined || precio == undefined || existencia == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parametros en la solicitud"
        })
    } else {
        const posActualizar = productos.findIndex(producto => producto.id == id)
        if (posActualizar != -1) {
            //Si encontro el producto con el id buscado
            //Actualizar el producto
            productos[posActualizar].nombre_producto = nombre_producto;
            productos[posActualizar].categoria = categoria;
            productos[posActualizar].precio = precio;
            productos[posActualizar].existencia = existencia;
            res.status(200).json({
                estado: 1,
                mensaje: "Producto actualizado correctamente"
            });
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: "Producto no encontrado"
            })
        }
    }
});

// DELETE - Eliminar un producto por su ID.
app.delete('/socios/v1/productos/:id', (req, res) => {
    //El id viene en los parametros de la solicitud
    //res.send('El producto se eliminó correctamente por su id {JSON}');

    const { id } = req.params;
    // Buscar la posición del producto en el array 'productos' por su ID
    const posEliminar = productos.findIndex(producto => producto.id == id);

    if (posEliminar != -1) {
        // Si se encontró el producto con el ID buscado, eliminarla del array
        productos.splice(posEliminar, 1);

        res.status(201).json({
            estado: 1,
            mensaje: "Producto eliminado correctamente"
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Producto no encontrado"
        });
    }
});

//Poner en marcha nuestra API
app.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto: ', puerto);
});