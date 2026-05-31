console.log("ShadowGuard Loaded");

const BACKEND_URL = "http://localhost:8080/api/scan";

let lastValue = "";

let timeout = null;

let isBlocked = false;

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

function toggleSendButton(disabled) {

  const buttons =
    document.querySelectorAll("button");

  buttons.forEach(button => {

    const label =
      (button.innerText || "").toLowerCase();

    const aria =
      (button.getAttribute("aria-label") || "").toLowerCase();

    if (
      label.includes("send") ||
      label.includes("submit") ||
      aria.includes("send") ||
      aria.includes("submit")
    ) {

      // button.disabled = disabled;
      if (disabled) {

  button.setAttribute("disabled", "true");

  button.style.pointerEvents = "none";

  button.onclick = (e) => {

    e.preventDefault();

    e.stopPropagation();

    return false;
  };

} else {

  button.removeAttribute("disabled");

  button.style.pointerEvents = "auto";

  button.onclick = null;
}

      button.style.opacity =
        disabled ? "0.5" : "1";

      button.style.cursor =
        disabled ? "not-allowed" : "pointer";
        button.style.pointerEvents =
  disabled ? "none" : "auto";

    }

  });
}

function handleResult(result) {

  if (result.verdict === "BLOCKED") {

    isBlocked = true;

    createBanner(
      result.topReasons.join(", "),
      "blocked"
    );

    toggleSendButton(true);

  } else if (result.verdict === "WARNING") {

    isBlocked = false;

    createBanner(
      result.topReasons.join(", "),
      "warning"
    );

    toggleSendButton(false);

  } else {

    isBlocked = false;

    removeBanner();

    toggleSendButton(false);

  }
}

function detectInput() {

  const editor =
    document.querySelector('[contenteditable="true"]') ||
    document.querySelector("textarea");

  if (!editor) {

    removeBanner();

    return;
  }

  const text =
    (editor.innerText || editor.value || "").trim();

  if (!text || text.length < 5) {

    removeBanner();

    lastValue = "";

    isBlocked = false;

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

    }, 200);
  }
}

setInterval(detectInput, 300);

document.addEventListener("input", () => {

  detectInput();

});
document.addEventListener("keydown", (e) => {

  if (
    isBlocked &&
    (
      e.key === "Enter" ||
      e.keyCode === 13
    )
  ) {

    e.preventDefault();

    e.stopImmediatePropagation();

    e.stopPropagation();

    return false;

  }

}, true);

document.addEventListener("submit", (e) => {

  if (isBlocked) {

    e.preventDefault();

    e.stopImmediatePropagation();

    e.stopPropagation();

    return false;

  }

}, true);

// document.addEventListener("keydown", (e) => {

//   if (isBlocked && e.key === "Enter") {

//     e.preventDefault();

//     e.stopPropagation();

//     return false;

//   }

// }, true);

// console.log("ShadowGuard Loaded");

// const BACKEND_URL = "http://localhost:8080/api/scan";

// let lastValue = "";

// let timeout = null;

// function createBanner(message, type = "warning") {

//   removeBanner();

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

// // function toggleSendButton(disabled) {

// //   const sendButton =
// //     document.querySelector('button[data-testid="send-button"]');

// //   if (sendButton) {

// //     sendButton.disabled = disabled;

// //     sendButton.style.opacity =
// //       disabled ? "0.5" : "1";

// //     sendButton.style.cursor =
// //       disabled ? "not-allowed" : "pointer";

// //   }
// // }
// function toggleSendButton(disabled) {

//   const buttons =
//     document.querySelectorAll("button");

//   buttons.forEach(button => {

//     const label =
//       button.innerText.toLowerCase();

//     const aria =
//       button.getAttribute("aria-label") || "";

//     if (
//       label.includes("send") ||
//       aria.toLowerCase().includes("send")
//     ) {

//       button.disabled = disabled;

//       button.style.opacity =
//         disabled ? "0.5" : "1";

//       button.style.cursor =
//         disabled ? "not-allowed" : "pointer";

//     }

//   });
// }

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
//     document.querySelector('[contenteditable="true"]')||
//     document.querySelector('textarea');

//   if (!editor) {

//     removeBanner();

//     return;
//   }

//   const text = editor.innerText.trim();

//   if (!text || text.length < 5) {

//     removeBanner();

//     lastValue = "";

//     toggleSendButton(false);

//     return;
//   }

//   if (text !== lastValue) {

//     lastValue = text;

//     clearTimeout(timeout);

//     timeout = setTimeout(() => {

//       fetch(BACKEND_URL, {

//         method: "POST",

//         headers: {
//           "Content-Type": "application/json"
//         },

//         body: JSON.stringify({
//           text: text
//         })

//       })

//       .then(response => response.json())

//       .then(result => {

//         console.log(result);

//         handleResult(result);

//       })

//       .catch(error => {

//         console.error(
//           "ShadowGuard Backend Error:",
//           error
//         );

//       });

//     }, 200);
//   }
// }
// setInterval(detectInput, 300);

// document.addEventListener("input", () => {

//   detectInput();

// });