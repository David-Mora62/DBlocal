const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const FILE_NAME = 'productos.json';

app.use(bodyParser.json());

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  const productos = JSON.parse(fs.readFileSync(FILE_NAME)).productos;
  res.json(productos);
});

// Ruta para obtener un producto por su ID
app.get('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(FILE_NAME)).productos;
  const producto = productos.find(p => p.id === id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para crear un nuevo producto
app.post('/productos', (req, res) => {
  const productos = JSON.parse(fs.readFileSync(FILE_NAME)).productos;
  const nuevoProducto = req.body;
  nuevoProducto.id = productos.length + 1;
  productos.push(nuevoProducto);
  fs.writeFileSync(FILE_NAME, JSON.stringify({ productos }));
  res.status(201).json(nuevoProducto);
});

// Ruta para actualizar un producto existente
app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(FILE_NAME)).productos;
  const productoIndex = productos.findIndex(p => p.id === id);
  if (productoIndex === -1) {
    res.status(404).send('Producto no encontrado');
  } else {
    const nuevoProducto = req.body;
    nuevoProducto.id = id;
    productos[productoIndex] = nuevoProducto;
    fs.writeFileSync(FILE_NAME, JSON.stringify({ productos }));
    res.json(nuevoProducto);
  }
});

// Ruta para eliminar un producto por su ID
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(FILE_NAME)).productos;
  const productoIndex = productos.findIndex(p => p.id === id);
  if (productoIndex === -1) {
    res.status(404).send('Producto no encontrado');
  } else {
    productos.splice(productoIndex, 1);
    fs.writeFileSync(FILE_NAME, JSON.stringify({ productos }));
    res.send(`Producto con ID ${id} eliminado`);
  }
});


const host = "localhost"
const port = 3000;
app.listen(port, host, () => {
  console.log(`el link es http://${host}:${port}/productos`)
})