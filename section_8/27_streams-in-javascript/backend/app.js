import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=streams.mp4");

  const fileHandle = await fs.open(
    "C:\\Users\\anura\\OneDrive\\Desktop\\streams.mp4"
  );
  const { size } = await fileHandle.stat();
  res.setHeader("Content-Length", size);
  const readStream = fileHandle.createReadStream({
    highWaterMark: 10 * 1024 * 1024,
  });

  readStream.on("data", (chunk) => {
    res.write(chunk);

    readStream.pause();

    setTimeout(() => {
      readStream.resume();
    }, 50);
  });

  readStream.on("end", () => {
    res.end();
  });
});

server.listen(4000, "localhost", () => {
  console.log("Server Started");
});
