/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import imageTransform from "./utils/imageTransform";
import path from "path";

const app = express();
const port = 3000;

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.send("connected to server!");
});

app.get("/api", (req, res) => {
  res.statusCode = 200;
  res.send("connected to api!");
});

app.get("/api/images", async (req, res) => {
  const { filename, width, height } = req.query;

  try {
    // Ensure all parameters are provided
    if (!filename && !width && !height) {
      return res
        .status(200)
        .send(
          "connected to api/images \n enter these params to show an image filename, width, height",
        );
    }

    // Call your async imageTransform function
    const filePath = await imageTransform(
      filename as string,
      width as string,
      height as string,
    );

    // Send the resized image
    res.status(200).sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending the image");
      }
    });
  } catch (err: any) {
    console.error("Image processing error:", err.message);

    // Determine status code based on error message
    if (
      err.message.includes("Missing") ||
      err.message.includes("positive numbers")
    ) {
      res.status(400).send(err.message);
    } else if (err.message.includes("does not exist")) {
      res.status(404).send(err.message);
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

export default app;
