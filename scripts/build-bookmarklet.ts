#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { minify } from "terser";
import clipboardy from "clipboardy";

(async function main() {
  try {
    // Paths to the JS source and the new HTML template
    const jsPath = path.join(__dirname, "../src/bookmarklet.js");
    const htmlTemplatePath = path.join(__dirname, "../public/bookmarklet-template.html");

    // Read files
    const jsData = await fs.promises.readFile(jsPath, "utf8");
    const htmlData = await fs.promises.readFile(htmlTemplatePath, "utf8");

    // Minify the bookmarklet JS code
    const { code: minifiedJs } = await minify(jsData, { format: { comments: false } });
    const inlineJs = minifiedJs || "";

    // Inject the minified JS into the template
    const combinedHtml = htmlData.replace("// BOOKMARKLET_JS_PLACEHOLDER", inlineJs);

    // Wrap combined HTML into a bookmarklet that opens a new window and writes the HTML
    const bookmarklet = `javascript:(function(){
      var w = window.open("","","width=370,height=250");
      w.document.write(${JSON.stringify(combinedHtml)});
      w.document.close();
    })();`;

    clipboardy.writeSync(bookmarklet);
    console.log("Bookmarklet code copied to clipboard.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
