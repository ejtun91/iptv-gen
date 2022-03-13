import Channel from "../../../models/Channel";
import dbConnect from "../../../util/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  dbConnect();
  const fs = require("fs");

  if (method === "GET") {
    try {
      const channel = await Channel.find();
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    let htmltoString = `
#EXTINF:0 tvg-country='HR' tvg-logo='' group-title='Undefined',${req.body.title}
${req.body.url}
`;
    try {
      // UPDATE FILE
      const data = fs.readFile(
        `https://lists.iptvgenerate.com/lists/mylist/${req.body.uid}.m3u`,
        "utf8",
        function (err, data) {
          // Display the file content
          //        console.log(data);
        }
      );
      //    let result = data.replace(regexPattern, req.body.url);

      fs.writeFile(
        `https://lists.iptvgenerate.com/lists/mylist/${req.body.uid}.m3u`,
        htmltoString,
        { flag: "a+" },
        function (err) {
          if (err) return console.log(err);
        }
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
      res.send(error);
    }
  }

  if (method === "POST") {
    const regex = /(?<=\n).*(?=\n)/gm;
    let result;
    try {
      fs.readFile(
        `https://lists.iptvgenerate.com/lists/mylist/${req.body.uid}.m3u`,
        "utf8",
        function (err, data) {
          if (err) {
            // check and handle err
            res.status(500).json(err);
          }
          // data is the file contents as a single unified string
          // .split('\n') splits it at each new-line character and all splits are aggregated into an array (i.e. turns it into an array of lines)
          // .slice(1) returns a view into that array starting at the second entry from the front (i.e. the first element, but slice is zero-indexed so the "first" is really the "second")
          // .join() takes that array and re-concatenates it into a string
          //  var linesExceptFirst = data.split("\n").slice(2, 3, 4).join("\n");
          result = data.replace(regex, "");
          console.log();
          fs.writeFile(
            `https://lists.iptvgenerate.com/lists/mylist/${req.body.uid}.m3u`,
            result.trim(),
            function (err, data) {
              if (err) {
                /** check and handle err */
              }
            }
          );
        }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
      res.end();
    }
  }
}
