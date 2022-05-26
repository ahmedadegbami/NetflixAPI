import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold"
  }
};

const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (media) => {
  let imagePath = {};
  if (media.Poster) {
    const response = await axios.get(media.Poster, {
      responseType: "arraybuffer"
    });
    const mediaPosterURLPaths = media.Poster.split("/");
    const fileName = mediaPosterURLPaths[mediaPosterURLPaths.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePath = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }

  const docDefinition = {
    content: [
      imagePath,
      { text: media.Title, style: "header" },
      { text: striptags(media.Type), lineHeight: 1.5 },
      {
        text: media.reviews
          .map((review) => `${review.comment}: ${review.rate}`)
          .join("\n"),
        lineHeight: 1.5
      }
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true
      },
      small: {
        fontSize: 8
      },
      defaultStyle: {
        font: "Helvetica"
      }
    }
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();
  return pdfReadableStream;
};
