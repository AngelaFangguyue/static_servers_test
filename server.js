var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);
  //http://localhost:8888/index.html?xxxx
  console.log("path", path);
  let filetype = {
    ".html": "text/html",
    ".js": "text/js",
    ".css": "text/css",
    ".json": "text/json",
    ".xml": "text/xml",
    ".jpg": "image/jpg",
    ".png": "image/png"
  };

  let type = path.substring(path.lastIndexOf("."));

  response.statusCode = 200;
  response.setHeader(
    "Content-Type",
    `${filetype[type] || "text/html"};charset=utf-8`
  ); //当文件不存在或是访问根目录的时候，默认contentType就是text/html

  //默认首页的设置
  let filepath = path === "/" ? "/index.html" : path; //在这里设置的时候，要注意response.setHeader("Content-Type", `text/${type};charset=utf-8`);这句话的设置

  let content;
  try {
    console.log(`public${filepath}`);
    content = fs.readFileSync(`public${filepath}`);
  } catch (error) {
    console.log(error);
    response.statusCode = 405;
    content = "文件不存在";
  }

  response.write(content);
  response.end();

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
