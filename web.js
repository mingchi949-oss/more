function searchBrandsAll() {
  // 1. Get what the customer is typing right now
  const searchInput = document
    .getElementById("brandSearch")
    .value.toLowerCase()
    .trim();

  // Show/Hide the 'x' button in search bar
  const clearBtn = document.getElementById("clear-search-btn");
  if (clearBtn) clearBtn.style.display = searchInput ? "block" : "none";

  // 1. Sidebar Category Filtering: Highlights/Hides the category buttons
  const container = document.getElementById("brand-list-container");
  const items = container.getElementsByClassName("brand-item");

  for (let i = 0; i < items.length; i++) {
    const text = items[i].textContent || items[i].innerText;
    if (text.toLowerCase().includes(searchInput)) {
      items[i].style.display = ""; // Keep button visible
    } else {
      items[i].style.display = "none"; // Hide button if user types something else
    }
  }

  // 2. Product Gallery Filtering: Hide/Show items based on search input
  const products = document.getElementsByClassName("moto-gallery");
  for (let i = 0; i < products.length; i++) {
    const title = products[i].querySelector("h1");
    if (title) {
      const text = title.textContent || title.innerText;
      products[i].style.display = text.toLowerCase().includes(searchInput)
        ? ""
        : "none";
    }
  }
}

// Helper function to set the search input and trigger the filter
function setSearchAndFilter(brand) {
  document.getElementById("brandSearch").value = brand;
  searchBrandsAll();
}

// Function to clear the search input and reset filters
function clearSearch() {
  document.getElementById("brandSearch").value = "";
  searchBrandsAll();
}

function toggleSocials() {
  document.getElementById("socialLinks").classList.toggle("show");
}

let cart = JSON.parse(localStorage.getItem("coffeeCart")) || [];

function updateBadge() {
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = totalQty;
}
updateBadge();

function addToOrder(name, price) {
  const sugar = prompt(
    "How much sugar would you like? (e.g., 0%, 50%, 100%)",
    "100%",
  );
  if (sugar === null) return; // User clicked Cancel

  const qtyStr = prompt(`How many ${name} would you like?`, "1");
  if (qtyStr === null) return;
  const qty = parseInt(qtyStr) || 1;

  // Check if item with same sugar level exists to update quantity
  const existingItem = cart.find(
    (item) => item.name === name && item.sugar === sugar,
  );
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ name, price, qty, sugar });
  }

  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateBadge();
  alert(`${qty}x ${name} added to cart! Click the cart icon to checkout.`);
}

function updateCartUI() {
  document.getElementById("cart-count").innerText = cart.length;
  const itemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  let html = "";
  let total = 0; // Initialize total to 0
  if (cart.length > 0) {
    cart.forEach((item, index) => {
      html += `
        <div class="cart-item-row">
          <p>${item.name} (${item.sugar} sugar) - $${item.price.toFixed(2)}</p>
          <button class="remove-item-btn" onclick="removeItem(${index})">x</button>
        </div>
      `;
      total += item.price;
    });
  }
  itemsContainer.innerHTML = html || "<p>Your cart is empty.</p>";
  totalElement.innerText = total.toFixed(2);
}

function showCart() {
  document.getElementById("cart-modal").style.display = "flex";
  updateCartUI();
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// Close the menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function removeItem(index) {
  cart.splice(index, 1); // Remove 1 item at the given index
  updateCartUI(); // Refresh the cart display
}

function checkout() {
  if (cart.length === 0) return alert("Your cart is empty!");

  let whatsappMessage = "New Order from Website:%0A";
  let telegramMessageContent = "New Order from Website:\n"; // Using \n for Telegram
  let total = 0;

  cart.forEach((item) => {
    const itemDetails = `- ${item.name} (${item.sugar} sugar) ($${item.price.toFixed(2)})`;
    whatsappMessage += itemDetails + "%0A";
    telegramMessageContent += itemDetails + "\n"; // Append to Telegram message
    total += item.price;
    // Logs order details to your private backend database
    trackOrder(item.name, item.price);
  });

  // Send to Admin's private WhatsApp
  window.open(
    `https://wa.me/85512345678?text=${whatsappMessage}%0ATotal: $${total.toFixed(2)}`,
    "_blank",
  );

  // Send to Telegram Bot (via your backend)
  sendOrderToTelegram(telegramMessageContent, total);

  // Immediately clear the cart and UI to keep order details private
  cart = [];
  updateCartUI();
  closeCart();
}

function sendOrderToTelegram(messageContent, orderTotal) {
  // This function sends the order details to your backend, which then forwards it to Telegram.
  // Your backend endpoint (/api/send-telegram-message) needs to be implemented.
  const fullMessage = messageContent + `Total: $${orderTotal.toFixed(2)}`;
  fetch("/api/send-telegram-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: fullMessage }),
  })
    .then((response) =>
      response.ok
        ? console.log("Order sent to Telegram bot successfully!")
        : console.error("Failed to send order to Telegram bot."),
    )
    .catch((error) =>
      console.error("Error sending order to Telegram bot:", error),
    );
}

function openGallery() {
  document.getElementById("lightbox").style.display = "flex";

  currentXP += 10;

  document.getElementById("xp-display").innerText = currentXP;

  let percentage = (currentXP / 1000) * 100;
  document.querySelector(".xp-bar-fill").style.width = percentage + "%";
}
function swap(imgSrc) {
  document.getElementById("currentView").src = imgSrc;

  const main = document.getElementById("currentView");
  main.style.opacity = 0;
  setTimeout(() => {
    main.style.opacity = 1;
  }, 50);
}
