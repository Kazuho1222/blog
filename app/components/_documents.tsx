// eslint-disable-next-line @next/next/no-document-import-in-page
import { Head, Html, Main, NextScript } from "next/document";
import { siteMeta } from "../lib/constants.js";
const { siteLang } = siteMeta;

export default function Document() {
  return (
    <Html lang={siteLang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
