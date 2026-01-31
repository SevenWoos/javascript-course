let calculation = localStorage.getItem('calculation') || '';

display_calculation();

function update_calculation(value) {
  calculation += value;
  display_calculation();

  localStorage.setItem('calculation', calculation);
};

function display_calculation() {
  document.querySelector('.js_calculation')
    .innerHTML = `${calculation}`;
};


// Get all buttons with for each loop
const buttons = document.querySelectorAll('.calculator_button[data_value]');

buttons.forEach(button => {
  button.addEventListener("click", () => {
    update_calculation(button.datatset.value);
  });
});