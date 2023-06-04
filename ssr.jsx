/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

const html = {
  pre: `<html>
      <head>
          <title>Hello from JSX</title>
          <style>
              *{margin:0;padding:0;}
              div.container{height:100vh;display: flex;align-items: center;}
              div.content{margin:auto;}
              .text-center{text-align:center;}
              h2{text-transform: uppercase;text-align: center;font-size:32px;}
          </style>
      </head>
      <body>`,
  style: ``,
  end: ` </body>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
      <style>body{font-family:Android Euclid,Roboto,Helvetica,Arial,sans-serif;}</style>
  </html>`,
};
function About(props) {
  return (
    <h1 class="text-center" style={{ padding: "50px 0" }}>
      it is a about page!
    </h1>
  );
}
function Home(props) {
  return (
    <div class="container">
      <div class="content">
        <h2>hello, visitor</h2>
        <h2>content will comming soon!</h2>
      </div>
    </div>
  );
}

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/api": () => {
    return "hello";
  },
  "/api/upload": () => {
    return {
      code: 0,
      message: "success",
      data: {
        "name": "xxx.png",
        "url":
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        "thumbUrl":
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    };
  },
};
function parseRequest(request) {
  const { url, headers } = request;
  const host = headers.get("host");
  const fullPath = url.substring(url.indexOf("://") + 3).replace(host, "");
  const queryPos = fullPath.indexOf("?");
  const path = queryPos != -1 ? fullPath.substring(0, queryPos) : fullPath;
  const query = {};

  return {
    path,
    query,
  };
}

function App(req) {
  const { path } = parseRequest(req);
  const func = routes[path];
  if (!func) {
    return buildResponse(renderSSR(<Home />));
  }
  const resp = func();
  if (typeof (resp) == "object" && resp.component) {
    return buildResponse(renderSSR(func));
  }
  return resp;
}
function buildResponse(source) {
  return html.pre + html.style + source + html.end;
}
function handler(req) {
  let contentType = "text/html";
  let resp = App(req);
  if (typeof (resp) == "object") {
    resp = JSON.stringify(resp);
    contentType = "application/json";
  }
  return new Response(resp, {
    headers: {
      "content-type": contentType + ";charset=utf-8",
    },
  });
}

console.log("Listening on http://localhost:8000");
serve(handler);
