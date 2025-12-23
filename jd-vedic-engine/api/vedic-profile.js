import { getVedicMoon } from "../engine/vedicMoon";
import { getNakshatra } from "../engine/nakshatra";
import { getNumerology } from "../engine/numerology";
import { getRemedy } from "../engine/remedy";

export default function handler(req,res){
  if(req.method!=="POST"){
    return res.status(405).json({error:"POST only"});
  }

  const { name, phone, dob, time } = req.body;
  if(!name||!phone||!dob||!time){
    return res.status(400).json({error:"Missing fields"});
  }

  const moon = getVedicMoon(dob,time);
  const nakshatra = getNakshatra(Number(moon.moon_degree));
  const numerology = getNumerology(name,dob);
  const remedy = getRemedy(moon.sign);

  res.json({
    branding:"Astrologer Joydev Sastri",
    name,
    phone,
    zodiac:moon.sign,
    moon_degree:moon.moon_degree,
    nakshatra,
    numerology,
    remedy,
    prediction:`${moon.sign} রাশিতে চন্দ্র অবস্থান আজ কর্ম ও মানসিক সিদ্ধান্তে গভীর প্রভাব ফেলবে।`
  });
}
