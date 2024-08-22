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

El tema utiliza un esquema personalizado para construir la página de la lista de productos. Este esquema se basa en el archivo `schema.json` que define los parámetros y campos necesarios para la visualización de productos. Los campos permiten la personalización de la presentación y el diseño de la lista de productos en la tienda.

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
