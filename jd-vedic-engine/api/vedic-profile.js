import { getVedicMoon } from "../engine/vedicMoon";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

export default function handler(req, res) {

  /* ===============================
     ✅ CORS HEADERS (MANDATORY)
  =============================== */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  /* ✅ Handle preflight */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* ===============================
     ❌ Only POST allowed
  =============================== */
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { name, phone, dob, time } = req.body;

    if (!name || !phone || !dob || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    /* ===============================
       🌙 CORE VEDIC CALCULATION
    =============================== */
    const moon = getVedicMoon(dob, time);

    const nakshatra = getNakshatra(
      Number(moon.moon_degree)
    );

    const numerology = getNumerology(name, dob);
    const remedy = getRemedy(moon.sign);

    /* ===============================
       ✅ FINAL RESPONSE
    =============================== */
    res.json({
      branding: "Astrologer Joydev Sastri",
      name,
      phone,
      zodiac: moon.sign,
      moon_degree: moon.moon_degree,
      nakshatra,
      numerology,
      remedy,
      prediction:
        `${moon.sign} রাশিতে চন্দ্র অবস্থানের ফলে আজ মানসিক সিদ্ধান্ত, কর্মক্ষেত্র ও ব্যক্তিগত সম্পর্কের উপর গভীর প্রভাব পড়বে। লক্ষ্য স্থির রেখে ধৈর্য বজায় রাখাই সাফল্যের চাবিকাঠি।`
    });

  } catch (err) {
    console.error("Vedic API Error:", err);
    res.status(500).json({
      error: "Internal astrology engine error"
    });
  }
}
