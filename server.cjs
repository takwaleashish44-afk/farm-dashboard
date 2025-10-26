const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// allow cross-origin socket connections (Dealer on 5173)
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));

let inventory = [
  { id: "t1", name: "Tomatoes", qty: 100, price: 30, harvest: "2025-10-10", photo: "" },
  { id: "o1", name: "Onions", qty: 80, price: 25, harvest: "2025-10-10", photo: "" }
];

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // debug: log any incoming event
  socket.onAny((ev, p) => console.log("Server any event", socket.id, ev, p));

  socket.on("join", (role) => {
    console.log(`Client ${socket.id} joined as:`, role);
    socket.emit("inventory:init", inventory);
  });

  socket.on("inventory:update", (item, ack) => {
    console.log("inventory:update received from", socket.id, item);

    inventory.push({
      id: `i${Date.now()}`,
      name: item.name || "",
      qty: typeof item.qty === "number" ? item.qty : Number(item.qty) || 0,
      price: typeof item.price === "number" ? item.price : Number(item.price) || 0,
      harvest: item.harvest || item.harvestDate || new Date().toISOString(),
      photo: item.photo || ""
    });

    console.log("Broadcasting inventory:changed, length=", inventory.length);
    io.emit("inventory:changed", inventory);

    if (typeof ack === "function") ack({ ok: true, length: inventory.length });
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Realtime server listening on http://localhost:${PORT}`));