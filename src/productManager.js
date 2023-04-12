const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '..', 'productos.json');
    this.products = [];
    this.loadProducts();
  }
  // método para traer datos del archivo de productos
  async loadProducts() {
    try {
      const dataJson = await fs.promises.readFile(this.path, 'utf-8');
      if (dataJson) {
        this.products = JSON.parse(dataJson);
        // console.log(this.products);
        return this.products;
      } else {
        return [];
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        console.log('Error al obtener los productos', error);
        // console.log('Error al obtener los productos');
      }
    }
  }

  // método para guardar datos en el archivo de productos
  async saveProducts() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
      console.log('Los datos fueron guardados exitosamente');
    } catch (error) {
      console.log(error);
    }
  }

  // método para guardar datos de productos eliminados
  async removeProduct() {
    try {
      await fs.promises.writeFile(
        './removedProducts.json',
        JSON.stringify(this.removed, null, 2)
      );
      // console.log('Los datos fueron guardados exitosamente');
    } catch (error) {
      console.log(error);
    }
  }

  // método para agregar producto
  async addProduct(title, description, price, thumbnail, code, stock) {
    const existsProduct = this.products.some(
      (product) => product.code === code
    );
    // validación de campo code
    if (existsProduct) {
      console.log(`El producto con código ${code} ya existe`);
      return;
    }
    // id autoincrementable
    const id = this.products.length + 1;

    const product = { id, title, description, price, thumbnail, code, stock };

    // validación de campos obligatorios
    const missingAttributes = Object.keys(product).filter(
      (key) => !product[key]
    );
    if (missingAttributes.length > 0) {
      console.log(
        `Error: faltan los siguientes atributos para crear el producto: ${missingAttributes.join(
          ', '
        )}`
      );
      return;
    }
    // agrego producto al array y lo guardo en un archivo json
    this.products.push(product);
    console.log(
      `El producto ${product.title} con id ${product.id} ha sido agregado con éxito`
    );
    await this.saveProducts();
  }

  // método que retorna los productos creados hasta el momento
  async getProducts() {
    await this.loadProducts();
    console.log(this.products);
  }
  // método para buscar productos por id
  async getProductById(productId) {
    await this.loadProducts();
    // Validación de ingreso de id
    if (productId === undefined) {
      console.error('Debe especificar un id de producto');
      return;
    }
    // Validación de existencia de id
    const product = this.products.find((p) => p.id === productId);
    !product ? console.error('Not found') : console.log(product);
  }
  // método para modificar un producto
  async uptadeProduct(productId, newProductData) {
    // Validación de ingreso de id
    if (productId === undefined) {
      console.log('Debe especificar el id del producto a modificar');
      return;
    }
    // Obtengo el primer producto que coincida con el id buscado
    const findProd = this.products.find((p) => p.id === productId);
    // Validación de existencia de id
    if (!findProd) {
      console.error('El producto solicitado no fue encontrado');
      return;
    }
    // Modificación de producto
    const modifiedProduct = { ...this.products[findProd], ...newProductData };
    // console.log(newProductData);
    this.products[findProd] = modifiedProduct;
    // Guarda el array modificado en el json
    await this.saveProducts();
    // console.log(productId);
    console.log(
      `El producto con id: ${productId} ha sido actualizado correctamente`
    );

    /* AL MODIFICAR EL ARRAY LE AGREGA UN ] AL FINAL DEL MISMO, LO QUE GENERA UN ERROR EN LA POSTERIOR LECTURA DEL MISMO */
  }

  // método para eliminar un producto
  async deleteProduct(productId) {
    this.loadProducts();
    // Validación de ingreso de id
    if (productId === undefined) {
      console.log('Debe especificar el id del producto a eliminar');
      return;
    }
    // Obtengo el primer producto que coincida con el id buscado
    const findProd = this.products.find((p) => p.id === productId);
    // console.log(findProd);
    // Validación de existencia de id
    if (!findProd) {
      console.error('El producto solicitado no fue encontrado');
      return;
    }
    // Elimina el producto del array
    // this.products.splice(findProd, 1);
    const productoEliminado = this.products.splice(findProd, 1)[0];
    // Guarda el array modificado en el json
    await this.saveProducts();
    // await this.loadProducts();
    console.log(
      `El producto ${productoEliminado.id} - ${productoEliminado.title} ha sido eliminado`
    );

    /* EN LUGAR DE ELIMINAR EL PRODUCTO LO SACA FUERA DEL ARRAY PERO NO LO ELIMINA */
  }
}

module.exports = ProductManager;

// Testing

const pruebas = new ProductManager();

// pruebas.getProducts();
/* 
// pruebas.addProduct('Computadora', 'Lenovo', 20, 'Vacio', 'abc123', 25);

// 

pruebas.addProduct('Computadora', 'Lenovo', 20, 'Vacio', 'abc123', 25);

// pruebas.getProductById();
// pruebas.getProductById(2);
// pruebas.getProductById(1);

// pruebas.addProduct('', 'Lenovo', 20, 'Vacio', 'abc12346', 25);

// pruebas.addProduct('', 'Lenovo', 20, '', 'abc12346', 25);

pruebas.addProduct('Computadora', 'Lenovo', 20, 'Vacio', 'abc1234', 25);

// pruebas.addProduct('Computadora', 'Lenovo', 20, '', 'abc12345', 25);

pruebas.getProducts();

// pruebas.getProductById(2);
// pruebas.getProductById(3);

// pruebas.uptadeProduct(2, { description: 'Asus', price: 32 });

// pruebas.deleteProduct(2);

// pruebas.getProducts();
 */
