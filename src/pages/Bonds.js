import { LineChart } from "@mui/x-charts";
import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import "./css/bonds.css";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import tickerMap from "./tickerMap";
import bondMap from "./bondMap";

export default function Bonds() {
  const [selectedBond, setselectedBond] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("https://mocki.io/v1/dda078b1-0476-4f7a-a973-c25c7acdc667")
      .then((response) => response.json())
      .then((data) => {
        const stocksData = data.filter(
          (asset) => asset.assetClass.toLowerCase() === "bonds"
        );
        setStocks(stocksData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    console.log("Search Query:", searchQuery);
    setselectedBond(searchQuery);
    try {
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${searchQuery}&apikey=7UUCYV026K4IUI4Y`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${searchQuery}&apikey=7UUCYV026K4IUI4Y`
      );
      const overviewData = await overviewResponse.json();

      if (timeSeriesData["Time Series (Daily)"]) {
        const dailyData = timeSeriesData["Time Series (Daily)"];
        const transformedData = Object.entries(dailyData).map(
          ([date, values]) => ({
            date,
            close: parseFloat(values["4. close"]),
          })
        );

        const latestData = transformedData.slice(0, 100);
        if (latestData.some((item) => isNaN(item.close))) {
          console.error("Invalid data detected:", latestData);
          return;
        }

        setStockData(latestData);
        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }

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
    console.log("Clicked" + name);
    setselectedBond(name);
    // Filter tickerMap based on selected stock
    const stockData = tickerMap[name] || { dates: [], prices: [] };
    setDate(stockData.dates);
    setPrice(stockData.prices);
    setStockInfo(bondMap[name]);
  };

  return (
    <>
      <TopNavbar onSearchSubmit={handleSearchSubmit} />
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
          <div className="stock-details">
            <LineChart
              xAxis={[
                {
                  data: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
                    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
                    63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
                    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
                    93, 94, 95, 96,
                  ],
                },
              ]}
              series={[
                {
                  data: price,
                },
              ]}
              height={330}
              width={750}
              margin={{ left: 2, right: 10, top: 30, bottom: 30 }}
              grid={{ vertical: true, horizontal: true }}
            />
            <Card className="stock-overview-card">
              <Card.Body>
                <Card.Title>{selectedBond}</Card.Title>
                {stockInfo && (
                  <>
                    <Card.Text>Issuer: {stockInfo.issuer}</Card.Text>
                    <Card.Text>Coupon Rate: {stockInfo.couponRate}</Card.Text>
                    <Card.Text>Face Value: {stockInfo.faceValue}</Card.Text>
                    <Card.Text>
                      Maturity Data: {stockInfo.maturityDate}
                    </Card.Text>
                    <Card.Text>
                      Credit Rating: {stockInfo.creditRating}
                    </Card.Text>
                    <Card.Text>Bond Price: {stockInfo.bondPrice}</Card.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
