import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./InfoBox.css";

function InfoBox({
  title,
  cases,
  active,
  isRed,
  isGreen,
  isOrange,
  isBlue,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"}
      } ${isRed && "infoBox--red"} ${isGreen && "infoBox--green"} ${
        isOrange && "infoBox--orange"
      }`}
    >
      <CardContent>
        <Typography className="infoBox_title" color="initial">
          {title}
        </Typography>

        <h2
          className={`infoBox_cases ${isRed && "infoBox_cases--red"} ${
            isOrange && "infoBox_cases--orange"
          } ${isGreen && "infoBox_cases--green"}`}
        >
          {cases}
        </h2>

        <Typography className="infoBox_total" color="primary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
