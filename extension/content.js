// console.log("ShadowGuard Loaded");

// const BACKEND_URL = "http://localhost:8080/api/scan";

// let lastValue = "";

// let timeout = null;

// function createBanner(message, type = "warning") {

//   removeBanner();
//   function toggleSendButton(disabled) {

//   const sendButton =
//     document.querySelector('button[data-testid="send-button"]');

//   if (sendButton) {

//     sendButton.disabled = disabled;

//     sendButton.style.opacity =
//       disabled ? "0.5" : "1";

//     sendButton.style.cursor =
//       disabled ? "not-allowed" : "pointer";

//   }
// }

//   const banner = document.createElement("div");

//   banner.id = "shadowguard-banner";

//   banner.innerHTML = `
//     <strong>
//       ${type === "blocked" ? "🚫" : "⚠️"}
//       ShadowGuard Alert
//     </strong>
//     <br>
//     ${message}
//   `;

//   document.body.appendChild(banner);
// }

// function removeBanner() {

//   const oldBanner =
//     document.getElementById("shadowguard-banner");

//   if (oldBanner) {

//     oldBanner.remove();

//   }
// }

// // function fakeScan(text) {

// //   const lowerText = text.toLowerCase();

// //   if (
// //     lowerText.includes("aadhaar") ||
// //     lowerText.includes("bank") ||
// //     lowerText.includes("ifsc") ||
// //     lowerText.includes("password")
// //   ) {

// //     return {

// //       verdict: "BLOCKED",

// //       topReasons: [
// //         "Sensitive personal or financial data detected"
// //       ]
// //     };
// //   }

// //   if (
// //     lowerText.includes("email") ||
// //     lowerText.includes("phone")
// //   ) {

// //     return {

// //       verdict: "WARNING",

// //       topReasons: [
// //         "Possible personal information detected"
// //       ]
// //     };
// //   }

// //   return {

// //     verdict: "SAFE",

// //     topReasons: []
// //   };
// // }



// // function handleResult(result) {

// //   if (result.verdict === "BLOCKED") {

// //     createBanner(
// //       result.topReasons.join(", "),
// //       "blocked"
// //     );

// //   } else if (result.verdict === "WARNING") {

// //     createBanner(
// //       result.topReasons.join(", "),
// //       "warning"
// //     );

// //   } else {

// //     removeBanner();

// //   }
// // }

// function handleResult(result) {

//   if (result.verdict === "BLOCKED") {

//     createBanner(
//       result.topReasons.join(", "),
//       "blocked"
//     );

//     toggleSendButton(true);

//   } else if (result.verdict === "WARNING") {

//     createBanner(
//       result.topReasons.join(", "),
//       "warning"
//     );

//     toggleSendButton(false);

//   } else {

//     removeBanner();

//     toggleSendButton(false);

//   }
// }
// function detectInput() {

//   const editor =
//     document.querySelector('[contenteditable="true"]');

//   if (!editor) {

//     removeBanner();

//     return;
//   }

//   const text = editor.innerText.trim();

//   if (!text || text.length < 5) {

//     removeBanner();

//     lastValue = "";

//     return;
//   }

//   if (text !== lastValue) {

//     lastValue = text;

//     clearTimeout(timeout);

//     // timeout = setTimeout(() => {

//     //   const result = fakeScan(text);

//     //   handleResult(result);

//     // }, 1000);
//     timeout = setTimeout(() => {

//   fetch(BACKEND_URL, {

//     method: "POST",

//     headers: {
//       "Content-Type": "application/json"
//     },

//     body: JSON.stringify({
//       text: text
//     })

//   })

//   .then(response => response.json())

//   .then(result => {

//     console.log(result);

//     handleResult(result);

//   })

//   .catch(error => {

//     console.error(
//       "ShadowGuard Backend Error:",
//       error
//     );

//   });

// }, 1000);
//   }
// }

// setInterval(detectInput, 1000);

console.log("ShadowGuard Loaded");

const BACKEND_URL = "http://localhost:8080/api/scan";

let lastValue = "";

let timeout = null;

function createBanner(message, type = "warning") {

  removeBanner();

  const banner = document.createElement("div");

  banner.id = "shadowguard-banner";

  banner.innerHTML = `
    <strong>
      ${type === "blocked" ? "🚫" : "⚠️"}
      ShadowGuard Alert
    </strong>
    <br>
    ${message}
  `;

  document.body.appendChild(banner);
}

function removeBanner() {

  const oldBanner =
    document.getElementById("shadowguard-banner");

  if (oldBanner) {

    oldBanner.remove();

  }
}

// function toggleSendButton(disabled) {

//   const sendButton =
//     document.querySelector('button[data-testid="send-button"]');

//   if (sendButton) {

//     sendButton.disabled = disabled;

//     sendButton.style.opacity =
//       disabled ? "0.5" : "1";

//     sendButton.style.cursor =
//       disabled ? "not-allowed" : "pointer";

//   }
// }
function toggleSendButton(disabled) {

  const buttons =
    document.querySelectorAll("button");

  buttons.forEach(button => {

    const label =
      button.innerText.toLowerCase();

    const aria =
      button.getAttribute("aria-label") || "";

    if (
      label.includes("send") ||
      aria.toLowerCase().includes("send")
    ) {

      button.disabled = disabled;

      button.style.opacity =
        disabled ? "0.5" : "1";

      button.style.cursor =
        disabled ? "not-allowed" : "pointer";

    }

  });
}

function handleResult(result) {

  if (result.verdict === "BLOCKED") {

    createBanner(
      result.topReasons.join(", "),
      "blocked"
    );

    toggleSendButton(true);

  } else if (result.verdict === "WARNING") {

    createBanner(
      result.topReasons.join(", "),
      "warning"
    );

    toggleSendButton(false);

  } else {

    removeBanner();

    toggleSendButton(false);

  }
}

function detectInput() {

  const editor =
    document.querySelector('[contenteditable="true"]');

  if (!editor) {

    removeBanner();

    return;
  }

  const text = editor.innerText.trim();

  if (!text || text.length < 5) {

    removeBanner();

    lastValue = "";

    toggleSendButton(false);

    return;
  }

  if (text !== lastValue) {

    lastValue = text;

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      fetch(BACKEND_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: text
        })

      })

      .then(response => response.json())

      .then(result => {

        console.log(result);

        handleResult(result);

      })

      .catch(error => {

        console.error(
          "ShadowGuard Backend Error:",
          error
        );

      });

    }, 1000);
  }
}

setInterval(detectInput, 1000);