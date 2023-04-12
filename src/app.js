const express = require('express');
const app = express();
// Importo la clase ProductManager
const ProductManager = require('./productManager');
// Creo instancia de la clase ProductManager
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Defino la ruta para obtener los productos
app.get('/products', async (req, res) => {
  try {
    // Obtengo el valor del query param 'limit' y lo converto a un número entero
    const limit = parseInt(req.query.limit);
    // Cargo los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // validación del query param 'limit'
    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Defino la ruta para obtener los productos por id
app.get('/products/:pid', async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const pid = parseInt(req.params.pid);

    // Cargo los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // Busca el producto solicitado por su 'product id'
    const product = await products.find((p) => p.id === pid);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
