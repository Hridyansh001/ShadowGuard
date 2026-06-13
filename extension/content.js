console.log("ShadowGuard Loaded");

const BACKEND_URL = "http://localhost:8080/api/scan";

let lastValue = "";

let timeout = null;

let isBlocked = false;

let overrideOption= false;

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
function showOverrideMethod(result)
{
  const existing = document.getElementById("shadowguard-modal");
  if(existing)
  {
    return;
  }
  const modal = document.createElement("div");
  modal.id= "shadowguard-modal";
  modal.innerHTML=`
  <div style= "position : fixed;
  top: 50%;

      left: 50%;

      transform: translate(-50%, -50%);

      background: #111;

      color: white;

      padding: 20px;

      border-radius: 10px;

      border: 2px solid red;

      z-index: 999999;

      width: 400px;
      
  ">
  <h3> High Risk Prompt </h3>
  <p>

        Risk Score: ${result.riskScore}/100

      </p>

      <p>

        ${result.topReasons.join("<br>")}

      </p>
      <button id = "cancel">
      Cancel
      </button>
      <br>
      <button id= "override">
      Send Anyway
      </button>
      </div>
`;
document.body.appendChild(modal);
document.getElementById("cancel")
.onclick=()=>
{
  toggleSendButton(true);
  modal.remove();
};
document.getElementById("override")
.onclick=()=>{
  overrideOption=true;

  //lastValue="";
  isBlocked=false;
  toggleSendButton(false);
  modal.remove();
  removeBanner();
};

}
function handleResult(result) {

  if (result.verdict === "BLOCKED") {
    
    if(overrideOption)
    {
      overrideOption=false;
      return;
    }

    isBlocked = true;

    createBanner(
      result.topReasons.join(", "),
      "blocked"
    );

    toggleSendButton(true);
    showOverrideMethod(result);

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

    // removeBanner();

    // lastValue = "";

    // isBlocked = false;

    // toggleSendButton(false);
    removeBanner();

    lastValue = "";

    isBlocked = false;

    overrideOption = false;

    const modal =

      document.getElementById("shadowguard-modal");

    if (modal) {

      modal.remove();

    }

    toggleSendButton(false);

    return;

    return;
  }

  if (text !== lastValue) {

    // overrideOption=false;
    // if (!text.startsWith(lastValue)) {

    //     overrideOption = false;

    // }

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