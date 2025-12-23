import { getZodiac } from "../engine/zodiac";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { name, phone, dob, time, timezone="+05:30" } = req.body;

  if (!name || !phone || !dob || !time) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const zodiac = getZodiac(dob, time, timezone);
  const nakshatra = getNakshatra(dob);
  const numerology = getNumerology(name, dob);
  const remedy = getRemedy(zodiac.sign);

  res.json({
    branding: "Astrologer Joydev Sastri",
    name,
    phone,
    zodiac: zodiac.sign,
    sun_degree: zodiac.degree,
    nakshatra,
    numerology,
    remedy,
    prediction: zodiac.prediction
  });
}
