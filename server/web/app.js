const authStatus = document.getElementById("auth-status");
const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const userStatus = document.getElementById("user-status");
const profileList = document.getElementById("profile-list");
const approvalsList = document.getElementById("approvals-list");
const chatWindow = document.getElementById("chat-window");

let wsChat = null;
let currentConversationId = null;

function getToken() {
  return localStorage.getItem("agent_token");
}

function setToken(token) {
  localStorage.setItem("agent_token", token);
}

function clearToken() {
  localStorage.removeItem("agent_token");
}

function showDashboard() {
  authSection.classList.add("hidden");
  dashboard.classList.remove("hidden");
  userStatus.textContent = "Logged in";
  loadProfiles();
  refreshApprovals();
  connectChat();
}

function showAuth() {
  authSection.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

async function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    setToken(data.token);
    authStatus.textContent = "Registered and logged in.";
    showDashboard();
  } else {
    authStatus.textContent = data.detail || "Registration failed";
  }
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    setToken(data.token);
    authStatus.textContent = "Logged in.";
    showDashboard();
  } else {
    authStatus.textContent = data.detail || "Login failed";
  }
}

async function loadProfiles() {
  const token = getToken();
  const response = await fetch(`/api/llm_profiles?token=${token}`);
  const data = await response.json();
  profileList.innerHTML = "";
  data.forEach((profile) => {
    const item = document.createElement("li");
    item.innerHTML = `${profile.name} (${profile.provider}) - ${profile.model} ${
      profile.is_active ? "<strong>[active]</strong>" : ""
    }`;
    const activateBtn = document.createElement("button");
    activateBtn.textContent = "Activate";
    activateBtn.classList.add("secondary");
    activateBtn.addEventListener("click", () => activateProfile(profile.id));
    item.appendChild(activateBtn);
    profileList.appendChild(item);
  });
}

async function saveProfile() {
  const token = getToken();
  const payload = {
    name: document.getElementById("profile-name").value,
    provider: document.getElementById("profile-provider").value,
    base_url: document.getElementById("profile-base-url").value,
    model: document.getElementById("profile-model").value,
    api_key: document.getElementById("profile-api-key").value,
    set_active: document.getElementById("profile-active").checked,
  };
  const response = await fetch(`/api/llm_profiles?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    loadProfiles();
  }
}

async function activateProfile(profileId) {
  const token = getToken();
  await fetch(`/api/llm_profiles/${profileId}/activate?token=${token}`, {
    method: "POST",
  });
  loadProfiles();
}

async function createPairingCode() {
  const token = getToken();
  const response = await fetch(`/api/pairing_code?token=${token}`, { method: "POST" });
  const data = await response.json();
  const pairingDetails = document.getElementById("pairing-details");
  pairingDetails.innerHTML = `
    <p><strong>Pairing Code:</strong> ${data.pairing_code}</p>
    <p><strong>Device ID:</strong> ${data.device_id}</p>
    <p><strong>Token:</strong> ${data.token}</p>
    <p><strong>QR Content:</strong> ${data.qr_content}</p>
  `;
}

async function refreshApprovals() {
  const token = getToken();
  const response = await fetch(`/api/approvals?token=${token}`);
  const data = await response.json();
  approvalsList.innerHTML = "";
  data.forEach((approval) => {
    const item = document.createElement("li");
    item.textContent = `${approval.tool_name} on device ${approval.device_id}`;
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.addEventListener("click", () => approveRequest(approval.id));
    item.appendChild(approveBtn);
    approvalsList.appendChild(item);
  });
}

async function approveRequest(approvalId) {
  const token = getToken();
  await fetch(`/api/approvals/${approvalId}/approve?token=${token}`, { method: "POST" });
  refreshApprovals();
}

function connectChat() {
  const token = getToken();
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  wsChat = new WebSocket(`${protocol}://${window.location.host}/ws/chat?token=${token}`);
  wsChat.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.error) {
      appendChat("system", data.error);
      return;
    }
    if (data.conversation_id) {
      currentConversationId = data.conversation_id;
    }
    if (data.chunk) {
      appendChat("assistant", data.chunk, true);
    }
  };
}

function appendChat(role, text, streaming = false) {
  if (streaming) {
    const last = chatWindow.lastElementChild;
    if (last && last.dataset.role === role && last.dataset.streaming === "true") {
      last.textContent += text;
      return;
    }
  }
  const message = document.createElement("div");
  message.dataset.role = role;
  message.dataset.streaming = streaming ? "true" : "false";
  message.textContent = `${role}: ${text}`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendChat() {
  const input = document.getElementById("chat-message");
  const content = input.value;
  if (!content) return;
  appendChat("user", content);
  wsChat.send(
    JSON.stringify({
      content,
      conversation_id: currentConversationId,
    })
  );
  input.value = "";
}

function init() {
  document.getElementById("register-btn").addEventListener("click", register);
  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearToken();
    location.reload();
  });
  document.getElementById("profile-save").addEventListener("click", saveProfile);
  document.getElementById("pair-device").addEventListener("click", createPairingCode);
  document.getElementById("refresh-approvals").addEventListener("click", refreshApprovals);
  document.getElementById("send-chat").addEventListener("click", sendChat);

  if (getToken()) {
    showDashboard();
  }
}

init();
