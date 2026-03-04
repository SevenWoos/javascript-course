import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import {loadFromStorage, cart} from '../../data/cart.js';

// Integration Test = tests many units/pieces of code working together.

describe('test suite: renderOrderSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  // beforeEach hook runs this function before each spec.
  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-checkout-header"></div>
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
    `;

    // Mock localStorage to already have an existing product.
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1, 
        quantity: 2, 
        deliveryOptionId: '1'
      }, 
    
      {
        productId: productId2, 
        quantity: 1, 
        deliveryOptionId: '2'
      }]);
    });
    loadFromStorage();

    renderOrderSummary();
  });

  // afterEach hook to cleanup the HTML after each spec.
  afterEach(() => {
    // Clear the HTML
    document.querySelector('.js-test-container').innerHTML = ``;
  });

  it('displays the cart', () => {
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(2);

    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain('Quantity: 2');

    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain('Quantity: 1');

    // Check that the product name is displayed correctly.
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');

    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual('Intermediate Size Basketball');

    // Check that the product prices are correctly displayed.
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toEqual('$10.90');

    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual('$20.95');
  });


  // Check delete links work
  it('removes a product', () => {
    // Deletes first product by clicking.
    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(1);

    // Check productId1 is null.
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);

    // Check productId2 is still on page.
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);

    // Is cart array updated.
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);

    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual('Intermediate Size Basketball');

    // Check that the product prices are correctly displayed.
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual('$20.95');
  });


  // Tests for updating the delivery option.
  it('updates the delivery option', () => {
    // Select the 3rd delivery option for productId1.
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();

    // Check "checked" property is true after clicking the 3rd delivery option for productId1.
    expect(
      document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
    ).toEqual(true);

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual('3');

    expect(
      document.querySelector('.js-payment-summary-shipping').innerText
    ).toEqual('$14.98');

    expect(
      document.querySelector('.js-payment-summary-total').innerText
    ).toEqual('$63.50');
  });
});