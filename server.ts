import { NHttp, RequestEvent } from "https://deno.land/x/nhttp@0.2.5/mod.ts";
import { ViewEngine } from "https://deno.land/x/nhttp_view@0.1.1/mod.ts";

const app = new NHttp<RequestEvent & ViewEngine>();

app.use(ViewEngine.init({
    basedir: "-views-",
    extname:'.twig',
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: false,
    noCache: false,
    web: {
        useCache: false,
        async: false
    }
}));
app.get("/", ({ query,response }) => {
    const name = query.name || "visitor";
    return response.view('index', {
        name,
        title: "A Example Page"
    });
});
console.log('app running at http://localhost:3000')
app.listen(3000);