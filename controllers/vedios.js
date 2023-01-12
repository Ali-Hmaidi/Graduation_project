const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const Match = require("../models/Match");

const getAllVedios = async (req, res) => {
  res.status(StatusCodes.OK).send("all vedios");
};

const getVideo = async (req, res) => {
  const videoName = req.params.videoName;

  const range = req.headers.range;
  if (!range) {
    res.status(StatusCodes.NOT_FOUND).send("Requiers Range header");
    return;
  }

  const videoPath = path.resolve(`./src/vedios/${videoName}`);

  if (!fs.existsSync(videoPath)) {
    res.status(StatusCodes.NOT_FOUND).send("Match Video NOT found ");
    return;
  }
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
};

const uploadVideo = async (req, res) => {
  const isAdmin = req.user.admin;
  const matchId = req.params.matchId;
  if (isAdmin) {
    const formData = new formidable.IncomingForm();

    console.log(formData.field);

    formData.maxFileSize = 1000 * 1024 * 1024;
    formData.parse(req, function (error, fields, files) {
      title = fields.title;
      const oldPathViedo = files.video.filepath;
      const newPath = path.resolve(
        `./src/vedios/${files.video.originalFilename}`
      );
      var vidname = files.video.originalFilename;

      fs.rename(oldPathViedo, newPath, async function (error) {
        const match = await Match.findByIdAndUpdate(
          { _id: matchId },
          { videoName: vidname }
        );
        if (!match) {
          throw NotFoundError(`no match found with Id ${matchId}`);
        }

        res.status(StatusCodes.OK).json({ success: true, match });
        return;
      });
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getVideo,
  getAllVedios,
  uploadVideo,
};
