import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method === "GET" && req.url === "/api/health") {
    return res.status(200).send("Backend running");
  }

  try {
    const response = await axios.get("https://www.sportsfeed24.to/streams/mlb", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36",
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Load HTML into cheerio
    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $(
      "header, footer, nav, .navbar, .site-header, .site-footer, .ad, .adsbygoogle"
    ).remove();

    // Fix body and html styles for scrolling
    $("body").css({ margin: 0, padding: 0, overflow: "auto" });
    $("html").css("overflow", "auto");

    res.setHeader("Content-Type", "text/html");
    res.status(200).send($.html());
  } catch (error) {
    // Full debug logs
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    }
    if (error.request) {
      console.error("No response received:", error.request);
    }
    console.error("Stack trace:", error.stack);

    res.status(500).send("<h1>⚠️ Unable to load stream</h1>");
  }
}
