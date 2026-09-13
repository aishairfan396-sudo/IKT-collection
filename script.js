// =========================
// SHOPPING CART
// =========================

let cart = JSON.parse(localStorage.getItem("iktCart")) || [];


// =========================
// SAVE CART
// =========================

function saveCart() {
    localStorage.setItem("iktCart", JSON.stringify(cart));
}


// =========================
// UPDATE CART NUMBER
// =========================

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


// =========================
// ADD PRODUCT TO CART
// =========================

function addToCart(button) {

    const productCard = button.closest(".product-card");

    if (!productCard) return;

    const productName =
        productCard.querySelector("h3").textContent;

    const productCategory =
        productCard.querySelector(".product-category").textContent;

    const priceText =
        productCard.querySelector(".price").textContent;

    const price =
        parseInt(priceText.replace(/[^\d]/g, ""));

    const imageElement =
        productCard.querySelector(".product-image");

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


// =========================
// NORMAL ADD TO CART BUTTONS
// =========================

const addCartButtons =
    document.querySelectorAll(".add-cart");

addCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {
        addToCart(button);
    });

});


// =========================
// QUICK CART BUTTONS
// =========================

const quickCartButtons =
    document.querySelectorAll(".quick-cart");

quickCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        addToCart(button);

        button.textContent = "✓";

        setTimeout(function() {
            button.textContent = "🛒";
        }, 1000);

    });

});


// =========================
// UPDATE CART NUMBER ON LOAD
// =========================

updateCartNumber();


// =========================
// OPEN CART PAGE
// =========================

const cartButton =
    document.getElementById("cartButton");

if (cartButton) {

    cartButton.addEventListener("click", function() {
        window.location.href = "cart.html";
    });

}


// =========================
// CART PAGE
// =========================

const cartItemsContainer =
    document.getElementById("cartItems");

if (cartItemsContainer) {

    displayCart();

}


// =========================
// DISPLAY CART
// =========================

function displayCart() {

    const cartItemsContainer =
        document.getElementById("cartItems");

    if (!cartItemsContainer) return;


    // EMPTY CART

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">

                <h2>Your Cart Is Empty</h2>

                <p>
                    You haven't added any products yet.
                </p>

                <a href="index.html#new-arrivals"
                   class="main-btn">
                    CONTINUE SHOPPING
                </a>

            </div>
        `;

        updateSummary();

        return;
    }


    // CLEAR OLD ITEMS

    cartItemsContainer.innerHTML = "";


    // DISPLAY PRODUCTS

    cart.forEach(function(item, index) {

        const itemElement =
            document.createElement("div");

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

                <button
                    onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    onclick="changeQuantity(${index}, 1)">
                    +
                </button>

            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${index})">
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

    if (!cart[index]) return;

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

    if (!cart[index]) return;

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

        subtotal +=
            item.price * item.quantity;

    });


    const shipping =
        subtotal > 0 ? 250 : 0;

    const total =
        subtotal + shipping;


    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {

        subtotalElement.textContent =
            "Rs. " +
            subtotal.toLocaleString();

    }


    if (shippingElement) {

        shippingElement.textContent =
            "Rs. " +
            shipping.toLocaleString();

    }


    if (totalElement) {

        totalElement.textContent =
            "Rs. " +
            total.toLocaleString();

    }

}


// =========================
// PROFESSIONAL SEARCH
// =========================

const searchButton =
    document.getElementById("searchButton");

if (searchButton) {

    searchButton.addEventListener("click", function() {

        const searchText = prompt(
            "Search for a product, category or collection:"
        );


        // CANCEL / EMPTY SEARCH

        if (!searchText || !searchText.trim()) {
            return;
        }


        const searchValue =
            searchText.trim().toLowerCase();


        const products =
            document.querySelectorAll(".product-card");


        let found = false;


        products.forEach(function(product) {

            const nameElement =
                product.querySelector("h3");

            const categoryElement =
                product.querySelector(".product-category");


            const productName =
                nameElement
                    ? nameElement.textContent.toLowerCase()
                    : "";


            const productCategory =
                categoryElement
                    ? categoryElement.textContent.toLowerCase()
                    : "";


            if (
                productName.includes(searchValue) ||
                productCategory.includes(searchValue)
            ) {

                product.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                // HIGHLIGHT SEARCH RESULT

                product.style.boxShadow =
                    "0 0 0 3px #9b7355, 0 15px 35px rgba(0,0,0,0.12)";


                setTimeout(function() {

                    product.style.boxShadow = "";

                }, 2500);


                found = true;

            }

        });


        if (!found) {

            alert(
                "Sorry, we couldn't find that product or category."
            );

        }

    });

}


// =========================
// CHECKOUT PAGE
// =========================

const checkoutItems =
    document.getElementById("checkoutItems");

if (checkoutItems) {

    displayCheckout();

}


// =========================
// DISPLAY CHECKOUT ORDER
// =========================

function displayCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    if (!checkoutItems) return;


    // EMPTY CART

    if (cart.length === 0) {

        const checkoutContent =
            document.getElementById("checkoutContent");

        if (checkoutContent) {

            checkoutContent.innerHTML = `

                <div class="empty-checkout">

                    <h2>Your Cart Is Empty</h2>

                    <p>
                        Please add some products
                        before checkout.
                    </p>

                    <a href="index.html#new-arrivals">
                        CONTINUE SHOPPING
                    </a>

                </div>

            `;

        }

        return;
    }


    // CLEAR OLD PRODUCTS

    checkoutItems.innerHTML = "";


    // SHOW PRODUCTS

    cart.forEach(function(item) {

        const itemElement =
            document.createElement("div");

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

                Rs. ${
                    (item.price * item.quantity)
                    .toLocaleString()
                }

            </div>

        `;

        checkoutItems.appendChild(itemElement);

    });


    // CALCULATE TOTALS

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal +=
            item.price * item.quantity;

    });


    const shipping =
        subtotal > 0 ? 250 : 0;

    const total =
        subtotal + shipping;


    // SHOW TOTALS

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutShipping =
        document.getElementById("checkoutShipping");

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            "Rs. " +
            subtotal.toLocaleString();

    }


    if (checkoutShipping) {

        checkoutShipping.textContent =
            "Rs. " +
            shipping.toLocaleString();

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            "Rs. " +
            total.toLocaleString();

    }

}


// =========================
// PLACE ORDER
// =========================

const checkoutForm =
    document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("fullName")
                .value.trim();


            const phone =
                document.getElementById("phone")
                .value.trim();


            const address =
                document.getElementById("address")
                .value.trim();


            const city =
                document.getElementById("city")
                .value.trim();


            // REQUIRED FIELDS

            if (
                !name ||
                !phone ||
                !address ||
                !city
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // PHONE VALIDATION

            const phonePattern =
                /^[0-9+\-\s]{10,15}$/;


            if (!phonePattern.test(phone)) {

                alert(
                    "Please enter a valid phone number."
                );

                return;
            }


            // CHECK CART

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add a product first."
                );

                window.location.href =
                    "index.html#new-arrivals";

                return;
            }


            // SEND ORDER TO WHATSAPP

            sendOrderToWhatsApp();


            // SUCCESS MESSAGE

            alert(
                "Thank you, " +
                name +
                "! Your order has been received."
            );


            // CLEAR CART

            cart = [];

            saveCart();

            updateCartNumber();


            // ORDER SUCCESS PAGE

            window.location.href =
                "order-success.html";

        }
    );

}


// =========================
// WHATSAPP ORDER
// =========================

function sendOrderToWhatsApp() {

    const name =
        document.getElementById("fullName").value;

    const phone =
        document.getElementById("phone").value;

    const address =
        document.getElementById("address").value;

    const city =
        document.getElementById("city").value;


    let message =
        "🛍️ *NEW ORDER - IKT COLLECTION*%0A%0A";


    // CUSTOMER DETAILS

    message +=
        "*Customer Details*%0A";

    message +=
        "Name: " +
        encodeURIComponent(name) +
        "%0A";

    message +=
        "Phone: " +
        encodeURIComponent(phone) +
        "%0A";

    message +=
        "Address: " +
        encodeURIComponent(address) +
        "%0A";

    message +=
        "City: " +
        encodeURIComponent(city) +
        "%0A%0A";


    // ORDER DETAILS

    message +=
        "*Order Details*%0A";


    let subtotal = 0;


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;


        subtotal += itemTotal;


        message +=
            encodeURIComponent(item.name) +
            " x " +
            item.quantity +
            " = Rs. " +
            itemTotal.toLocaleString() +
            "%0A";

    });


    // DELIVERY

    const shipping =
        subtotal > 0 ? 250 : 0;


    const total =
        subtotal + shipping;


    message +=
        "%0ASubtotal: Rs. " +
        subtotal.toLocaleString();


    message +=
        "%0ADelivery: Rs. " +
        shipping.toLocaleString();


    message +=
        "%0A*Total: Rs. " +
        total.toLocaleString() +
        "*";


    // WHATSAPP NUMBER

    const whatsappNumber =
        "923321576050";


    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        message;


    window.open(
        whatsappURL,
        "_blank"
    );

}


// =========================
// MOBILE HAMBURGER MENU
// =========================

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        function() {

            navLinks.classList.toggle("active");

        }
    );


    const menuLinks =
        navLinks.querySelectorAll("a");


    menuLinks.forEach(function(link) {

        link.addEventListener(
            "click",
            function() {

                navLinks.classList.remove("active");

            }
        );

    });

}
