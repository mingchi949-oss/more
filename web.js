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
  // Create a cool custom modal instead of browser prompts
  const modalOverlay = document.createElement("div");
  modalOverlay.style = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center; z-index: 9999;
  `;

  const modalContent = document.createElement("div");
  modalContent.style = `
    background: #111; border: 1px solid var(--accent); padding: 30px;
    border-radius: 20px; width: 95%; max-width: 450px; text-align: center;
    box-shadow: 0 0 40px rgba(0, 255, 204, 0.2); font-family: 'Inter', sans-serif;
  `;

  modalContent.innerHTML = `
    <h2 style="margin-bottom: 20px; font-size: 1.5rem; color: #fff;">Order ${name}</h2>
    
    <div style="margin-bottom: 20px;">
      <p style="color: #888; margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Sugar Level</p>
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        <button class="sugar-btn" style="padding: 8px 12px; border: 2px solid #333; background: #222; color: #fff; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: bold;">0%</button>
        <button class="sugar-btn" style="padding: 8px 12px; border: 2px solid #333; background: #222; color: #fff; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: bold;">25%</button>
        <button class="sugar-btn" style="padding: 8px 12px; border: 2px solid var(--accent); background: #222; color: #fff; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: bold;">50%</button>
        <button class="sugar-btn" style="padding: 8px 12px; border: 2px solid #333; background: #222; color: #fff; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: bold;">75%</button>
        <button class="sugar-btn" style="padding: 8px 12px; border: 2px solid #333; background: #222; color: #fff; cursor: pointer; border-radius: 12px; transition: 0.3s; font-weight: bold;">100%</button>
      
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <p style="color: #888; margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Quantity</p>
      <input type="number" id="order-qty" value="1" min="1" style="width: 80px; padding: 12px; background: #222; border: 1px solid #333; color: #fff; text-align: center; border-radius: 12px; outline: none; font-size: 1.1rem; font-weight: bold;">
    </div>

    <div style="display: flex; gap: 10px;">
      <button id="cancel-order" style="flex: 1; padding: 14px; background: #222; color: #888; border: 1px solid #333; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: bold;">Cancel</button>
      <button id="confirm-order" style="flex: 1; padding: 14px; background: var(--accent); color: #000; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase;">Add to Cart</button>
    </div>
  `;

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  let selectedSugar = "50%"; // Default selection
  const sugarBtns = modalContent.querySelectorAll(".sugar-btn");
  sugarBtns.forEach(btn => {
    if (btn.innerText === selectedSugar) {
      btn.style.borderColor = "var(--accent)"; // Highlight default
    }
    btn.onclick = () => {
      sugarBtns.forEach(b => b.style.borderColor = "#333"); // Reset all
      btn.style.borderColor = "var(--accent)"; // Highlight selected
      selectedSugar = btn.innerText;
    };
  });

  document.getElementById("cancel-order").onclick = () => modalOverlay.remove();

  document.getElementById("confirm-order").onclick = () => {
    const qty = parseInt(document.getElementById("order-qty").value) || 1;
    
    // --- Fly to Cart Animation ---
    const productCards = document.querySelectorAll('.product-card');
    let sourceImg = null;
    productCards.forEach(card => {
      if (card.querySelector('h1').innerText === name) {
        sourceImg = card.querySelector('img');
      }
    });

    if (sourceImg) {
      const cartIcon = document.querySelector('.fa-shopping-cart');
      const rect = sourceImg.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      const clone = sourceImg.cloneNode();

      Object.assign(clone.style, {
        position: 'fixed',
        zIndex: '10000',
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        transition: 'all 0.8s cubic-bezier(0.42, 0, 0.58, 1)',
        borderRadius: '50%',
        pointerEvents: 'none'
      });
      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        Object.assign(clone.style, {
          top: cartRect.top + 'px',
          left: cartRect.left + 'px',
          width: '20px',
          height: '20px',
          opacity: '0',
          transform: 'rotate(360deg)'
        });
      });

      setTimeout(() => {
        clone.remove();
        const cartBtn = cartIcon.closest('.social-icon');
        cartBtn.classList.add('cart-pop');
        setTimeout(() => cartBtn.classList.remove('cart-pop'), 300);
      }, 800);
    }

    const existingItem = cart.find(item => item.name === name && item.sugar === selectedSugar);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.push({ name, price, qty, sugar: selectedSugar });
    }

    localStorage.setItem("coffeeCart", JSON.stringify(cart));
    updateBadge();
    modalOverlay.remove();
    console.log(`%c Added ${qty}x ${name} to cart!`, "color: #00ffcc; font-weight: bold;");
  };
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
