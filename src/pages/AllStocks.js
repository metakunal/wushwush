import { LineChart } from "@mui/x-charts";
import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import "./css/allstocks.css"; // Import the custom CSS file
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const stocks = [
  { name: "AAPL", price: "$175.85" },
  { name: "GOOGL", price: "$2804.53" },
  { name: "IBM", price: "$345.12" },
  { name: "AMZN", price: "$3340.09" },
  { name: "TSLA", price: "$248.90" },
  { name: "AAPL", price: "$175.85" },
  { name: "GOOGL", price: "$2804.53" },
  { name: "MSFT", price: "$345.12" },
  { name: "AMZN", price: "$3340.09" },
  { name: "TSLA", price: "$248.90" },
  // Add more stocks as needed
];

export default function AllStocks() {
  const [selectedStock, setSelectedStock] = useState(null); // State to store selected stock name
  const [stockData, setStockData] = useState([]); // State to store fetched stock data
  const [stockInfo, setStockInfo] = useState(null); // State to store stock overview data
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [allStocks, setAllStocks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://citipunelinux65.neueda.com:8100/stocks"
        );
        const data = await response.json();
        setAllStocks(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    // Here you can handle the search input, e.g., navigating to another page or filtering data.
    console.log("Search Query:", searchQuery);

    setSelectedStock(searchQuery);
    try {
      // Fetch time series data
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${searchQuery}&apikey=5ZAGZACTOBA80S1T`
      );
      const timeSeriesData = await timeSeriesResponse.json();

      // Fetch stock overview data
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${searchQuery}&apikey=5ZAGZACTOBA80S1T`
      );
      const overviewData = await overviewResponse.json();

      if (timeSeriesData["Time Series (Daily)"]) {
        const dailyData = timeSeriesData["Time Series (Daily)"];

        // Transform the data for the chart
        const transformedData = Object.entries(dailyData).map(
          ([date, values]) => ({
            date,
            close: parseFloat(values["4. close"]),
          })
        );

        // Trim the data to the latest 20 entries
        const latestData = transformedData.slice(0, 100);

        // Check for NaN or invalid data
        if (latestData.some((item) => isNaN(item.close))) {
          console.error("Invalid data detected:", latestData);
          return;
        }

        setStockData(latestData);
        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }

      // Set the stock overview data
      setStockInfo(overviewData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

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

  const handleCardClick = async (name) => {
    setSelectedStock(name);
    try {
      // Fetch time series data
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${name}&apikey=5ZAGZACTOBA80S1T`
      );
      const timeSeriesData = await timeSeriesResponse.json();

      // Fetch stock overview data
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${name}&apikey=5ZAGZACTOBA80S1T`
      );
      const overviewData = await overviewResponse.json();

      if (timeSeriesData["Time Series (Daily)"]) {
        const dailyData = timeSeriesData["Time Series (Daily)"];

        // Transform the data for the chart
        const transformedData = Object.entries(dailyData).map(
          ([date, values]) => ({
            date,
            close: parseFloat(values["4. close"]),
          })
        );

        // Trim the data to the latest 20 entries
        const latestData = transformedData.slice(0, 100);

        // Check for NaN or invalid data
        if (latestData.some((item) => isNaN(item.close))) {
          console.error("Invalid data detected:", latestData);
          return;
        }

        setStockData(latestData);
        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }

      // Set the stock overview data
      setStockInfo(overviewData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
      <TopNavbar onSearchSubmit={handleSearchSubmit} />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, position: "relative" }}>
          {/* Order Book Component */}
          <Container fluid className="scrollable-cards" ref={containerRef}>
            {allStocks.map((stock, index) => (
              <Card
                key={index}
                style={{ width: "10rem", margin: "0.5rem" }}
                onClick={() => handleCardClick(stock.tickerSymbol)} // Handle card click
              >
                <Card.Body>
                  <Card.Title>{stock.tickerSymbol}</Card.Title>
                  <Card.Text>{stock.currentPrice}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Container>
          <Button
            style={{
              backgroundColor: "#00000029",
              borderRadius: "50%",
              border: "none",
            }}
            className="scroll-button"
            onClick={scrollRight}
          >
            <box-icon name="chevron-right" size="md"></box-icon>
          </Button>
          {selectedStock && stockData.length > 0 && (
            <div style={{ display: "flex", margin: "1rem 0" }}>
              <LineChart
                dataset={stockData}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "date",
                  },
                ]}
                series={[
                  {
                    data: price, // Ensure that price data corresponds to the x-axis range
                  },
                ]}
                height={330}
                width={750}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
              <Card style={{ width: "20%", marginRight: "1rem" }}>
                <Card.Body>
                  <Card.Title>{selectedStock}</Card.Title>
                  {stockInfo && (
                    <>
                      <Card.Text>Name: {stockInfo.Name}</Card.Text>
                      <Card.Text>Exchange: {stockInfo.Exchange}</Card.Text>
                      <Card.Text>EPS: {stockInfo.EPS}</Card.Text>
                      <Card.Text>
                        ProfitMargin: {stockInfo.ProfitMargin}
                      </Card.Text>
                      <Card.Text>
                        52WeekHigh: {stockInfo["52WeekHigh"]}
                      </Card.Text>
                      <Card.Text>52WeekLow: {stockInfo["52WeekLow"]}</Card.Text>

                      {/* Add other stock info fields as needed */}
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
