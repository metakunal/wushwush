import { LineChart } from "@mui/x-charts";
import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import "./css/stocks.css";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Stocks() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://citipunelinux65.neueda.com:8100/assets")
      .then((response) => response.json())
      .then((data) => {
        const stocksData = data.filter(
          (asset) => asset.assetClass.toLowerCase() === "stocks"
        );
        setStocks(stocksData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    console.log("Search Query:", searchQuery);
    setSelectedStock(searchQuery);
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
    setSelectedStock(name);
    try {
      const timeSeriesResponse = await fetch(
        `http://citipunelinux65.neueda.com:8100/assets/charts/timeseries/${name}`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(
        `http://citipunelinux65.neueda.com:8100/stocks/ticker/${name}`
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
      // console.log(stockInfo);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
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
          {selectedStock && stockData.length > 0 && (
            <div className="stock-details">
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
                    data: price,
                  },
                ]}
                height={330}
                width={750}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
              <Card className="stock-overview-card">
                <Card.Body>
                  <Card.Title>{selectedStock}</Card.Title>
                  {stockInfo && (
                    <>
                      <Card.Text>Name: {stockInfo.companyName}</Card.Text>
                      <Card.Text>
                        Exchange: {stockInfo.marketExchange}
                      </Card.Text>
                      <Card.Text>
                        Current Price: {stockInfo.currentPrice}
                      </Card.Text>
                      <Card.Text>
                        Average Volume: {stockInfo.averageVolume}
                      </Card.Text>
                      <Card.Text>52WeekHigh: {stockInfo.highPrice}</Card.Text>
                      <Card.Text>52WeekLow: {stockInfo.lowPrice}</Card.Text>
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
