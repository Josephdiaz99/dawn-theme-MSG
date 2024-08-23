class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    input.value = input.getAttribute('value');
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

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

  onChange(event) {
    this.validateQuantity(event);
  }

  onCartUpdate() {
    // Verifica si el elemento actual es un 'CART-DRAWER-ITEMS'
    if (this.tagName === 'CART-DRAWER-ITEMS') {
      // Si es un 'CART-DRAWER-ITEMS', realiza una solicitud para obtener el contenido del carrito en el cajón del carrito (drawer)
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text()) // Obtiene la respuesta como texto
        .then((responseText) => {
          // Convierte el texto de la respuesta en un documento HTML
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          // Define los selectores de las secciones que necesitan ser actualizadas
          const selectors = ['cart-drawer-items', '.cart-drawer__footer'];
          // Recorre cada selector para actualizar las secciones correspondientes
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector); // Selecciona el elemento actual en el DOM
            const sourceElement = html.querySelector(selector); // Selecciona el elemento nuevo del documento HTML de respuesta
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement); // Reemplaza el elemento en el DOM con el nuevo contenido
            }
          }
        })
        .catch((e) => {
          // Maneja cualquier error que ocurra durante la solicitud
          console.error(e);
        });
    } else {
      // Si no es un 'CART-DRAWER-ITEMS', realiza una solicitud para obtener el contenido del carrito principal
      fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text()) // Obtiene la respuesta como texto
        .then((responseText) => {
          // Convierte el texto de la respuesta en un documento HTML
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          // Selecciona el nuevo contenido del carrito desde el documento HTML de respuesta
          const sourceQty = html.querySelector('cart-items');
          this.innerHTML = sourceQty.innerHTML; // Actualiza el contenido del elemento actual con el nuevo contenido
        })
        .catch((e) => {
          // Maneja cualquier error que ocurra durante la solicitud
          console.error(e);
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      },
    ];
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').textContent = message;

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);
