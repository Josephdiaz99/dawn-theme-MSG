document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('#ProductSubmitButton-template--15669814165638__main');
  const productIdInput = document.querySelector('input[name="product-id"]');

  if (submitButton && productIdInput) {
    submitButton.addEventListener('click', function(event) {
      event.preventDefault(); // Evita el comportamiento por defecto del formulario
      const variantId = productIdInput.value;
      const quantity = 1; // Cantidad a añadir

      console.log('Botón clickeado. Añadiendo producto al carrito...');
      console.log('ID del producto:', variantId);
      console.log('Cantidad:', quantity);

      addProductToCart(variantId, quantity);
    });
  }

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
});
