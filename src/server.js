import express from "express";
import listEndpoints from "express-list-endpoints";
import mediasRouter from "./api/index.js";
import cors from "cors";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  genericErrorHandler
} from "./errorHandlers.js";
import { join } from "path";
import mediaFileRouter from "./api/mediaFile.js";

const server = express();

const publicFolderPath = join(process.cwd(), "./public");

const port = process.env.PORT || 3001;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, next) => {
    console.log("CURRENT ORIGIN: ", origin);

    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(
        createError(
          400,
          `Cors Error! your origin ${origin} is not in the list!`
        )
      );
    }
  }
};

//*************** MIDDLEWARE ***************//
server.use(express.static(publicFolderPath));
server.use(cors(corsOptions));
server.use(express.json());

//*************** ENDPOINTS ***************//
server.use("/media", mediasRouter);
server.use("/mediaFile", mediaFileRouter);

//*************** ERRORHANDLER ***************//

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
