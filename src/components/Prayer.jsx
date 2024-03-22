// import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function Prayre(props) {
  return (
    <Card sx={{ maxWidth: 346 }} style={{width:200}}>
      <CardMedia
        sx={{ height: 140 }}
        image={props.img}
        title="green iguana"
      />
      <CardContent>
        <h2 >
          {props.prayer}
        </h2>
        {/* <h4 > */}
        <Typography gutterBottom variant="h5" component="div">
          {props.time}
        </Typography>
        {/* </h4> */}
      </CardContent>
    </Card>
  );
}
