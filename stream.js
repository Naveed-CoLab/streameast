import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method === "GET" && req.url === "/api/health") {
    // Simple health check endpoint
    return res.status(200).send("Backend running");
  }

  try {
    const response = await axios.get(
      "https://www.sportsfeed24.to/streams/mlb",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90 Safari/537.36",
        },
      }
    );

    const $ = cheerio.load(response.data);
    $(
      "header, footer, nav, .navbar, .site-header, .site-footer, .ad, .adsbygoogle"
    ).remove();
    $("body").css({ margin: 0, padding: 0, overflow: "auto" });
    $("html").css("overflow", "auto");

    res.setHeader("Content-Type", "text/html");
    res.status(200).send($.html());
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("<h1>⚠️ Unable to load stream</h1>");
  }
}
