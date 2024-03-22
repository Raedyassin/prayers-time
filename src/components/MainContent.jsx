import { Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar-dz"
moment.locale("ar-az");
export default  function MainContent() {
    const handleCityLocation = (event) => {
      setCity(event.target.value);
    };
    const handleCounteryLocation = (event) => {
      setCountery(event.target.value);
    };
  const [prayer, setPrayer] = useState("Fajr");
  const [today, setToday] = useState("");
  const [remainingTimeForNextPrayer, setremainingTimeForNextPrayer] = useState("");
  const [city, setCity] = useState("Makkah al Mukarramah");
  const [countery, setCountery] = useState("SA");
  const [timings, setTimings] = useState({
    Asr: "15:25",
    Dhuhr: "12:00",
    Fajr: "04:39",
    Firstthird: "22:01",
    Imsak: "04:29",
    Isha: "19:35",
    Lastthird: "01:58",
    Maghrib: "18:05",
    Midnight: "00:00",
    Sunrise: "05:54",
    Sunset: "18:05"
  });
  
  const getTimings = async (city,countery) => {
    const respons = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=${countery}&city=${city}`);
      setTimings(respons.data.data.timings);
  }
  useEffect(() => {
    getTimings(city,countery);

    
  }, [city,countery]);
  const downTimer = () => {
    // select the next prayer time
    const momentNow = moment();
    if (momentNow.isAfter(moment(timings.Fajr, 'hh:mm')) && momentNow.isBefore(moment(timings.Dhuhr, 'hh:mm'))) {
      setPrayer("Dhuhr");
    }
    else if (momentNow.isAfter(moment(timings.Dhuhr, 'hh:mm')) && momentNow.isBefore(moment(timings.Asr, 'hh:mm'))) {
      setPrayer("Asr");
    }
    else if (momentNow.isAfter(moment(timings.Asr, 'hh:mm')) && momentNow.isBefore(moment(timings.Sunset, 'hh:mm'))) {
      setPrayer("Sunset");
    }
    else if (momentNow.isAfter(moment(timings.Sunset, 'hh:mm')) && momentNow.isBefore(moment(timings.Isha, 'hh:mm'))) {
      setPrayer("Isha");
    }
    else  {
      setPrayer("Fajr");
    }

    // slelect the next paryer subtract time
    const remainingTime = moment(timings[prayer], "hh:mm").diff(momentNow);
    
    let durationRemainingTime = moment.duration(remainingTime);
    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnight = moment(timings["Fajr"], "hh:mm").diff(moment("00:00:00", "hh:mm:ss"));
      durationRemainingTime = moment.duration(midnightDiff + fajrToMidnight);
    }
    setremainingTimeForNextPrayer(`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`);

    // console.log(
    //   durationRemainingTime.hours(),
    //   durationRemainingTime.minutes(),
    //   durationRemainingTime.seconds()
    // );
  }
  useEffect(() => {
    const todayMoment = moment();
    setToday(todayMoment.format("MMM Do YYYY | h:mm"));

    let intervalID = setInterval(() => {
      downTimer();
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  },[timings, prayer])
  return (
    <>
      
      {/* firest row location infor */}
      <Grid container >
        <Grid xs={6}>
          <div>
            <h2>{today}</h2>
            <h1>{cityTranslate[city]}</h1>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h2>متبقي حتي صلاة { prayerName[prayer]}</h2>
            <h1>{remainingTimeForNextPrayer}</h1>
          </div>
        </Grid>
      </Grid>
      {/* firest row location infor */}

      <Divider style={{borderColor:"white",opacity:"0.4"}}/>

      {/* preyers card */}
      <Stack direction="row" justifyContent={'space-between'}
            style={{marginTop:"50px"}}>
        <Prayer prayer={"الفجر"} time={timings.Fajr} img={cardImgURL[0]} />
        <Prayer prayer={"الظهر"} time={timings.Dhuhr} img={cardImgURL[1]} />
        <Prayer prayer={"العصر"} time={timings.Asr} img={cardImgURL[2]} />
        <Prayer prayer={"المغرب"} time={timings.Sunset} img={cardImgURL[3]} />
        <Prayer prayer={"العشاء"} time={timings.Isha} img={cardImgURL[4]} />
      </Stack>

      {/* Select City */}
      <Stack direction={"row"} justifyContent={"space-around"} style={{marginTop:"50px"}} >
        <FormControl style={{width:"30%"}}>
          <InputLabel id="demo-simple-select-label">
            <span style={{color:"white"}}>{"المدينة"}</span>
          </InputLabel>
          <Select
            style={{color:"white"}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label={"المدينة"}
            onChange={handleCityLocation}
          >
            {
              cityEngToArb[countery].map((ele) => {
                return <MenuItem key={ele.id} value={ele.valueEnglish}>{ele.valueArabic}</MenuItem>
              })
            }
          </Select>
        </FormControl>


        {/* select countery */}
        <FormControl style={{width:"30%"}}>
          <InputLabel id="demo-simple-select-label">
            <span style={{color:"white"}}>{"البلد"}</span>
          </InputLabel>
          <Select
            style={{color:"white"}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label={"البلد"}
            onChange={handleCounteryLocation}
          >

            {
              EngToArbCountery.map((ele) => {
                return <MenuItem key={ele.id} value={ele.valueEnglish}>{ele.valueArabic}</MenuItem>
              })
            }
          </Select>
        </FormControl>
      </Stack>
    </>
  )
}

let cardImgURL = [
  "../../public/images/fajr-prayer.png",
  "../../public/images/dhhr-prayer-mosque.png",
  "../../public/images/asr-prayer-mosque.png",
  "../../public/images/sunset-prayer-mosque.png",
  "../../public/images/night-prayer-mosque.png",
];
let prayerName = {
  "Fajr": "الفجر",
  "Dhuhr": "الظهر",
  "Asr": "العصر",
  "Sunset": "المغرب",
  "Isha":"العشاء"
}
let EngToArbCountery = [
  {
    id: "1",
    valueEnglish:"EG",
    valueArabic: "مصر",
  },
  {
    id: "2",
    valueEnglish:"SA",
    valueArabic:"المملكة العربية السعودية"
  }
]
let cityTranslate = {
  "domiat": "دمياط",
  "cairo": "القاهرة",
  "Beheira": "البحيرة",
  "Mansoura": "المنصورة",
  "Dammam": "الدمام",
  "Riyadh": "الرياض",
  "Makkah al Mukarramah": "مكة المكرمة",
  "AL Madinah AL Munawwarah":"المدينة المنورة"
  
}
let cityEngToArb = {
  "EG": [
    {
      id: "1",
      valueEnglish: "domiat",
      valueArabic: "دمياط",
    },
    {
      id: "2",
      valueEnglish: "cairo",
      valueArabic: "القاهرة",
    },
    {
      id: "3",
      valueEnglish: "Beheira",
      valueArabic: "البحيرة",
    },
    {
      id: "4",
      valueEnglish: "Mansoura",
      valueArabic: "المنصورة",
    }
  ],
  "SA": [
      {
        id: "1",
        valueEnglish: "Makkah al Mukarramah",
        valueArabic: "مكة المكرمة",
      },
      {
        id: "2",
        valueEnglish: "Riyadh",
        valueArabic: "الرياض",
      },
      {
        id: "3",
        valueEnglish: "Dammam",
        valueArabic: "الدمام",
      },
      {
        id: "4",
        valueEnglish: "AL Madinah AL Munawwarah",
        valueArabic: "المدينة المنورة",
      },
    ],
};

