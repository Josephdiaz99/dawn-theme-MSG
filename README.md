# Proyecto de Tema Shopify - Dawn

¡Bienvenido al repositorio del tema Shopify Dawn! Este archivo README proporciona instrucciones claras sobre cómo configurar y personalizar el tema, así como detalles sobre el desarrollo específico que se ha realizado.

---

## Contenidos

1. [Documentación del Schema](#documentación-del-schema)
2. [Desarrollo AJAX - Añadir al Carrito](#desarrollo-ajax---añadir-al-carrito)
3. [Restricción de Productos en el Carrito](#restricción-de-productos-en-el-carrito)
4. [Reemplazo de Productos en el Carrito](#reemplazo-de-productos-en-el-carrito)

---

## Documentación del Schema

### Descripción

El tema utiliza un esquema personalizado para construir la página de la lista de productos. Este esquema se basa en el archivo `schema.json` que define los parámetros y campos necesarios para la visualización de productos.

### Ejemplo de Schema

```json
{
  "name": "Product List",
  "settings": [
    {
      "type": "text",
      "id": "section_title",
      "label": "Section Title",
      "default": "Our Products"
    },
    {
      "type": "range",
      "id": "products_per_row",
      "label": "Products per Row",
      "default": 3,
      "min": 1,
      "max": 6
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product Block",
      "settings": []
    }
  ]
}

Cómo Utilizar
Importar el archivo schema.json en tu tienda Shopify.
Configura los parámetros en la sección de administración de Shopify según tus necesidades.

Descripción
La funcionalidad AJAX para añadir productos al carrito permite una experiencia de usuario fluida sin recargar la página.

function addProductToCart(variantId, quantity) {
  console.log('Obteniendo carrito actual...');
  
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      console.log('Carrito actual:', cart);

      // Elimina todos los productos existentes
      const deletePromises = cart.items.map(item => {
        console.log('Preparando eliminación del producto:', item.key);
        return fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: item.key, quantity: 0 })
        });
      });

      return Promise.all(deletePromises);
    })
    .then(() => {
      console.log('Todos los productos eliminados. Agregando nuevo producto...');
      
      // Agrega el nuevo producto
      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: quantity })
      });
    })
    .then(response => response.json())
    .then(cart => {
      console.log('Nuevo producto añadido al carrito:', cart);
      updateCartView();
    })
    .catch(error => {
      console.error('Error al actualizar el carrito:', error);
    });
}

function updateCartView() {
  console.log('Actualizando vista del carrito...');
  
  fetch('/cart')
    .then(response => response.text())
    .then(html => {
      console.log('Vista del carrito actualizada.');
      document.querySelector('#cart-container').innerHTML = html;
    });
}
