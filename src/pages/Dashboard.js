import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import React, { useEffect, useState } from "react";
import "../App.css"; // Ensure this path is correct
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Dashboard() {
  const [stocks,setStocks] = useState([]);
  const [bonds,setBonds] = useState([]);
  const [asset, setAsset] = useState([]);
  const [realizedpnl, setRealizedpnl] = useState();
let counter =0;

  const fetchData = async () => {
    console.log("called")
    try {
      // Define the API endpoints
      const urls = [
        'http://localhost:8081/assets/stocks',
        'http://localhost:8081/assets/bonds',
        'http://localhost:8081/viewbook/cashflow',
        'http://localhost:8081/assets',
      ];

      // Fetch all URLs in parallel
      const responses = await Promise.all(urls.map(url => fetch(url)));
      
      // Check if all responses are successful
      const data = await Promise.all(responses.map(response => {
        if (!response.ok) {
          console.log(counter++)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }));

      // Set state with the fetched data
      setStocks(data[0]); // Assuming the first URL corresponds to tradeFlow
      setBonds(data[1]); // Assuming the second URL corresponds to stockData
      setRealizedpnl(data[2]);
      setAsset(data[3]); // Assuming the second URL corresponds to stockData
      // Handle additional data from more URLs as needed
      console.log(asset);

    } catch (error) {
      console.error('Error fetching data:', error);
     
    }
  };

  useEffect(() => {
    fetchData();
   
  }, []);


  const stockData = stocks.map((stock, index) => ({
    id: stock.instrumentName,  // Unique identifier for each item
    value: stock.currentPrice * stock.volume,
    label: stock.instrumentName
  }));
  const bondData = bonds.map((bond, index) => ({
    id: bond.instrumentName,  // Unique identifier for each item
    value: bond.currentPrice * bond.volume,
    
    label: bond.instrumentName
  }));

  console.log(stockData);
  console.log(bondData);

  const assets = [
    { name: 'Asset A', quantity: 100, price: 50, value: 5000 },
    { name: 'Asset B', quantity: 200, price: 75, value: 15000 },
    { name: 'Asset C', quantity: 150, price: 30, value: 4500 },
    { name: 'Asset D', quantity: 300, price: 90, value: 27000 },
    { name: 'Asset E', quantity: 50, price: 100, value: 5000 },
    { name: 'Asset F', quantity: 80, price: 60, value: 4800 },
    { name: 'Asset G', quantity: 120, price: 55, value: 6600 },
    { name: 'Asset H', quantity: 60, price: 85, value: 5100 },
    // More assets can be added here
  ];

  const realizedProfitLoss = 1200; // Example value

  return (
    <>
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ width: "100%", padding: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: stockData,
                  },
                ]}
                width={300}
                height={150}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: bondData,
                  },
                ]}
                width={400}
                height={150}
              />
            </div>
            <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "350px",
          width: "100%",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          padding: "5px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h5 style={{ marginBottom: "10px" }}>Realized Profit/Loss</h5>
        <h6 style={{ margin: "10px 0" }}>{`$${realizedProfitLoss}`}</h6>
        <h6 style={{ margin: "10px 0" }}>Your investments: $20,000</h6>
        <h6 style={{ margin: "10px 0" }}>Total Portfolio: $25,000</h6>
        <h6 style={{ margin: "10px 0" }}>Total Portfolio: $25,000</h6>
      </div>
    </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <h3>Assets</h3>
              <div
                style={{
                  maxHeight: "250px", // Adjust as needed
                  overflowY: "auto",
                }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Assetclass</th>
                      <th>Volume</th>
                      <th>Bought Price</th>
                      <th>PNL</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asset.map((asset, index) => (
                      <tr key={index}>
                        <td>{asset.instrumentName}</td>
                        <td>{asset.assetClass}</td>
                        <td>{asset.volume}</td>
                        <td>{asset.boughtPrice}</td>
                        <td>{(asset.pnl * asset.volume).toFixed(2)}</td>
                        <td>{(asset.currentPrice * asset.volume).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <BarChart
                series={[
                  { data: [30000, 5000], stack: 'A', label: 'Invested' },
                  { data: [5000, 7000], stack: 'A', label: 'Profit' },
                  
                ]}
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
