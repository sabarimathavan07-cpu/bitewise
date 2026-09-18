/* =========================================================
   BITEWISE FOOD ORDERING SYSTEM
   FULL FRONTEND SCRIPT
   Backend: Node.js + Express + MySQL
========================================================= */


/* =========================================================
   API
========================================================= */

const API_BASE_URL = "https://bitewise-fmzq.onrender.com";


/* =========================================================
   GLOBAL DATA
========================================================= */

let foods = [];
let restaurants = [];

let currentRestaurant = null;
let currentFoodCategory = "All";


/* =========================================================
   DEFAULT IMAGES
========================================================= */

const DEFAULT_RESTAURANT_IMAGE =
    "https://loremflickr.com/800/600/restaurant,food";

const DEFAULT_FOOD_IMAGE =
    "https://loremflickr.com/800/600/food";


/* =========================================================
   RESTAURANT IMAGES
========================================================= */

const restaurantImages = {

    "Aasife Biriyani":
        "https://loremflickr.com/800/600/indian,restaurant,biryani",

    "Buhari":
        "https://loremflickr.com/800/600/indian,restaurant",

    "Saravana Bhavan":
        "https://loremflickr.com/800/600/southindian,restaurant",

    "Anjappar":
        "https://loremflickr.com/800/600/indian,restaurant",

    "Domino's":
        "https://loremflickr.com/800/600/pizza,restaurant",

    "Burger King":
        "https://loremflickr.com/800/600/burger,restaurant",

    "China Town":
        "https://loremflickr.com/800/600/chinese,restaurant",

    "Sweet Palace":
        "https://loremflickr.com/800/600/indian,sweets,restaurant"

};


/* =========================================================
   FOOD IMAGES
========================================================= */

const foodImages = {

    "Chicken Biryani":
        "https://loremflickr.com/800/600/chicken,biryani",

    "Mutton Biryani":
        "https://loremflickr.com/800/600/mutton,biryani",

    "Chicken 65":
        "https://loremflickr.com/800/600/chicken,65,fried",

    "Masala Dosa":
        "https://loremflickr.com/800/600/masala,dosa",

    "Idli":
        "https://loremflickr.com/800/600/idli,southindian",

    "Vada":
        "https://loremflickr.com/800/600/vada,southindian",

    "Paneer Butter Masala":
        "https://loremflickr.com/800/600/paneer,butter,masala",

    "Chicken Noodles":
        "https://loremflickr.com/800/600/chicken,noodles",

    "Cheese Pizza":
        "https://loremflickr.com/800/600/cheese,pizza",

    "Chicken Pizza":
        "https://loremflickr.com/800/600/chicken,pizza",

    "Garlic Bread":
        "https://loremflickr.com/800/600/garlic,bread",

    "Classic Burger":
        "https://loremflickr.com/800/600/classic,burger",

    "Chicken Burger":
        "https://loremflickr.com/800/600/chicken,burger",

    "French Fries":
        "https://loremflickr.com/800/600/french,fries",

    "Chicken Fried Rice":
        "https://loremflickr.com/800/600/chicken,fried,rice",

    "Chicken Manchurian":
        "https://loremflickr.com/800/600/chicken,manchurian",

    "Gulab Jamun":
        "https://loremflickr.com/800/600/gulab,jamun",

    "Rasgulla":
        "https://loremflickr.com/800/600/rasgulla",

    "Jalebi":
        "https://loremflickr.com/800/600/jalebi"

};


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";
        toast.style.bottom = "25px";
        toast.style.right = "25px";
        toast.style.padding = "13px 20px";
        toast.style.background = "#111";
        toast.style.color = "#fff";
        toast.style.borderRadius = "10px";
        toast.style.zIndex = "999999";
        toast.style.fontSize = "14px";
        toast.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.25)";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.style.display = "block";

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {

        toast.style.display = "none";

    }, 2500);
}


/* =========================================================
   LOADER
========================================================= */

function hideLoader() {

    const loader =
        document.getElementById("loader");

    if (!loader) {
        return;
    }

    loader.style.opacity = "0";

    setTimeout(() => {

        loader.style.display = "none";

    }, 300);
}


/* =========================================================
   LOAD RESTAURANTS FROM BACKEND
========================================================= */

async function loadRestaurantsFromBackend() {

    try {

        console.log(
            "Loading restaurants from backend..."
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/restaurants`
            );

        if (!response.ok) {

            throw new Error(
                `Restaurant API Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Restaurant data is not an array"
            );
        }

        restaurants =
            data.map(
                restaurant => {

                    const name =
                        restaurant.name ||
                        "Restaurant";

                    return {

                        id:
                            Number(
                                restaurant.restaurant_id ??
                                restaurant.id
                            ),

                        name:
                            name,

                        category:
                            restaurant.category ||
                            "Food",

                        rating:
                            Number(
                                restaurant.rating || 0
                            ),

                        deliveryTime:
                            Number(
                                restaurant.delivery_time ??
                                restaurant.deliveryTime ??
                                30
                            ),

                        image:
                            restaurant.image ||
                            restaurantImages[name] ||
                            DEFAULT_RESTAURANT_IMAGE
                    };
                }
            );

        console.log(
            "Restaurants from Backend:",
            restaurants
        );

        console.log(
            "Total restaurants:",
            restaurants.length
        );

    }
    catch (error) {

        console.error(
            "Restaurant loading failed:",
            error
        );

        restaurants = [];
    }
}


/* =========================================================
   LOAD FOODS FROM BACKEND
========================================================= */

async function loadFoodsFromBackend() {

    try {

        console.log(
            "Loading foods from backend..."
        );

        const response =
            await fetch(
                `${API_BASE_URL}/api/foods`
            );

        if (!response.ok) {

            throw new Error(
                `Food API Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Food data is not an array"
            );
        }

        foods =
            data.map(
                food => {

                    const name =
                        food.name ||
                        "Food";

                    return {

                        id:
                            Number(
                                food.food_id ??
                                food.id
                            ),

                        restaurantId:
                            Number(
                                food.restaurant_id ??
                                food.restaurantId ??
                                0
                            ),

                        name:
                            name,

                        category:
                            food.category ||
                            "Food",

                        price:
                            Number(
                                food.price || 0
                            ),

                        rating:
                            Number(
                                food.rating || 0
                            ),

                        time:
                            Number(
                                food.delivery_time ??
                                food.time ??
                                30
                            ),

                        image:
                            food.image ||
                            foodImages[name] ||
                            DEFAULT_FOOD_IMAGE
                    };
                }
            );

        console.log(
            "Foods from Backend:",
            foods
        );

        console.log(
            "Total foods:",
            foods.length
        );

    }
    catch (error) {

        console.error(
            "Food loading failed:",
            error
        );

        foods = [];
    }
}


/* =========================================================
   CART
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "bitewiseCart"
            )
        ) || [];

    }
    catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        return [];
    }
}


function saveCart(cart) {

    localStorage.setItem(
        "bitewiseCart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();

    const count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 1
                    );

            },
            0
        );

    document
        .querySelectorAll(
            "#cartCount, .cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
        );
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(foodId) {

    const food =
        foods.find(
            item =>
                Number(item.id) ===
                Number(foodId)
        );

    if (!food) {

        console.error(
            "Food not found:",
            foodId
        );

        showToast(
            "Food not found"
        );

        return;
    }

    const cart =
        getCart();

    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(food.id)
        );

    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 1
            ) + 1;

    }
    else {

        cart.push({

            id:
                food.id,

            name:
                food.name,

            price:
                food.price,

            rating:
                food.rating,

            image:
                food.image,

            restaurantId:
                food.restaurantId,

            quantity:
                1
        });
    }

    saveCart(cart);

    updateCartCount();

    showToast(
        `${food.name} added to cart`
    );
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(foodId) {

    let cart =
        getCart();

    cart =
        cart.filter(
            item =>
                Number(item.id) !==
                Number(foodId)
        );

    saveCart(cart);

    renderCart();

    updateCartSummary();

    updateCartCount();
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
    foodId,
    change
) {

    const cart =
        getCart();

    const item =
        cart.find(
            item =>
                Number(item.id) ===
                Number(foodId)
        );

    if (!item) {
        return;
    }

    item.quantity =
        Number(
            item.quantity || 1
        ) +
        Number(change);

    if (item.quantity <= 0) {

        removeFromCart(
            foodId
        );

        return;
    }

    saveCart(cart);

    renderCart();

    updateCartSummary();

    updateCartCount();
}


/* =========================================================
   CART SUBTOTAL
========================================================= */

function getCartSubtotal() {

    const cart =
        getCart();

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    Number(
                        item.price || 0
                    ) *
                    Number(
                        item.quantity || 1
                    )
                );

        },
        0
    );
}


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {

    localStorage.removeItem(
        "bitewiseCart"
    );

    renderCart();

    updateCartSummary();

    updateCartCount();

    showToast(
        "Cart cleared"
    );
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );

    if (!container) {
        return;
    }

    const cart =
        getCart();

    if (
        !cart ||
        cart.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some delicious food
                    to continue.
                </p>

                <a
                    href="shop.html"
                    class="btn"
                >
                    Browse Food
                </a>

            </div>
        `;

        return;
    }

    container.innerHTML =
        cart.map(
            item => `

                <div class="cart-item">

                    <img
                        src="${item.image || DEFAULT_FOOD_IMAGE}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${Number(
                                item.price
                            ).toFixed(2)}
                        </p>

                        <div class="quantity-controls">

                            <button
                                type="button"
                                onclick="
                                    changeQuantity(
                                        ${item.id},
                                        -1
                                    )
                                "
                            >
                                -
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                onclick="
                                    changeQuantity(
                                        ${item.id},
                                        1
                                    )
                                "
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <div class="cart-item-actions">

                        <strong>
                            ₹${(
                                Number(item.price) *
                                Number(item.quantity)
                            ).toFixed(2)}
                        </strong>

                        <button
                            type="button"
                            onclick="
                                removeFromCart(
                                    ${item.id}
                                )
                            "
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `
        ).join("");
}


/* =========================================================
   CART SUMMARY
========================================================= */

function updateCartSummary() {

    const subtotal =
        getCartSubtotal();

    const deliveryFee =
        subtotal > 0
            ? 40
            : 0;

    const total =
        subtotal +
        deliveryFee;

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );

    const deliveryElement =
        document.getElementById(
            "deliveryFee"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );

    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toFixed(2)}`;
    }

    if (deliveryElement) {

        deliveryElement.textContent =
            `₹${deliveryFee.toFixed(2)}`;
    }

    if (totalElement) {

        totalElement.textContent =
            `₹${total.toFixed(2)}`;
    }
}


/* =========================================================
   CHECKOUT TOTALS
========================================================= */

function getCheckoutTotals() {

    const subtotal =
        getCartSubtotal();

    const deliveryFee =
        subtotal > 0
            ? 40
            : 0;

    return {

        subtotal:
            subtotal,

        deliveryFee:
            deliveryFee,

        total:
            subtotal +
            deliveryFee
    };
}


/* =========================================================
   GO TO CHECKOUT
========================================================= */

function goToCheckout() {

    const cart =
        getCart();

    if (
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;
    }

    window.location.href =
        "checkout.html";
}


/* =========================================================
   PLACE ORDER
========================================================= */

function placeOrder() {

    const cart =
        getCart();

    if (
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;
    }

    const totals =
        getCheckoutTotals();

    const payment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    const paymentMethod =
        payment
            ? payment.value
            : "Cash on Delivery";

    const order = {

        orderId:
            "BW" +
            Date.now(),

        items:
            cart,

        subtotal:
            totals.subtotal,

        deliveryFee:
            totals.deliveryFee,

        total:
            totals.total,

        paymentMethod:
            paymentMethod,

        status:
            "Confirmed",

        date:
            new Date().toLocaleString()
    };

    localStorage.setItem(
        "bitewiseOrder",
        JSON.stringify(order)
    );

    localStorage.removeItem(
        "bitewiseCart"
    );

    updateCartCount();

    window.location.href =
        "success.html";
}


/* =========================================================
   RENDER RESTAURANTS
========================================================= */

function renderRestaurants(
    restaurantList = restaurants,
    containerId = "homeRestaurants"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    if (
        !Array.isArray(restaurantList) ||
        restaurantList.length === 0
    ) {

        container.innerHTML = `

            <div
                class="empty-state"
                style="
                    grid-column:1/-1;
                    width:100%;
                "
            >

                <h3>
                    No restaurant found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        restaurantList.map(
            restaurant => `

                <div
                    class="restaurant-card"
                    data-restaurant-id="${restaurant.id}"
                    role="button"
                    tabindex="0"
                >

                    <img
                        src="${restaurant.image}"
                        class="restaurant-img"
                        alt="${restaurant.name}"

                        onerror="
                            this.onerror=null;
                            this.src='${DEFAULT_RESTAURANT_IMAGE}';
                        "
                    >

                    <div class="restaurant-info">

                        <h3>
                            ${restaurant.name}
                        </h3>

                        <p>
                            ${restaurant.category}
                        </p>

                        <div class="restaurant-meta">

                            <span>
                                ⭐ ${restaurant.rating}
                            </span>

                            <span>
                                🕒 ${restaurant.deliveryTime} min
                            </span>

                        </div>

                    </div>

                </div>
            `
        ).join("");


    /* =====================================================
       RESTAURANT CLICK
    ===================================================== */

    const cards =
        container.querySelectorAll(
            ".restaurant-card"
        );

    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                function () {

                    const restaurantId =
                        this.dataset.restaurantId;

                    openRestaurant(
                        restaurantId
                    );
                }
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openRestaurant(
                            this.dataset.restaurantId
                        );
                    }
                }
            );
        }
    );
}


/* =========================================================
   RENDER RESTAURANT SECTIONS
========================================================= */

function renderAllRestaurantSections() {

    const containers = [

        "homeRestaurants",
        "shopRestaurants",
        "restaurantGrid",
        "popularRestaurants"

    ];

    containers.forEach(
        containerId => {

            if (
                document.getElementById(
                    containerId
                )
            ) {

                renderRestaurants(
                    restaurants,
                    containerId
                );
            }
        }
    );
}


/* =========================================================
   OPEN RESTAURANT
========================================================= */

function openRestaurant(
    restaurantId
) {

    const restaurant =
        restaurants.find(
            item =>
                Number(item.id) ===
                Number(restaurantId)
        );

    if (!restaurant) {

        console.error(
            "Restaurant not found:",
            restaurantId
        );

        showToast(
            "Restaurant not found"
        );

        return;
    }


    /* SAVE COMPLETE OBJECT */

    localStorage.setItem(
        "bitewiseRestaurant",
        JSON.stringify(
            restaurant
        )
    );


    /* SAVE ID */

    localStorage.setItem(
        "bitewiseRestaurantId",
        String(
            restaurant.id
        )
    );


    console.log(
        "Selected restaurant:",
        restaurant
    );


    /* NAVIGATION */

    if (
        window.location.pathname.includes(
            "/pages/"
        )
    ) {

        window.location.href =
            "food.html";

    }
    else {

        window.location.href =
            "pages/food.html";
    }
}


/* =========================================================
   CREATE FOOD CARD
========================================================= */

function createFoodCard(
    food
) {

    return `

        <div class="food-card">

            <img
                src="${food.image || DEFAULT_FOOD_IMAGE}"
                class="food-img"
                alt="${food.name}"

                onerror="
                    this.onerror=null;
                    this.src='${DEFAULT_FOOD_IMAGE}';
                "
            >

            <div class="food-info">

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.category}
                </p>

                <div class="food-meta">

                    <span>
                        ⭐ ${food.rating}
                    </span>

                    <span>
                        🕒 ${food.time || 30} min
                    </span>

                </div>

                <div class="food-bottom">

                    <strong>
                        ₹${Number(
                            food.price
                        ).toFixed(2)}
                    </strong>

                    <button
                        type="button"
                        onclick="
                            event.stopPropagation();
                            addToCart(${food.id});
                        "
                    >
                        Add to Cart
                    </button>

                </div>

                <button
                    type="button"
                    class="compare-btn"
                    onclick="
                        event.stopPropagation();
                        openCompare(${food.id});
                    "
                >
                    Compare Price
                </button>

            </div>

        </div>
    `;
}


/* =========================================================
   RENDER FOODS
========================================================= */

function renderFoods(
    foodList = foods,
    containerId = "shopFoods"
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }

    if (
        !Array.isArray(foodList) ||
        foodList.length === 0
    ) {

        container.innerHTML = `

            <div
                class="empty-state"
                style="
                    grid-column:1/-1;
                    width:100%;
                "
            >

                <h3>
                    No food found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        foodList
            .map(
                food =>
                    createFoodCard(food)
            )
            .join("");
}


/* =========================================================
   GET SELECTED RESTAURANT
========================================================= */

function getSelectedRestaurant() {

    const restaurantId =
        Number(
            localStorage.getItem(
                "bitewiseRestaurantId"
            )
        );

    if (!restaurantId) {
        return null;
    }

    return restaurants.find(
        restaurant =>
            Number(
                restaurant.id
            ) === restaurantId
    ) || null;
}


/* =========================================================
   RESTAURANT HEADER
========================================================= */

function renderRestaurantHeader() {

    const container =
        document.getElementById(
            "restaurantHeader"
        );

    if (!container) {
        return;
    }

    if (!currentRestaurant) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Restaurant not found
                </h3>

            </div>
        `;

        return;
    }

    container.innerHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                gap:20px;
                flex-wrap:wrap;
                width:100%;
            "
        >

            <img
                src="${currentRestaurant.image}"
                alt="${currentRestaurant.name}"

                style="
                    width:120px;
                    height:100px;
                    min-width:120px;
                    object-fit:cover;
                    border-radius:16px;
                "

                onerror="
                    this.onerror=null;
                    this.src='${DEFAULT_RESTAURANT_IMAGE}';
                "
            >

            <div>

                <h1>
                    ${currentRestaurant.name}
                </h1>

                <p>
                    ${currentRestaurant.category}
                </p>

                <div>

                    <span>
                        ⭐ ${currentRestaurant.rating}
                    </span>

                    &nbsp;&nbsp;

                    <span>
                        🕒 ${currentRestaurant.deliveryTime} min
                    </span>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   GET RESTAURANT FOODS

   IMPORTANT:
   Uses restaurantId from backend
========================================================= */

function getRestaurantFoods() {

    if (!currentRestaurant) {
        return [];
    }

    const restaurantId =
        Number(
            currentRestaurant.id
        );

    return foods.filter(
        food =>
            Number(
                food.restaurantId
            ) === restaurantId
    );
}


/* =========================================================
   CREATE RESTAURANT FOOD CARD
========================================================= */

function createRestaurantFoodCard(
    food
) {

    return `

        <div
            class="food-card"
            style="
                cursor:pointer;
            "
        >

            <img
                src="${food.image || DEFAULT_FOOD_IMAGE}"
                class="food-img"
                alt="${food.name}"

                onerror="
                    this.onerror=null;
                    this.src='${DEFAULT_FOOD_IMAGE}';
                "
            >

            <div class="food-info">

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.category}
                </p>

                <div class="food-meta">

                    <span>
                        ⭐ ${food.rating}
                    </span>

                    <span>
                        🕒 ${food.time || 30} min
                    </span>

                </div>

                <div
                    class="food-bottom"
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:10px;
                        flex-wrap:wrap;
                    "
                >

                    <strong>
                        ₹${Number(
                            food.price
                        ).toFixed(2)}
                    </strong>

                    <div
                        style="
                            display:flex;
                            gap:8px;
                            flex-wrap:wrap;
                        "

                        onclick="
                            event.stopPropagation();
                        "
                    >

                        <button
                            type="button"
                            class="compare-btn"

                            onclick="
                                event.stopPropagation();
                                openCompare(${food.id});
                            "
                        >
                            ⚖ Compare
                        </button>

                        <button
                            type="button"
                            class="add-btn"

                            onclick="
                                event.stopPropagation();
                                addToCart(${food.id});
                            "
                        >
                            + Add
                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   RENDER RESTAURANT FOODS
========================================================= */

function renderRestaurantFoods(
    foodList = null
) {

    const container =
        document.getElementById(
            "restaurantFoods"
        ) ||
        document.getElementById(
            "foodGrid"
        );

    if (!container) {
        return;
    }

    if (!currentRestaurant) {

        container.innerHTML = `

            <div
                class="empty-state"
                style="
                    grid-column:1/-1;
                    width:100%;
                "
            >

                <h3>
                    No restaurant selected
                </h3>

            </div>
        `;

        return;
    }

    const allFoods =
        getRestaurantFoods();

    const displayFoods =
        foodList === null
            ? allFoods
            : foodList;


    console.log(
        "Selected restaurant:",
        currentRestaurant
    );

    console.log(
        "Restaurant ID:",
        currentRestaurant.id
    );

    console.log(
        "Restaurant foods:",
        allFoods
    );


    if (
        displayFoods.length === 0
    ) {

        container.innerHTML = `

            <div
                class="empty-state"
                style="
                    grid-column:1/-1;
                    width:100%;
                "
            >

                <h3>
                    No food available
                </h3>

                <p>
                    No food items available
                    for ${currentRestaurant.name}.
                </p>

            </div>
        `;

        updateFoodResultText(0);

        return;
    }


    container.innerHTML =
        displayFoods
            .map(
                food =>
                    createRestaurantFoodCard(
                        food
                    )
            )
            .join("");


    updateFoodResultText(
        displayFoods.length
    );
}


/* =========================================================
   FOOD RESULT TEXT
========================================================= */

function updateFoodResultText(
    count
) {

    const element =
        document.getElementById(
            "foodResultText"
        );

    if (!element) {
        return;
    }

    element.textContent =
        count > 0
            ? `${count} food item(s) available`
            : "No food items available";
}


/* =========================================================
   FOOD SEARCH
========================================================= */

function searchFood() {

    const input =
        document.getElementById(
            "foodSearch"
        );

    if (!input) {
        return;
    }

    const text =
        input.value
            .trim()
            .toLowerCase();

    const restaurantFoods =
        getRestaurantFoods();

    if (!text) {

        renderRestaurantFoods(
            restaurantFoods
        );

        return;
    }

    const filtered =
        restaurantFoods.filter(
            food => {

                const name =
                    String(
                        food.name || ""
                    )
                        .toLowerCase();

                const category =
                    String(
                        food.category || ""
                    )
                        .toLowerCase();

                return (
                    name.includes(text) ||
                    category.includes(text)
                );
            }
        );

    renderRestaurantFoods(
        filtered
    );
}


/* =========================================================
   FOOD FILTER
========================================================= */

function foodFilter(
    category,
    button
) {

    currentFoodCategory =
        category;


    document
        .querySelectorAll(
            ".filter-pill"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );
            }
        );


    if (button) {

        button.classList.add(
            "active"
        );
    }


    const restaurantFoods =
        getRestaurantFoods();


    if (
        category === "All"
    ) {

        renderRestaurantFoods(
            restaurantFoods
        );

        return;
    }


    const filtered =
        restaurantFoods.filter(
            food =>
                String(
                    food.category || ""
                )
                    .toLowerCase() ===
                String(
                    category
                )
                    .toLowerCase()
        );


    renderRestaurantFoods(
        filtered
    );
}


/* =========================================================
   SHOP SEARCH
========================================================= */

function searchShop() {

    const input =
        document.getElementById(
            "shopSearch"
        );

    if (!input) {
        return;
    }

    const text =
        input.value
            .trim()
            .toLowerCase();


    if (!text) {

        renderRestaurants(
            restaurants,
            "shopRestaurants"
        );

        renderFoods(
            foods,
            "shopFoods"
        );

        return;
    }


    const filteredRestaurants =
        restaurants.filter(
            restaurant => {

                const name =
                    String(
                        restaurant.name || ""
                    )
                        .toLowerCase();

                const category =
                    String(
                        restaurant.category || ""
                    )
                        .toLowerCase();

                return (
                    name.includes(text) ||
                    category.includes(text)
                );
            }
        );


    const filteredFoods =
        foods.filter(
            food => {

                const name =
                    String(
                        food.name || ""
                    )
                        .toLowerCase();

                const category =
                    String(
                        food.category || ""
                    )
                        .toLowerCase();


                const restaurant =
                    restaurants.find(
                        item =>
                            Number(item.id) ===
                            Number(
                                food.restaurantId
                            )
                    );


                const restaurantName =
                    restaurant
                        ? restaurant.name.toLowerCase()
                        : "";


                return (
                    name.includes(text) ||
                    category.includes(text) ||
                    restaurantName.includes(text)
                );
            }
        );


    renderRestaurants(
        filteredRestaurants,
        "shopRestaurants"
    );


    renderFoods(
        filteredFoods,
        "shopFoods"
    );
}


/* =========================================================
   SHOP FILTER
========================================================= */

function shopFilter(
    category,
    button
) {

    document
        .querySelectorAll(
            ".filter-pill"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );
            }
        );


    if (button) {

        button.classList.add(
            "active"
        );
    }


    if (
        category === "All"
    ) {

        renderRestaurants(
            restaurants,
            "shopRestaurants"
        );

        renderFoods(
            foods,
            "shopFoods"
        );

        return;
    }


    const filteredFoods =
        foods.filter(
            food =>
                String(
                    food.category || ""
                )
                    .toLowerCase() ===
                category.toLowerCase()
        );


    const restaurantIds =
        [
            ...new Set(
                filteredFoods.map(
                    food =>
                        Number(
                            food.restaurantId
                        )
                )
            )
        ];


    const filteredRestaurants =
        restaurants.filter(
            restaurant =>
                restaurantIds.includes(
                    Number(
                        restaurant.id
                    )
                )
        );


    renderRestaurants(
        filteredRestaurants,
        "shopRestaurants"
    );


    renderFoods(
        filteredFoods,
        "shopFoods"
    );
}


/* =========================================================
   HOME SEARCH
========================================================= */

function searchHome() {

    const input =
        document.getElementById(
            "homeSearch"
        ) ||
        document.getElementById(
            "searchInput"
        );

    if (!input) {
        return;
    }

    const text =
        input.value
            .trim()
            .toLowerCase();


    if (!text) {

        renderAllRestaurantSections();

        return;
    }


    const matchingRestaurants =
        restaurants.filter(
            restaurant => {

                const name =
                    restaurant.name
                        .toLowerCase();

                const category =
                    restaurant.category
                        .toLowerCase();

                return (
                    name.includes(text) ||
                    category.includes(text)
                );
            }
        );


    const matchingFoods =
        foods.filter(
            food => {

                const name =
                    food.name
                        .toLowerCase();

                const category =
                    food.category
                        .toLowerCase();

                return (
                    name.includes(text) ||
                    category.includes(text)
                );
            }
        );


    if (
        document.getElementById(
            "homeRestaurants"
        )
    ) {

        renderRestaurants(
            matchingRestaurants,
            "homeRestaurants"
        );
    }


    if (
        document.getElementById(
            "shopRestaurants"
        )
    ) {

        renderRestaurants(
            matchingRestaurants,
            "shopRestaurants"
        );
    }


    if (
        document.getElementById(
            "shopFoods"
        )
    ) {

        renderFoods(
            matchingFoods,
            "shopFoods"
        );
    }
}


/* =========================================================
   SEARCH FOODS
========================================================= */

function searchFoods() {

    const input =
        document.getElementById(
            "foodSearch"
        );

    if (!input) {
        return;
    }

    const text =
        input.value
            .trim()
            .toLowerCase();


    if (!text) {

        renderFoods(
            foods,
            "shopFoods"
        );

        return;
    }


    const filtered =
        foods.filter(
            food => {

                return (
                    food.name
                        .toLowerCase()
                        .includes(text) ||

                    food.category
                        .toLowerCase()
                        .includes(text)
                );
            }
        );


    renderFoods(
        filtered,
        "shopFoods"
    );
}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterCategory(
    category
) {

    localStorage.setItem(
        "bitewiseCategory",
        category
    );


    if (
        !category ||
        category.toLowerCase() === "all"
    ) {

        renderFoods(
            foods,
            "shopFoods"
        );

        return;
    }


    const filtered =
        foods.filter(
            food =>
                food.category
                    .toLowerCase() ===
                category.toLowerCase()
        );


    renderFoods(
        filtered
    );
}


/* =========================================================
   COMPARE PRICE
========================================================= */

function openCompare(
    foodId
) {

    const food =
        foods.find(
            item =>
                Number(item.id) ===
                Number(foodId)
        );


    if (!food) {

        showToast(
            "Food not found"
        );

        return;
    }


    localStorage.setItem(
        "bitewiseCompareFood",
        JSON.stringify(
            food
        )
    );


    localStorage.setItem(
        "bitewiseCompareFoodId",
        String(
            food.id
        )
    );


    if (
        window.location.pathname.includes(
            "/pages/"
        )
    ) {

        window.location.href =
            "compare.html";

    }
    else {

        window.location.href =
            "pages/compare.html";
    }
}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

function renderRecommendations() {

    const container =
        document.getElementById(
            "recommendationGrid"
        );

    if (!container) {
        return;
    }


    const list =
        foods.slice(
            0,
            8
        );


    if (
        list.length === 0
    ) {

        container.innerHTML = `
            <p>
                No recommendations available.
            </p>
        `;

        return;
    }


    container.innerHTML =
        list
            .map(
                food =>
                    createFoodCard(
                        food
                    )
            )
            .join("");
}


/* =========================================================
   LOAD SUCCESS ORDER
========================================================= */

function loadSuccessOrder() {

    const data =
        localStorage.getItem(
            "bitewiseOrder"
        );

    if (!data) {
        return;
    }


    try {

        const order =
            JSON.parse(
                data
            );


        const orderId =
            document.getElementById(
                "orderId"
            );

        const total =
            document.getElementById(
                "successTotal"
            );

        const payment =
            document.getElementById(
                "successPayment"
            );


        if (orderId) {

            orderId.textContent =
                order.orderId;
        }


        if (total) {

            total.textContent =
                `₹${Number(
                    order.total
                ).toFixed(2)}`;
        }


        if (payment) {

            payment.textContent =
                order.paymentMethod;
        }

    }
    catch (error) {

        console.error(
            "Order loading error:",
            error
        );
    }
}


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

async function initializePage() {

    console.log(
        "================================"
    );

    console.log(
        "BiteWise frontend starting..."
    );

    console.log(
        "================================"
    );


    /* LOAD BACKEND DATA */

    await loadRestaurantsFromBackend();

    await loadFoodsFromBackend();


    console.log(
        "Restaurants ready:",
        restaurants.length
    );

    console.log(
        "Foods ready:",
        foods.length
    );


    /* CART */

    updateCartCount();


    /* HOME */

    if (
        document.getElementById(
            "recommendationGrid"
        )
    ) {

        renderRecommendations();
    }


    /* RESTAURANTS */

    renderAllRestaurantSections();


    /* SHOP FOODS */

    if (
        document.getElementById(
            "shopFoods"
        )
    ) {

        renderFoods(
            foods,
            "shopFoods"
        );
    }


    /* FOOD PAGE */

    if (
        document.getElementById(
            "restaurantFoods"
        ) ||
        document.getElementById(
            "foodGrid"
        )
    ) {

        currentRestaurant =
            getSelectedRestaurant();


        console.log(
            "Selected restaurant:",
            currentRestaurant
        );


        renderRestaurantHeader();

        renderRestaurantFoods();
    }


    /* CART PAGE */

    if (
        document.getElementById(
            "cartContainer"
        )
    ) {

        renderCart();

        updateCartSummary();
    }


    /* SUCCESS PAGE */

    if (
        document.getElementById(
            "orderId"
        )
    ) {

        loadSuccessOrder();
    }


    /* LOADER */

    setTimeout(
        hideLoader,
        500
    );


    console.log(
        "================================"
    );

    console.log(
        "BiteWise frontend initialized successfully!"
    );

    console.log(
        "Restaurants:",
        restaurants.length
    );

    console.log(
        "Foods:",
        foods.length
    );

    console.log(
        "================================"
    );
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializePage();

    }
);