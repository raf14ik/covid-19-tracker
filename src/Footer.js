import React from "react";
import "./Footer.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function Footer() {
  return (
    <div className="footer">
      <Card>
        <CardContent>
          <p>© 2020 Rafik Hammas. All Rights Reserved.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Footer;
