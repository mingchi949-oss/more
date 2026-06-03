// Configuration - matching weborder.js
const botToken = "8749837452:AAF_TCGDTvgK4bLXBIoM4eQLjxv27Rxcksw";
const urlParams = new URLSearchParams(window.location.search);
const phone = urlParams.get("phone");
const summary = urlParams.get("summary");

let isProcessed = false;

function checkConfirmation() {
  if (!phone || isProcessed) {
    console.log("checkConfirmation: Phone not available or already processed.");
    return;
  }

  // Use a cache-busting timestamp and larger limit to ensure we see the click immediately
  fetch(
    `https://api.telegram.org/bot${botToken}/getUpdates?limit=100&ts=${Date.now()}`,
    {
      cache: "no-store",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.ok && data.result.length > 0) {
        // Search for a button click (callback_query) that matches this order's phone number
        const isConfirmed = data.result.some((update) => {
          if (!update.callback_query) return false;
          // Only look for callback queries (button clicks)
          const callbackData = update.callback_query?.data || "";
          const isButtonMatch = callbackData === `confirm_${phone}`;
          return isButtonMatch;
        });

        if (isConfirmed) {
          isProcessed = true;
          console.log("Confirmation found! Redirecting...");
          // Redirect directly to the next.html page, which will display the confirmation
          window.location.href = `next.html?phone=${encodeURIComponent(phone)}&summary=${encodeURIComponent(summary)}`;
        }
      }
    })
    .catch((error) => {
      console.error("Telegram API Error:", error);
    });
}

// Check frequently for a near-instant response (1 second polling)
checkConfirmation();
setInterval(checkConfirmation, 10000);
