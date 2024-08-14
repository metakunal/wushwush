import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "../App.css";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function TradeFlowBook() {
  const [tradeFlow, setTradeFlow] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://citipunelinux65.neueda.com:8100/viewbook/orderbook"
        );
        const data = await response.json();
        setTradeFlow(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div>
          {/* Order Book Component */}

          <div style={{ padding: "1rem", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "normal",
                marginBottom: "1rem",
              }}
            >
              Tradeflow Book
            </h1>
            {tradeFlow.map((trade, index) => (
              <Card
                style={{
                  width: "75vw",
                  margin: "1rem auto",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  backgroundColor:
                    trade.action === "BUY" ? "#eafaf1" : "#f8d7da", // normal green background
                }}
              >
                <Card.Body>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <box-icon
                      type="solid"
                      name={
                        trade.action === "BUY"
                          ? "right-top-arrow-circle"
                          : "right-down-arrow-circle"
                      }
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginRight: "0.5rem",
                        color: "#28a745",
                      }}
                    ></box-icon>
                    <div style={{ textAlign: "left", flex: "1" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "1.2rem", fontWeight: "400" }}>
                          {trade.ticker}
                        </span>
                        <span
                          style={{
                            backgroundColor:
                              trade.action === "BUY"
                                ? "#d4edda"
                                : "rgb(235 154 162 / 34%)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "5px",
                            color:
                              trade.action === "BUY" ? "#155724" : "#721c24",
                            fontWeight: "normal",
                            marginLeft: "1rem",
                          }}
                        >
                          #{38971985 + trade.no}
                        </span>
                      </div>
                      <div style={{ fontSize: "1rem", color: "#555" }}>
                        Asset Class: {trade.asset_class} Qty: {trade.volume}{" "}
                        Price: ${trade.amount}/share Date: {trade.datePurchased}
                      </div>
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "normal" }}>
                      {trade.action}:{" "}
                      <strong>
                        ${(trade.amount * trade.volume).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
