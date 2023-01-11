const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const path = require("path");
const fs = require("fs");

const getAllVedios = async (req, res) => {
  res.status(StatusCodes.OK).send("all vedios");
};

const getVedio = async (req, res) => {
  const {
    params: { id: matchId },
  } = req;

  const range = req.headers.range;
  if (!range) {
    res.status(StatusCodes.NOT_FOUND).send("Requiers Range header");
    return;
  }

  const vedioPath = path.resolve("./src/vedios/match1.mp4");
  const vedioSize = fs.statSync(vedioPath).size;

  const CHUNK_SIZE = 10 ** 6; //1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, vedioSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${vedioSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "vedio/mp4",
  };
  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);
  const vedioStream = fs.createReadStream(vedioPath, { start, end });
  vedioStream.pipe(res);
};

module.exports = {
  getVedio,
  getAllVedios,
};
