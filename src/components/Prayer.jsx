import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
export default function Prayre({img,prayer,time}) {// this error by validation on props to fix it use proptypes package but don't work with me now
    let widthScreen = window.innerWidth;
  return (
    <Card sx={{ maxWidth: 346 }} style={{width: widthScreen <= 768 ?"35vw":"13vw",marginTop:"40px" }}>
      <CardMedia
        sx={{ height: 140 }}
        image={img}
        title="green iguana"
      />
      <CardContent style={{backgroundColor:"#F7F4EF",paddingTop:"5px"}}>
        <h2 style={{fontSize: widthScreen <= 768 ?"3.5vw":"2vw" ,margin:"5px"}} >
          {prayer}  
        </h2>
        {/* <h4 > */}
        <Typography style={{fontSize: widthScreen <= 768 ?"3vw":"1.7vw"}} gutterBottom variant="h5" component="div">
          {time}
        </Typography>
        {/* </h4> */}
      </CardContent>
      
    </Card>
  );
}