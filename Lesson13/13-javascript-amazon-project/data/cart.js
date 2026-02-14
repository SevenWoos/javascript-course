export const cart = [];

export function addToCart(productId) {
  let matchingItem;

    // Check for duplicate items do we can increase quantity
    cart.forEach((cartItem) => {
      if(productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`
    );
    const quantity = Number(quantitySelector.value);

    if(matchingItem) {
      // matchingItem.quantity+=1;
      matchingItem.quantity+=quantity;
    }
    else {
      cart.push({
        productId: productId, 
        quantity: quantity
      });
    }
};