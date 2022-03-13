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
      const onlineChannelCount = await Channel.aggregate([
        {
          $group: {
            _id: { status: "$status", country: "$country" },
            count: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(onlineChannelCount);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    let data = req.body.mylist;
    let htmltoString;
    // console.log(Object.assign(Channel, req.body));
    // console.log(req.body);
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        //do something with e.g. req.body[key]
        htmltoString = `
#EXTINF:0 tvg-country='HR' tvg-logo='' group-title='Undefined',${data.title}
${data.url}
`;
      }
    }

    //   console.log(req.body.mylist);
    try {
      // UPDATE FILE
      const dataText = fs.readFile(
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
      res.status(200).json(dataText);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "POST") {
    try {
      const channel = await Channel.create(req.body);
      res.status(201).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "DELETE") {
    const regexChannelSpecific = `^.*${req.body.title}.*$|.*${req.body.title}(.*\r?\n){2}`;
    let re = new RegExp(regexChannelSpecific, "g");
    let result;
    console.log(req.body);

    try {
      fs.readFile(
        "https://lists.iptvgenerate.com/lists/list.m3u",
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
          console.log();
          fs.writeFile(
            "https://lists.iptvgenerate.com/lists/list.m3u",
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
    }
  }
}
