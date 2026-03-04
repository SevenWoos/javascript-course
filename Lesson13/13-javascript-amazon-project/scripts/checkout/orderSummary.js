import {
  cart, 
  removeFromCart, 
  calculateCartQuantity, 
  updateQuantity,
  updateDeliveryOption
} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

// MVC = (Model, View, Controller)

// Model generates view
export function renderOrderSummary() {
  // Loop through cart and generate the HTML
  let cartSummaryHTML = ``;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container 
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity
              js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" 
                data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link
                js-delete-link-${matchingProduct.id}"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = ``;

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  };

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  // View when we interact with the view, runs the controller.

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        // const container = document.querySelector(`.js-cart-item-container-${productId}`);
        // container.remove();
        // updateCartQuantity();

        // 15k. Re-render Checkout Header so cart quantity is updated after deleting a product from the cart.
        renderCheckoutHeader();

        // 15h. When deleting a product from the cart, instead of using the DOM and updating the page directly with .delete(), regenerate the HTML for the order summary.
        renderOrderSummary();

        // Regenerate the Payment Summary HTML when clicking delete
        renderPaymentSummary();
      });
    });


  // // 14c
  // function updateCartQuantity() {
  //   // 14b. Calculate cart quantity and display it in checkout.
  //   const cartQuantity = calculateCartQuantity();

  //   document.querySelector('.js-return-to-home-link')
  //     .innerHTML = `${cartQuantity} items`;
  // };

  // updateCartQuantity();


  // 14f. Get all "Update" links from page and add "click" event listener.
  document.querySelectorAll('.js-update-link')
    .forEach((updateLink) => {
      updateLink.addEventListener('click', () => {
        const productId = updateLink.dataset.productId;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      });
    });

    
  // 14j. Add event listeners to all save links.
  document.querySelectorAll('.js-save-link')
    .forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
        const productId = saveLink.dataset.productId;

        // 14k. Get the quantity from clicking save.
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInput.value);

        // 14n. Make sure new quantity is not less than 0 or greater than 1000.
        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000.');
          return;
        };

        updateQuantity(productId, newQuantity);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabel.innerHTML = newQuantity;

        // 15n. Use MVC to update page when updating and saving the quantity in the checkout page.
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  // Controller updates the data(model). We used the updated data(model) to regenerate the view.
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);

        // Regenerate HTML when choosing new delivery option.
        renderOrderSummary();

        // Regenerate the Payment Summary HTML when changing the delivery options.
        renderPaymentSummary();
      });
    });
};

