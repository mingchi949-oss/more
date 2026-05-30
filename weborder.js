// Array to hold the items added to the cart
let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

// Function to add items to the cart array
function addToCart(itemName, price, inputId) {
  const quantity = parseInt(document.getElementById(inputId).value);

  if (quantity <= 0 || isNaN(quantity)) return;

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.name === itemName);

  if (existingItem) {
    // If it exists, just add to the quantity
    existingItem.qty += quantity;
  } else {
    // Otherwise, add a new item object to the array
    cart.push({ name: itemName, price: price, qty: quantity });
  }

  // Reset the input field back to 1
  document.getElementById(inputId).value = 1;

  // Refresh the display
  updateCartUI();
}

// Function to remove an item from the cart and update local storage
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateCartUI();
}

// Function to display the cart items on the screen
function updateCartUI() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartList.innerHTML = '<p style="color: #777;">Your cart is empty.</p>';
    cartTotal.innerText = "Total: $0.00";
    return;
  }

  cartList.innerHTML = "";
  let totalCost = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    totalCost += itemTotal;

    cartList.innerHTML += `
      <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="flex-grow: 1;">
              <p style="margin: 0; font-weight: bold; color: white;">${item.qty}x ${item.name}</p>
              <small style="color: #888;">Sugar: ${item.sugar || "100%"}</small>
          </div>
          <div style="display: flex; align-items: center; gap: 15px;">
              <span style="color: var(--accent); font-weight: bold;">$${itemTotal.toFixed(2)}</span>
              <button class="remove-item-btn" onclick="removeFromCart(${index})">&times;</button>
          </div>
      </div>
    `;
  });

  cartTotal.innerText = `Total: $${totalCost.toFixed(2)}`;
}

// Load the cart display automatically when the order page opens
updateCartUI();

// Handle the checkout submit
document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Please add at least one item to your cart before ordering!");
      return;
    }

    // YOUR TELEGRAM CONFIGURATION
    const botToken = "8749837452:AAF_TCGDTvgK4bLXBIoM4eQLjxv27Rxcksw";
    const chatId = "-5249856765";

    const phone = document.getElementById("customerPhone").value;
    const location = document.getElementById("customerLocation").value;
    const photoFile = document.getElementById("customerPhoto")?.files[0];

    // 1. Build the list text loop for Telegram
    let itemsText = "";
    let totalCost = 0;

    cart.forEach((item) => {
      const cost = item.price * item.qty;
      totalCost += cost;
      itemsText += `☕ ${item.qty}x *${item.name}* (${item.sugar || "100%"}) - $${cost.toFixed(2)}\n`;
    });

    // 2. Create the Telegram text string
    const message =
      `🚨 *NEW COFFEE ORDER* 🚨\n\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Location:* ${location}\n\n` +
      `🛍️ *Items Ordered:*\n${itemsText}\n` +
      `💰 *Total Bill:* $${totalCost.toFixed(2)}\n` +
      `⏰ *Status:* Preparing...`;

    let telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    };

    // If a photo is attached, use sendPhoto with FormData
    if (photoFile) {
      telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("photo", photoFile);
      formData.append("caption", message);
      formData.append("parse_mode", "Markdown");

      requestOptions = {
        method: "POST",
        body: formData, // Browser sets Content-Type to multipart/form-data automatically
      };
    }

    // 3. Send the entire order to Telegram
    fetch(telegramUrl, requestOptions)
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("coffeeCart");
          // Send total items count and names to the next page
          window.location.href = `success.html?done=true`;
        } else {
          alert("Something went wrong with the connection. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Network error.");
      });
  });
