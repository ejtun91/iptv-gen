import Channel from "../../../models/Channel";
import dbConnect from "../../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  if (req.method === "OPTIONS") {
    res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  dbConnect();
  const fs = require("fs");
  const concat = require("concat"); //Or use ES6 Syntax
  let Client = require("ssh2-sftp-client");
  ///var/www/iptvgenerator/lists/lists/mylist/mylist.m3u
  let sftp = new Client();
  const remoteDir = "/var/www/iptvgenerator/lists/lists/mylist/mylist.m3u";
  const sshOpt = {
    host: process.env.CONFIG_HOST,
    port: process.env.CONFIG_PORT,
    username: process.env.CONFIG_USERNAME,
    password: process.env.CONFIG_PASSWORD,
  };

  // .then((data) => {
  //   console.log(data, "the data info");
  // })
  // .catch((err) => {
  //   console.log(err, "catch error");
  // });
  // const iptvChecker = require("iptv-checker-module");

  // const options = {
  //   timeout: 5e3,
  //   parallel: 2,
  //   userAgent: "Mozilla/5.0 (compatible; Silly-Fetcher like kek) ROFLcopters",
  //   debug: true,
  //   omitMetadata: true,
  //   useItemHttpHeaders: true,
  //   preCheckAction: (playlist) => {
  //     console.log("Total channels to check:", playlist.items.length);
  //   },
  //   itemCallback: (item) => {
  //     console.log(item.url, item.status.ok);
  //   },
  // };

  const findRemoveSync = require("find-remove");

  findRemoveSync("../../../../var/www/iptvgenerator/lists/mylist", {
    age: { seconds: 3600 },
    extensions: ".m3u",
    limit: 100,
  });
  // console.log(iptvChecker("public/lists/tv_channels_daily.m3u", opts));

  // iptvChecker("public/lists/tv_channels_daily.m3u", options).then(
  //   (checkedPlaylist) => {
  //     /*  results Object */
  //     console.log(checkedPlaylist.items);
  //   }
  // );

  // let htmltoString = `#EXTM3U
  // #EXTINF:0 tvg-country='HR' tvg-logo='' group-title='Undefined',TEST2 CHANNEL
  // http://redfox.org/23123/13213`;

  // // UPDATE FILE
  // const data = fs.readFileSync(
  //   `public/lists/list.m3u8`,
  //   "utf8",
  //   function (err, data) {
  //     // Display the file content
  //     console.log(data);
  //   }
  // );
  // //    let result = data.replace(regexPattern, req.body.url);

  // fs.writeFileSync(`public/lists/list.m3u8`, htmltoString, function (err) {
  //   if (err) return console.log(err);
  // });

  //JOIN LISTS
  // concat([
  //   "public/lists/mylist/hrt1.m3u8",
  //   "public/lists/mylist/RTL_2.m3u8",
  //   "public/lists/mylist/list.m3u8",
  // ]).then((files_being_written) =>
  //   fs.writeFileSync("your-concated-file.m3u8", files_being_written)
  // );

  //UPDATE FILE
  // const regexPattern = /(http(.*)\d{3,})/gm;
  // const data = fs.readFileSync(
  //   "public/lists/mylist/list.txt",
  //   "utf8",
  //   function (err, data) {
  //     // Display the file content
  //     console.log(data);
  //   }
  // );
  // let result = data.replace(regexPattern, "link");

  // fs.writeFileSync("public/lists/mylist/list.txt", result, function (err) {
  //   if (err) return console.log(err);
  // });

  // console.log(result);

  //UPLOAD FILE
  // const htmlString = `#EXTM3U
  // #EXTINF:0 tvg-country='HR' tvg-logo='' group-title='Undefined',DOMA TV
  // http://hrt2.m3u`;

  // fs.writeFileSync("lists/mylist/hrt1.m3u8", htmlString);

  //DOWNLOAD FILE

  // const url = "http://localhost:3030/lists/mylist/list.txt";

  // const http = require("http");

  // http.get(url, (resp) => resp.pipe(fs.createWriteStream("lists/file.txt")));

  // console.log(req);

  if (method === "GET") {
    const htmlString = `#EXTM3U
`;

    try {
      const channels = await Channel.find({ country: id });
      res.status(200).json(channels);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "POST") {
    const regexChannelSpecific = `^.*${req.body.title}.*\n?|.*${req.body.title}(.*\n?){2}`;
    // const regChannel = `(?<=${req.body.title}\r|${req.body.title}\n|${req.body.title}\r\n)[^\r\n]+`;
    let re = new RegExp(regexChannelSpecific, "g");
    let result;
    let remotePath = `/root/iptvgenerator/public/lists/mylist/${req.body.uid}.m3u`;

    try {
      fs.readFile(
        `../../../../var/www/iptvgenerator/lists/mylist/${req.body.uid}.m3u`,
        "utf8",
        function (err, data) {
          if (err) {
            // check and handle err
            res.status(500).json(err);
            res.end();
          }
          // data is the file contents as a single unified string
          // .split('\n') splits it at each new-line character and all splits are aggregated into an array (i.e. turns it into an array of lines)
          // .slice(1) returns a view into that array starting at the second entry from the front (i.e. the first element, but slice is zero-indexed so the "first" is really the "second")
          // .join() takes that array and re-concatenates it into a string
          //  var linesExceptFirst = data.split("\n").slice(2, 3, 4).join("\n");
          result = data.replace(re, "");
          fs.writeFile(
            `../../../../var/www/iptvgenerator/lists/mylist/${req.body.uid}.m3u`,
            result.trim(),
            function (err, data) {
              if (err) {
                /** check and handle err */
              }
            }
          );
        }
      );
      // sftp
      //   .connect(sshOpt)
      //   .then(() => {
      //     return sftp.get(remotePath);
      //   })
      //   .then((data) => {
      //     result = Buffer.from(data).toString().replace(re, "").trim();
      //     return sftp.put(Buffer.from(result), remotePath, { flags: "w" });
      //   });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    //  let titleTrimmed = req.body.title.replace(/ /g, "_");
    // let data = fs.createReadStream(
    //   "public/lists/template/playlist_template.m3u"
    // );
    let remotePath = `/root/iptvgenerator/public/lists/mylist/${req.body.uid}.m3u`;
    const uuid = req.body.uid;
    try {
      const channel = await Channel.find();
      //     const file = "public/lists/mylist/mylist.m3u";
      //  UPLOAD FILE
      const htmlString = `#EXTM3U
`;

      // sftp
      //   .connect(sshOpt)
      //   .then(() => {
      //     return sftp.put(data, remotePath);
      //   })
      //   .then(() => {
      //     return sftp.end();
      //   })
      //   .catch((err) => {
      //     console.error(err.message);
      //   });
      fs.writeFile(
        `../../../../var/www/iptvgenerator/lists/mylist/${req.body.uid}.m3u`,
        htmlString,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.status(201).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
