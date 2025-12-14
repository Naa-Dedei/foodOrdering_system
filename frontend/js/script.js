function setStatus(el, message, type) {
  el.textContent = message || "";
  el.classList.remove("success", "error");
  if (type) el.classList.add(type);
}

function formatMoneyUSDFromCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getApiBase() {
  if (window.__API_BASE__) return String(window.__API_BASE__);

  const { hostname, port } = window.location;

  // If running locally on any non-backend port (e.g., VS Code Live Server 5500/5501/etc),
  // call the backend on port 3000.
  if ((hostname === "localhost" || hostname === "127.0.0.1") && port && port !== "3000") {
    return "http://localhost:3000";
  }

  return "";
}

function getApiCandidates() {
  const renderUrl = (window.__API_BASE__ && String(window.__API_BASE__).trim()) || "https://foodordering-system-m85g.onrender.com";
  const localUrl = "http://localhost:3000";
  // Prefer Render, then local as fallback
  return [renderUrl, localUrl];
}

async function apiFetch(path, options = {}) {
  const candidates = getApiCandidates();

  // Try each candidate in order until we get a successful (2xx) response.
  // If we get a client error (4xx), do not fall back.
  let lastErr = null;
  for (const base of candidates) {
    const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      // If client error, throw and do not try next backend
      if (res.status >= 400 && res.status < 500) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.error || `Request failed (${res.status})`);
        err.status = res.status;
        throw err;
      }
      // Server error, try next candidate
      lastErr = new Error(`Server error (${res.status})`);
    } catch (err) {
      // Network error or our thrown client error
      lastErr = err;
      // If client error, rethrow immediately to caller
      if (err?.status && err.status >= 400 && err.status < 500) throw err;
      // Otherwise try next candidate
    }
  }

  throw lastErr || new Error("Network error");
}

async function fetchMenu() {
  const res = await apiFetch(`/api/menu`);
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

function menuFromDom() {
  const nodes = document.querySelectorAll("#menu .menu-item");
  const items = [];
  for (const node of nodes) {
    const id = node.getAttribute("data-id");
    const name = node.querySelector("h3")?.textContent?.trim();
    const priceCentsRaw = node.getAttribute("data-price-cents");
    const priceCents = Number(priceCentsRaw);
    if (!id || !name || !Number.isFinite(priceCents)) continue;
    items.push({ id, name, priceCents });
  }
  return items;
}

function populateItemSelect(selectEl, items) {
  // Keep the first placeholder option, remove the rest
  while (selectEl.options.length > 1) selectEl.remove(1);

  for (const item of items) {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = `${item.name} (${formatMoneyUSDFromCents(item.priceCents)})`;
    selectEl.appendChild(opt);
  }
}

async function submitOrder(payload) {
  const res = await apiFetch(`/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data.error === "string" ? data.error : "Order failed.";
    throw new Error(msg);
  }
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("order-form");
  const statusEl = document.getElementById("order-status");
  const itemSelect = document.getElementById("item");

  if (!form || !statusEl || !itemSelect) return;

  setStatus(statusEl, "Loading menu...", "");
  let menuItems = [];
  try {
    menuItems = await fetchMenu();
    populateItemSelect(itemSelect, menuItems);
    setStatus(statusEl, "", "");
  } catch (e) {
    const fallback = menuFromDom();
    if (fallback.length > 0) {
      populateItemSelect(itemSelect, fallback);
      setStatus(statusEl, "", "");
    } else {
      setStatus(
        statusEl,
        "Could not load menu from server. Make sure the backend is running on http://localhost:3000.",
        "error"
      );
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = String(document.getElementById("name")?.value || "").trim();
    const email = String(document.getElementById("email")?.value || "").trim();
    const itemId = String(itemSelect.value || "").trim();
    const quantity = Number(document.getElementById("quantity")?.value);

    if (!name) return setStatus(statusEl, "Please enter your full name.", "error");
    if (!email) return setStatus(statusEl, "Please enter your email address.", "error");
    if (!itemId) return setStatus(statusEl, "Please select an item.", "error");
    if (!Number.isFinite(quantity) || quantity < 1)
      return setStatus(statusEl, "Please enter a quantity of 1 or more.", "error");

    setStatus(statusEl, "Submitting your order...", "");
    try {
      const data = await submitOrder({ name, email, itemId, quantity });
      const order = data.order;
      const unitPrice =
        order?.item?.priceCents != null
          ? formatMoneyUSDFromCents(order.item.priceCents)
          : order?.unitPrice;
      const subtotal =
        order?.subtotalCents != null
          ? formatMoneyUSDFromCents(order.subtotalCents)
          : order?.subtotal;

      setStatus(
        statusEl,
        `Success! ${order?.item?.name || "Order"} x${order?.quantity || quantity} — ${unitPrice || ""} each. Total: ${subtotal || ""}`,
        "success"
      );

      form.reset();
      // keep placeholder selected after reset
      itemSelect.value = "";
    } catch (err) {
      setStatus(statusEl, err?.message || "Order failed.", "error");
    }
  });
});

