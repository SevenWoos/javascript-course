import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

async function loadPage() {
  await loadProductsFetch();

  let trackingHTML = '';

  // Get the data(Model)
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === productId) {
      productDetails = details;
    };
  });
  
  let deliveryDateString = dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D');

  // Data for making progress bar interactive.
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime))*100;

  trackingHTML += `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${deliveryDateString}
      </div>

      <div class="product-info">
        ${product.name}
      </div>

      <div class="product-info">
        Quantity: ${productDetails.quantity}
      </div>

      <img class="product-image" src="${product.image}">

      <div class="progress-labels-container">
        <div class="progress-label ${
          percentProgress < 50 ? 'current-status' : ''
        }">
          Preparing
        </div>
        <div class="progress-label ${
          (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
        }">
          Shipped
        </div>
        <div class="progress-label ${
          percentProgress >= 100 ? 'current-status' : ''
        }">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentProgress}%"></div>
      </div>
    </div>
  `;

  document.querySelector('.js-order-tracking')
    .innerHTML = trackingHTML;
};

loadPage();