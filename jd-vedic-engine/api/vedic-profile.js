import { getVedicMoon } from "../engine/vedicMoon";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycby4JUwVJYe3V_1m40lPLcTATL4LhoN9gP4yckkhLQOSqwt9RPmELqBhzYs5a70IzI9i/exec";

export default async function handler(req, res) {

  /* ===== CORS ===== */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const { name, phone, dob, time } = body || {};

    if (!name || !phone || !dob || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const moon = getVedicMoon(dob, time);
    const nakshatra = getNakshatra(Number(moon.moon_degree));
    const numerology = getNumerology(name, dob);
    const remedy = getRemedy(moon.sign);

    /* ===== SILENT SAVE TO GOOGLE SHEET ===== */
    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        dob,
        time,
        zodiac: moon.sign,
        nakshatra,
        name_number: numerology.name_number,
        life_path: numerology.life_path
      })
    }).catch(()=>{}); // silent fail safe

    /* ===== RESPONSE ===== */
    res.json({
      branding: "Astrologer Joydev Sastri",
      zodiac: moon.sign,
      moon_degree: moon.moon_degree,
      nakshatra,
      numerology,
      remedy,
      prediction:
        `${moon.sign} রাশিতে চন্দ্র অবস্থানের ফলে আজ মানসিক সিদ্ধান্ত, কর্মক্ষেত্র ও ব্যক্তিগত সম্পর্কের উপর গভীর প্রভাব পড়বে। ধৈর্য বজায় রাখলে সাফল্য আসবে।`
    });

  } catch (err) {
    console.error("Vedic API Error:", err);
    res.status(500).json({
      error: "Internal astrology engine error"
    });
  }
}
