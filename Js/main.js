let inputs = document.querySelectorAll("input");
let productList = document.querySelector("#productList");
let model = document.querySelector("#addProductModal");
let submitBtn = document.querySelector(".modal-footer button");
let spans = document.querySelectorAll(".error");
let table = document.querySelector("tbody");
console.log(productList);
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let error = false;
let totalllll = document.querySelector("#total");
// console.log(totalllll);

inputs[2].addEventListener("beforeinput", (e) => {
  // لو المستخدم كتب حرف مش رقم، امنعه يدخل
  if (e.data && !/\d/.test(e.data)) {
    e.preventDefault();
  }
});

submitBtn.addEventListener("click", () => {
  error = false;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      error = true;
      spans[i].classList.remove("error");
      spans[i].innerHTML = "This field is required";
      continue;
    } else {
      spans[i].classList.add("error");
      spans[i].innerHTML = "";
    }
    if (inputs[0].value.length < 3) {
      error = true;
      spans[0].classList.remove("error");
      spans[0].innerHTML = "Title must be at least 3 characters";
      continue;
    } else {
      spans[0].classList.add("error");
      spans[0].innerHTML = "";
    }
    if (inputs[1].value.length <= 10) {
      error = true;
      spans[1].classList.remove("error");
      spans[1].innerHTML = "Description is too short";
      continue;
    } else {
      spans[1].classList.add("error");
      spans[1].innerHTML = "";
    }
    if (+inputs[2].value <= 1) {
      error = true;
      spans[2].classList.remove("error");
      spans[2].innerHTML = "This is not a valid price";
      continue;
    } else {
      spans[2].classList.add("error");
      spans[2].innerHTML = "";
    }
  }

  if (!error) {
    renderProducts();
  }
});

let clearInputs = () => {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
};
let renderProducts = () => {
  newProduct = {
    Title: inputs[0].value,
    Description: inputs[1].value,
    Price: +inputs[2].value,
    Image: inputs[3].value,
  };
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  readData();
  clearInputs();
};
let deletee = (i) => {
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  readData();
};
let calcTotal = () => {
  let sumtotal = 0;
  cart.forEach((element) => {
    sumtotal += element.total;
  });
  if (sumtotal > 0) {
    totalllll.innerHTML = `Total: <span style="color: darkblue; font-weight: 500; text-decoration:underline;"> $${sumtotal.toFixed(
      2
    )} </span>`;
  } else {
    totalllll.innerHTML = `Total`;
  }
};
let AddToCart = (i) => {
  newcartitem = {
    id: i,
    Title: products[i].Title,
    Description: products[i].Description,
    count: 1,
    Price: products[i].Price,
    total: products[i].Price,
  };
  let exist = cart.find((i) => i.id == newcartitem.id);
  if (!exist) {
    cart.push(newcartitem);
    console.log(newcartitem);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    calcTotal();
  }
};
let deleteAllFromCart = () => {
  cart.splice(0, cart.length);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};
let deleteitemfromthecart = (i) => {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};
let increase = (i) => {
  ++cart[i].count;
  if (cart[i].count > 10) {
    cart[i].count = 10;
  }
  cart[i].total = cart[i].count * cart[i].Price;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};
let decrease = (i) => {
  --cart[i].count;
  if (cart[i].count <= 0) {
    cart[i].count = 1;
  }
  cart[i].total = cart[i].count * cart[i].Price;
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
};
let renderCart = () => {
  table.innerHTML = "";
  cart.forEach((element, i) => {
    count = element.count || 1;
    total = element.total || element.Price;
    table.innerHTML += `<tr>
      <td>${element.Title}</td>
      <td>${element.Price}</td>
        <td>
            <div class="qty-box justify-content-center">
                <button onclick="decrease(${i})" class="btn btn-outline-secondary btn-sm">−</button>
                <p>${count}</p>
                <button  onclick="increase(${i})" class="btn btn-outline-secondary btn-sm">+</button>
            </div>
        </td>
        <td>$${total}</td>
        <td style="cursor: pointer">
                  <i
                    onclick="deleteitemfromthecart(${i})"
                    class="fa-solid fa-trash text-danger"
                  ></i>
                </td>
      </tr>`;
  });
  calcTotal();
};

let readData = () => {
  productList.innerHTML = "";
  if (products.length !== 0) {
    products.forEach((element, i) => {
      productList.innerHTML += `<div class="col">
          <div class="card shadow-sm">
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  src="${element.Image}"
                  class="img-fluid rounded-start"
                  alt="Product Image"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${element.Title}</h5>
                  <p class="card-text text-muted small">
                    ${element.Description}.
                  </p>
                  <p class="card-text fw-bold">Price: $${element.Price}</p>
                  <button onclick="AddToCart(${i})" class="btn btn-primary">Add to Cart</button>
                <button onclick="deletee(${i})" class="btn btn-danger">delete</button>

                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
  }
};

readData();
renderCart();
calcTotal();
