const QRCode = require("qrcode");

module.exports = async (text) => {
  try {
    const QR = await QRCode.toDataURL(text);
    console.log(QR);
    return QR;
  } catch (error) {
    console.log(error);
  }
};
