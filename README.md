# Documentación del Proyecto de Tema Shopify - Dawn

Bienvenido al repositorio del tema Shopify Dawn. Este archivo README proporciona una guía detallada sobre cómo funciona el tema, incluyendo la documentación del schema para la página de lista de productos, el desarrollo de la funcionalidad AJAX para añadir productos al carrito, y cómo se maneja la restricción de añadir más de un producto al carrito.

## Contenidos

1. [Documentación del Schema](#documentación-del-schema)
2. [Desarrollo AJAX - Añadir al Carrito](#desarrollo-ajax---añadir-al-carrito)
3. [Restricción de Productos en el Carrito](#restricción-de-productos-en-el-carrito)
4. [Reemplazo de Productos en el Carrito](#reemplazo-de-productos-en-el-carrito)

---

## Documentación del Schema

### Descripción

El tema utiliza un esquema personalizado para construir la página de la lista de productos. Este esquema se define en el archivo `schema.json` y permite personalizar la visualización de los productos en una sección.

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
```


## Desarrollo AJAX - Añadir al Carrito

### Descripción

Esta sección explica cómo se ha implementado la funcionalidad AJAX para añadir productos al carrito en el tema Dawn. Utiliza la funcionalidad AJAX proporcionada por el tema para permitir a los usuarios añadir productos al carrito sin recargar la página.

### Código

(Inserta aquí el código relevante para la funcionalidad AJAX de añadir productos al carrito.)

---

## Restricción de Productos en el Carrito

### Descripción

El método `validateQuantity` es responsable de validar la cantidad de productos que un usuario puede agregar a su carrito. Está diseñado para permitir solo un producto por cada tipo de servicio en el carrito, asegurando que el carrito contenga a lo sumo un producto de cada servicio, limitando la cantidad máxima permitida a 1 por servicio.

### Funcionamiento

1. **Obtener Valor del Input**:
   - El método obtiene el valor ingresado por el usuario y lo convierte a un número entero.

2. **Establecer Cantidad Máxima**:
   - Se define una cantidad máxima (`maxQuantity`) que se limita a 1. Esto significa que solo se permite agregar un producto de este tipo al carrito.

3. **Validar Cantidad**:
   - Si el valor ingresado supera la cantidad máxima permitida (1), se establece un mensaje de error que indica que solo se puede agregar un producto de ese servicio al carrito.

4. **Mostrar Mensaje de Error**:
   - Si hay un mensaje de error, se muestra al usuario utilizando el método `setValidity`. Este método establece el mensaje de error y detiene la actualización del carrito.

5. **Actualizar el Carrito**:
   - Si no hay errores, el método limpia cualquier mensaje de error personalizado y procede a actualizar la cantidad del producto en el carrito. Esto se realiza mediante el método `updateQuantity`.

### Código

```javascript
validateQuantity(event) {
  const inputValue = parseInt(event.target.value);
  const index = event.target.dataset.index;
  const maxQuantity = 1; // Limita la cantidad máxima a 1 por cada servicio
  let message = '';

  // Verifica si el valor es mayor a 1 (solo se permite 1 producto por servicio)
  if (inputValue > maxQuantity) {
    message = `Solo puedes agregar un producto de este servicio al carrito.`;
  }

  if (message) {
    // Si hay un mensaje de error, lo muestra al usuario
    this.setValidity(event, index, message);
  } else {
    // Si todo está correcto, actualiza el carrito
    event.target.setCustomValidity('');
    event.target.reportValidity();
    this.updateQuantity(
      index,
      inputValue,
      document.activeElement.getAttribute('name'),
      event.target.dataset.quantityVariantId
    );
  }
}
```
