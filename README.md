# Documentación del Proyecto de Tema Shopify - Dawn Josephmar Díaz

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

Esta sección cubre cómo se utiliza la funcionalidad AJAX de Shopify para añadir productos al carrito en el tema Dawn. Shopify ofrece herramientas integradas para manejar operaciones del carrito de manera asíncrona.

### Implementación

- **Método de Solicitud**: Utiliza solicitudes `fetch` para comunicar con la API de Shopify y añadir productos al carrito sin recargar la página.
- **Actualización del Carrito**: Actualiza dinámicamente el contenido del carrito según la respuesta del servidor.
- **Interacción del Usuario**: Actualiza la interfaz con mensajes de éxito o error y refleja los cambios en el carrito en la página.
- **Optimización**: Mantiene una experiencia de usuario fluida y sin interrupciones.

Esta funcionalidad se basa en las capacidades AJAX proporcionadas por Shopify, integradas en el tema Dawn.


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

## Reemplazo de Productos en el Carrito

### Descripción

El método `onSubmitHandler` maneja el proceso de reemplazo de productos en el carrito. Permite vaciar el carrito actual y añadir un nuevo producto de forma asíncrona utilizando AJAX, proporcionando una experiencia de usuario fluida sin necesidad de recargar la página.

### Funcionamiento

1. **Prevención del Envío**:
   - Utiliza `evt.preventDefault()` para evitar que el formulario se envíe de la manera tradicional si el botón de envío está deshabilitado.

2. **Validación del Estado del Botón**:
   - Verifica si el botón de envío (`submitButton`) está deshabilitado (`aria-disabled`). Si es así, cancela la operación.

3. **Manejo de Errores y Preparación del Botón**:
   - Llama a `this.handleErrorMessage()` para manejar posibles mensajes de error.
   - Deshabilita el botón de envío y muestra un indicador de carga.

4. **Configuración de la Solicitud**:
   - Configura la solicitud `fetch` para manejar el envío de datos del formulario. Ajusta los encabezados para la solicitud AJAX.

5. **Vaciar el Carrito**:
   - Realiza una solicitud `POST` a la URL de vaciado del carrito (`emptyCartUrl`) para eliminar todos los productos del carrito actual.

6. **Añadir el Nuevo Producto**:
   - Una vez que el carrito se ha vaciado, agrega el nuevo producto. Si existe un carrito en la página, se añaden secciones a `formData` para actualizar el contenido del carrito.
   - Realiza una solicitud `fetch` a la URL de añadir al carrito (`routes.cart_add_url`) para agregar el nuevo producto.

7. **Procesar la Respuesta**:
   - Analiza la respuesta del servidor. Si hay errores, se muestran al usuario y se actualiza el estado del botón de envío.
   - Si no hay errores y el carrito existe, se publica un evento de actualización del carrito.
   - Si se usa un modal de "Quick Add", espera a que se cierre antes de actualizar el contenido del carrito.

8. **Manejo de Errores y Finalización**:
   - En caso de errores, se registra en la consola.
   - Independientemente del resultado, se elimina el estado de carga del botón y se ajusta la visibilidad del indicador de carga.

### Código

```javascript
onSubmitHandler(evt) {
    evt.preventDefault();

    // Evita el envío si el botón está deshabilitado
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

    this.handleErrorMessage();

    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.classList.add('loading');
    this.querySelector('.loading__spinner').classList.remove('hidden');

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);

    // Obtén la URL para vaciar el carrito
    const emptyCartUrl = `${routes.cart_url}/clear`;

    // Vacía el carrito antes de agregar el nuevo producto
    fetch(emptyCartUrl, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(() => {
        // Una vez que el carrito esté vacío, añade el nuevo producto
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        // Realiza la solicitud para añadir el producto al carrito
        return fetch(`${routes.cart_add_url}`, config);
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          // Muestra el mensaje de error si ocurre algún problema
          publish(PUB_SUB_EVENTS.cartError, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            errors: response.errors || response.description,
            message: response.message,
          });
          this.handleErrorMessage(response.description);

          const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
          if (!soldOutMessage) return;
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButtonText.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          this.error = true;
          return;
        } else if (!this.cart) {
          window.location = window.routes.cart_url;
          return;
        }

        // Publica el evento de actualización del carrito si no hay errores
        if (!this.error)
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: 'product-form',
            productVariantId: formData.get('id'),
            cartData: response,
          });
        this.error = false;

        const quickAddModal = this.closest('quick-add-modal');
        if (quickAddModal) {
          document.body.addEventListener(
            'modalClosed',
            () => {
              setTimeout(() => {
                this.cart.renderContents(response);
              });
            },
            { once: true }
          );
          quickAddModal.hide(true);
        } else {
          this.cart.renderContents(response);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.submitButton.classList.remove('loading');
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
        if (!this.error) this.submitButton.removeAttribute('aria-disabled');
        this.querySelector('.loading__spinner').classList.add('hidden');
      });
}
```
