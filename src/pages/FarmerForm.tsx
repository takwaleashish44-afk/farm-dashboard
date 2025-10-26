import React, { useState, useRef, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import { io, Socket } from "socket.io-client";

export default function FarmerForm() {
  const [form, setForm] = useState({ name: "", quantity: "", price: "", harvestDate: "" });
  const [status, setStatus] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // use 127.0.0.1 to avoid potential localhost resolution quirks in dev
    socketRef.current = io("http://127.0.0.1:3000", { transports: ["websocket"] });

    socketRef.current.on("connect", () =>
      console.log("Farmer socket connected", socketRef.current?.id)
    );

    socketRef.current.on("inventory:changed", (data) => {
      console.log("Farmer received inventory:changed", data);
    });

    socketRef.current.on("connect_error", (err) =>
      console.error("Farmer socket connect_error", err)
    );

    // optional: log any event for debugging
    socketRef.current.onAny((ev, p) => console.log("Farmer any event", ev, p));

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    const payload = {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price),
      harvestDate: form.harvestDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:4001/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();

      setStatus("Submitted successfully");
      setForm({ name: "", quantity: "", price: "", harvestDate: "" });

      // emit with server-expected keys and request ack
      socketRef.current?.emit(
        "inventory:update",
        {
          name: payload.name,
          qty: payload.quantity,
          price: payload.price,
          harvest: payload.harvestDate,
          photo: ""
        },
        (ack: any) => console.log("inventory:update ack", ack)
      );

      console.log("Farmer publish payload:", payload, "serverResp:", json);
    } catch (err) {
      console.error("Publish failed", err);
      setStatus("Submit failed");
    }
  };

  return (
    <div>
      <HeroSection />
      <section style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
        <h2>Add your farm's crop details</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Crop name (e.g., Tomato)"
            required
          />
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity (kg)" required />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price per kg (₹)" required />
          <input name="harvestDate" value={form.harvestDate} onChange={handleChange} type="date" />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="primary">
              Submit Details
            </button>
            <div style={{ alignSelf: "center" }}>{status}</div>
          </div>
        </form>
      </section>
    </div>
  );
}