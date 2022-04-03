import Channel from "../../../models/Channel";
import dbConnect from "../../../util/mongo";

const handler = async (req, res) => {
  const {
    method,
    cookies,
    query: { id },
  } = req;

  const fs = require("fs");
  const token = cookies.token;
  const regexPattern = /(http(.*))/;

  dbConnect();

  // console.log(req.body);

  // if (method === "GET") {
  //   fs.readFile(
  //     "public/lists/uploaded/playlist.m3u",
  //     "utf-8",
  //     function (err, data) {
  //       if (err) throw err;

  //       var result = data.replace(
  //         /(\sHD)|(\sFHD)|(\sUHD)|(\s(HD))|(\s(UHD))|(\s(FHD))/g,
  //         ""
  //       );

  //       try {
  //         fs.writeFile(
  //           `public/lists/uploaded/playlist.m3u`,
  //           result.trim(),
  //           function (err, data) {
  //             if (err) {
  //               /** check and handle err */
  //             }
  //           }
  //         );
  //         res.status(200).json("ok");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   );
  // }

  if (method === "PUT") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      fs.writeFile(
        `public/lists/uploaded/playlist.m3u`,
        req.body.playlist,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.status(200).send("uploaded");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "POST") {
    let data = req.body.channels;
    const regexPattern = /(http(.*))/;

    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!");
    }

    try {
      // UPDATE FILE
      const dataFiles = fs.readFile(
        `public/lists/uploaded/playlist.m3u`,
        "utf8",
        async function (err, files) {
          // Display the file content
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              //do something with e.g. req.body[key]
              //     console.log(files);
              let pattern = `${data[key].title}`;
              let pat = new RegExp(pattern, "ig");
              //  console.log(files.match(pat));
              let matchReg = files.match(pat);
              // if (pat.test(files)) {
              //   console.log(files);
              // }
              //   console.log(pat.test(files));

              // if (channel) console.log("channel exists");

              if (
                pat.test(files) == true &&
                fs.existsSync(
                  `public/lists/${data[key].title.replace(/ /i, "_")}.m3u`
                )
              ) {
                let temp = data[key].title;

                console.log(temp);

                fs.readFile(
                  `public/lists/${temp.replace(/ /gi, "_")}.m3u`,
                  "utf8",
                  async function (err, items) {
                    // Display the file content
                    let regexP = `${temp}(.*?)[\r\n]+([^\r\n]+)`;
                    let pat2 = new RegExp(regexP, "i");
                    console.log(items);

                    let result = items.replace(pat2, files.match(pat2)[0]);

                    await Channel.updateOne(
                      { title: temp },
                      {
                        $set: {
                          url: files
                            .match(pat2)[0]
                            .slice(
                              files.match(pat2)[0].indexOf("\n") + 1,
                              files.match(pat2)[0].length
                            ),
                        },
                      }
                    );

                    fs.writeFile(
                      `public/lists/${temp.replace(/ /gi, "_")}.m3u`,
                      result,
                      function (err) {
                        if (err) return console.log(err);
                      }
                    );
                  }
                );
              }
            }
          }
        }
      );
      res.status(200).send("replaced links");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export default handler;
