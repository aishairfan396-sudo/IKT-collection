// =========================
// SHOPPING CART
// =========================

let cart = JSON.parse(localStorage.getItem("iktCart")) || [];


// SAVE CART
function saveCart() {
    localStorage.setItem("iktCart", JSON.stringify(cart));
}


// UPDATE CART NUMBER
function updateCartNumber() {

    const cartNumbers = document.querySelectorAll(".cart-icon small");

    let totalQuantity = 0;

    cart.forEach(function(item) {
        totalQuantity += item.quantity;
    });

    cartNumbers.forEach(function(number) {
        number.textContent = totalQuantity;
    });
}


// ADD PRODUCT TO CART
function addToCart(button) {

    const productCard = button.closest(".product-card");

    const productName = productCard.querySelector("h3").textContent;
    const productCategory = productCard.querySelector(".product-category").textContent;
    const priceText = productCard.querySelector(".price").textContent;

    const price = parseInt(priceText.replace(/[^\d]/g, ""));

    const imageElement = productCard.querySelector(".product-image");

    let imageClass = "";

    if (imageElement) {
        imageClass = imageElement.className;
    }

    const existingProduct = cart.find(function(item) {
        return item.name === productName;
    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            category: productCategory,
            price: price,
            image: imageClass,
            quantity: 1
        });

    }

    saveCart();
    updateCartNumber();

    button.textContent = "ADDED ✓";

    setTimeout(function() {
        button.textContent = "ADD TO CART";
    }, 1500);
}


// NORMAL ADD TO CART BUTTONS

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {
        addToCart(button);
    });

});


// QUICK CART BUTTONS

const quickCartButtons = document.querySelectorAll(".quick-cart");

quickCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        addToCart(button);

        button.textContent = "✓";

        setTimeout(function() {
            button.textContent = "🛒";
        }, 1000);

    });

});


// UPDATE NUMBER WHEN PAGE LOADS

updateCartNumber();


// =========================
// OPEN CART PAGE
// =========================

const cartButton = document.getElementById("cartButton");

if (cartButton) {

    cartButton.addEventListener("click", function() {
        window.location.href = "cart.html";
    });

}


// =========================
// CART PAGE
// =========================

const cartItemsContainer = document.getElementById("cartItems");

if (cartItemsContainer) {

    displayCart();

}


// DISPLAY CART

function displayCart() {

    const cartItemsContainer = document.getElementById("cartItems");

    if (!cartItemsContainer) return;

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart Is Empty</h2>
                <p>You haven't added any products yet.</p>

                <a href="index.html#new-arrivals" class="main-btn">
                    CONTINUE SHOPPING
                </a>
            </div>
        `;

        updateSummary();

        return;
    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(function(item, index) {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <div class="cart-item-image ${item.image}">
            </div>

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>${item.category}</p>

            </div>

            <div class="cart-price">
                Rs. ${item.price.toLocaleString()}
            </div>

            <div class="quantity-box">

                <button onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${index}, 1)">
                    +
                </button>

            </div>

            <button class="remove-btn" onclick="removeItem(${index})">
                REMOVE
            </button>

        `;

        cartItemsContainer.appendChild(itemElement);

    });


    updateSummary();
}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    updateCartNumber();

    displayCart();

}


// =========================
// REMOVE PRODUCT
// =========================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCartNumber();

    displayCart();

}


// =========================
// CART TOTAL
// =========================

function updateSummary() {

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal += item.price * item.quantity;

    });


    const shipping = subtotal > 0 ? 250 : 0;

    const total = subtotal + shipping;


    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");


    if (subtotalElement) {
        subtotalElement.textContent =
            "Rs. " + subtotal.toLocaleString();
    }

    if (shippingElement) {
        shippingElement.textContent =
            "Rs. " + shipping.toLocaleString();
    }

    if (totalElement) {
        totalElement.textContent =
            "Rs. " + total.toLocaleString();
    }

}


// =========================
// SEARCH
// =========================

const searchButton = document.getElementById("searchButton");

if (searchButton) {

    searchButton.addEventListener("click", function() {

        const searchText = prompt("What are you looking for?");

        if (searchText) {

            const products = document.querySelectorAll(".product-card");

            let found = false;

            products.forEach(function(product) {

                const productName =
                    product.querySelector("h3").textContent.toLowerCase();

                if (productName.includes(searchText.toLowerCase())) {

                    product.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    found = true;

                }

            });

            if (!found) {
                alert("Sorry, product not found.");
            }

        }

    });

}
// =========================
// CHECKOUT PAGE
// =========================

const checkoutItems = document.getElementById("checkoutItems");

if (checkoutItems) {

    displayCheckout();

}


// DISPLAY CHECKOUT ORDER

function displayCheckout() {

    const checkoutItems = document.getElementById("checkoutItems");

    if (!checkoutItems) return;


    // EMPTY CART

    if (cart.length === 0) {

        document.getElementById("checkoutContent").innerHTML = `

            <div class="empty-checkout">

                <h2>Your Cart Is Empty</h2>

                <p>
                    Please add some products before checkout.
                </p>

                <a href="index.html#new-arrivals">
                    CONTINUE SHOPPING
                </a>

            </div>

        `;

        return;

    }


    checkoutItems.innerHTML = "";


    // SHOW PRODUCTS

    cart.forEach(function(item) {

        const itemElement = document.createElement("div");

        itemElement.className = "order-item";

        itemElement.innerHTML = `

            <div class="order-item-name">

                ${item.name}

                <br>

                <small>
                    Quantity: ${item.quantity}
                </small>

            </div>

            <div class="order-item-price">

                Rs. ${(item.price * item.quantity).toLocaleString()}

            </div>

        `;

        checkoutItems.appendChild(itemElement);

    });


    // CALCULATE TOTALS

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal += item.price * item.quantity;

    });


    const shipping = subtotal > 0 ? 250 : 0;

    const total = subtotal + shipping;


    // SHOW TOTALS

    document.getElementById("checkoutSubtotal").textContent =
        "Rs. " + subtotal.toLocaleString();


    document.getElementById("checkoutShipping").textContent =
        "Rs. " + shipping.toLocaleString();


    document.getElementById("checkoutTotal").textContent =
        "Rs. " + total.toLocaleString();

}


// =========================
// PLACE ORDER
// =========================

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name = document.getElementById("fullName").value;

        const phone = document.getElementById("phone").value;

        const address = document.getElementById("address").value;

        const city = document.getElementById("city").value;


        alert(
            "Thank you, " + name +
            "! Your order has been received."
        );

        sendOrderToWhatsApp();

        // CLEAR CART

        cart = [];

        saveCart();

        updateCartNumber();


        

    // GO TO ORDER SUCCESS PAGE

window.location.href = "order-success.html";

    });

}
// =========================
// WHATSAPP ORDER
// =========================

function sendOrderToWhatsApp() {

    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;

    let message = "🛍️ *NEW ORDER - IKT COLLECTION*%0A%0A";

    message += "*Customer Details*%0A";
    message += "Name: " + name + "%0A";
    message += "Phone: " + phone + "%0A";
    message += "Address: " + address + "%0A";
    message += "City: " + city + "%0A%0A";

    message += "*Order Details*%0A";

    let subtotal = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        subtotal += itemTotal;

        message +=
            item.name +
            " x " +
            item.quantity +
            " = Rs. " +
            itemTotal.toLocaleString() +
            "%0A";

    });

    const shipping = subtotal > 0 ? 250 : 0;
    const total = subtotal + shipping;

    message += "%0ASubtotal: Rs. " + subtotal.toLocaleString();
    message += "%0ADelivery: Rs. " + shipping.toLocaleString();
    message += "%0A*Total: Rs. " + total.toLocaleString() + "*";

    const whatsappNumber = "923321576050";

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        message;

    window.open(whatsappURL, "_blank");

}
// Mobile hamburger menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function() {
        navLinks.classList.toggle("active");
    });

    const menuLinks = navLinks.querySelectorAll("a");

    menuLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            navLinks.classList.remove("active");
        });
    });
}