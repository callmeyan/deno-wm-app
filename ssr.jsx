/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
const routes = {
    "/": () => <Home />,
    "/about": () => <About />,
};

function About(props) {
    return <p>it is a about page!</p>;
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

function Router(props) {
    return <div class="container"></div>;
}

function App(req) {
    const url = req.url,
        query = req.query;
        // console.log(req)
    return renderSSR(<Home />);
}

const html = {
    pre: `<html>
    <head>
        <title>Hello from JSX</title>
        <style>
            *{margin:0;padding:0;}
            div.container{height:100vh;display: flex;align-items: center;}
            div.content{margin:auto;}
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
function buildResponse(source) {
    return html.pre + html.style + source + html.end;
}
function handler(req) {
    return new Response(buildResponse(App(req)), {
        headers: {
            "content-type": "text/html",
        },
    });
}

console.log("Listening on http://localhost:8000");
serve(handler);
