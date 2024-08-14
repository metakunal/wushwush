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

export default function AllBonds() {
  const [selectedBond, setSelectedStock] = useState(null); // State to store selected stock name
  const [bondData, setBondData] = useState([]); // State to store fetched stock data
  const [bondInfo, setBondInfo] = useState(null); // State to store stock overview data
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [allBonds, setAllBonds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://citipunelinux65.neueda.com:8100/bonds"
        );
        const data = await response.json();
        setAllBonds(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
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

  const handleCardClick = async (name) => {
    setSelectedStock(name);
    try {
      // Fetch time series data
      const timeSeriesResponse = await fetch(
        `http://localhost:8081/bondprices`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      setBondData(timeSeriesData);
      const filteredData = timeSeriesData.filter(
        (item) => item.tickerSymbol === name
      );
      console.log(filteredData);

      // Fetch stock overview data
      const overviewResponse = await fetch(`http://localhost:8081/bonds`);
      const overviewData = await overviewResponse.json();
      setBondInfo(overviewData);
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

        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  return (
    <>
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, position: "relative" }}>
          {/* Order Book Component */}
          <Container fluid className="scrollable-cards" ref={containerRef}>
            {allBonds.map((stock, index) => (
              <Card
                key={index}
                style={{ width: "10rem", margin: "0.5rem" }}
                onClick={() => handleCardClick(stock.tickerSymbol)} // Handle card click
              >
                <Card.Body>
                  <Card.Title>{stock.tickerSymbol}</Card.Title>
                  <Card.Text>{stock.bondPrice}</Card.Text>
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
          {selectedBond && bondData.length > 0 && (
            <div style={{ display: "flex", margin: "1rem 0" }}>
              <LineChart
                dataset={bondData}
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
                  <Card.Title>{selectedBond}</Card.Title>
                  {bondInfo && (
                    <>
                      <Card.Text>Ticker: {bondInfo.tickerSymbol}</Card.Text>
                      <Card.Text>Issuer: {bondInfo.issuer}</Card.Text>
                      <Card.Text>Face Value: {bondInfo.faceValue}</Card.Text>
                      <Card.Text>
                        Maturity date: {bondInfo.maturaityDate}
                      </Card.Text>
                      <Card.Text>Price: {bondInfo.bondPrice}</Card.Text>
                      <Card.Text>
                        Credit Rating: {bondInfo.creditRating}
                      </Card.Text>

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
