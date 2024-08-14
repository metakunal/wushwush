import { LineChart } from "@mui/x-charts";
import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import "./css/bonds.css"; // Import the custom CSS file
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import tickerMap from "./tickerMap";

export default function Bonds() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("https://mocki.io/v1/359952f4-e95e-4a5c-8393-955a6935d7c7")
      .then((response) => response.json())
      .then((data) => {
        const stocksData = data.filter(
          (asset) => asset.assetClass.toLowerCase() === "bonds"
        );
        setStocks(stocksData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const scrollRight = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: clientWidth,
        behavior: "smooth",
      });
      if (containerRef.current.scrollLeft + clientWidth >= scrollWidth) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  const handleCardClick = (name) => {
    console.log("Clicked " + name);
    setSelectedStock(name);

    // Filter tickerMap based on selected stock
    const stockData = tickerMap[name] || { dates: [], prices: [] };
    setDate(stockData.dates);
    setPrice(stockData.prices);
  };

  // Prepare data for LineChart
  const chartData = date.map((d, i) => ({
    date: new Date(d).toISOString().split("T")[0],
    price: price[i],
  }));

  return (
    <>
      <TopNavbar />
      <div className="stocks-page">
        <Sidebar />
        <div className="main-content">
          <Container fluid className="scrollable-cards" ref={containerRef}>
            {stocks.map((stock, index) => (
              <Card
                key={index}
                className="stock-card"
                onClick={() => handleCardClick(stock.instrumentName)}
              >
                <Card.Body>
                  <Card.Title>{stock.instrumentName}</Card.Title>
                  <Card.Text>{stock.currentPrice}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Container>
          <Button className="scroll-button" onClick={scrollRight}>
            <box-icon name="chevron-right" size="md"></box-icon>
          </Button>
          <hr />
          <div className="chart-container">
            {selectedStock && chartData.length > 0 && (
              <LineChart
                data={chartData}
                xField="date"
                yField="price"
                series={[{ type: "line", dataKey: "price" }]}
                xAxis={{ title: "Date", type: "datetime" }}
                yAxis={{ title: "Price" }}
                tooltip={{ formatter: (value) => `${value.price}` }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
