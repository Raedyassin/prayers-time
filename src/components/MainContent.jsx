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
  }, [timings, prayer]);
  let widthScreen = window.innerWidth;
  return (
    <>
      
      {/* firest row location infor */}
      <Grid container style={{color:"black",textAlign:"center"}} >
        <Grid xs={widthScreen <= 768 ? 12 : 6}>
          <div >
            <h2 style={{ width: widthScreen <= 768 ? "100%" : "40vw", textAlign: widthScreen <= 768 ? "center" : ""  }} >{`${today}`}</h2>
            <h1 style={{ width: widthScreen <= 768 ? "100%" : "40vw", textAlign: widthScreen <= 768 ? "center" : "", marginTop:"0" }}>{cityTranslate[city]}</h1>
          </div>
        </Grid>

        <Grid xs={widthScreen <= 768 ? 12 : 6} style={{color:"black",textAlign:"center"}}> 
          <div>
            <h2 style={{width: widthScreen <= 768 ? "100%" : "40vw", textAlign: widthScreen <= 768 ? "center" : ""}}>متبقي حتي صلاة { prayerName[prayer]}</h2>
            <h1 style={{width: widthScreen <= 768 ? "100%" : "40vw", textAlign: widthScreen <= 768 ? "center" : "", marginTop:"0"}}>{remainingTimeForNextPrayer}</h1>
          </div>
        </Grid>
      </Grid>
      {/* firest row location infor */}

      <Divider style={{borderColor:"black",opacity:"0.4"}}/>

      {/* preyers card */}
      <Stack direction="row"justifyContent={widthScreen <= 768 ?'space-around':'space-between'} 
            style={{marginTop:" "}} flexWrap={"wrap"} >
        <Prayer prayer="الفجر" time={timings.Fajr} img={"https://res.cloudinary.com/dzbcwbeit/image/upload/v1711191282/fajr-prayer_z2prpy.png"} />
        <Prayer prayer="الظهر" time={timings.Dhuhr} img={"https://res.cloudinary.com/dzbcwbeit/image/upload/v1711191246/asr-prayer-mosque_ez9t0q.png"} />
        <Prayer prayer="العصر" time={timings.Asr} img={"https://res.cloudinary.com/dzbcwbeit/image/upload/v1711191282/dhhr-prayer-mosque_oifgdy.png"} />
        <Prayer prayer="المغرب" time={timings.Sunset} img={"https://res.cloudinary.com/dzbcwbeit/image/upload/v1711191283/sunset-prayer-mosque_iy9e05.png"} />
        <Prayer prayer="العشاء" time={timings.Isha} img={"https://res.cloudinary.com/dzbcwbeit/image/upload/v1711191602/night-prayer-mosque_chj31f.png"} />
      </Stack>

      {/* Select City */}
      <Stack  direction={"row"} justifyContent={"space-around"} style={{marginTop:"40px",marginBottom:"40px"}} >
        <FormControl style={{width:"30%"}}>
          <InputLabel id="demo-simple-select-label">
            <span style={{color:"black"}}>المدينة</span>
          </InputLabel>
          <Select
            style={{color:"black" ,backgroundColor:"#F7F4EF"}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label={"المدينة"}
            onChange={handleCityLocation}
          >
            <div style={{ backgroundColor: "#F7F4EF" }}>
              {
                cityEngToArb[countery].map((ele) => {
                  return <MenuItem key={ele.id} value={ele.valueEnglish}>{ele.valueArabic}</MenuItem>
                })
              } 
            </div>
          </Select>
        </FormControl>


        {/* select countery */}
        <FormControl style={{width:"30%"  }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{color:"black" }}>البلد</span>
          </InputLabel>
          <Select
            style={{color:"black",backgroundColor:"#F7F4EF"}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label={"البلد"}
            onChange={handleCounteryLocation}
          >

            <div style={{backgroundColor:"#F7F4EF"}}>
              {
                EngToArbCountery.map((ele) => {
                  return <MenuItem key={ele.id} value={ele.valueEnglish}>{ele.valueArabic}</MenuItem>
                })
              }
            </div>
          </Select>
        </FormControl>
      </Stack>
    </>
  )
}

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
  "Asyut":"أسيوط",
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
    },
    {
      id: "5",
      valueEnglish: "Asyut",
      valueArabic: "أسيوط",
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

