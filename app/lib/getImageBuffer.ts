import fs from "node:fs/promises";
import path from "node:path";

export async function getImageBuffer(src: string) {
  // ローカルの画像の場合はパスにpublicを付与
  if (src.startsWith("https")) {
    const res = await fetch(src);
    return await Buffer.from(await res.arrayBuffer());
  } else {
    return await fs.readFile(path.join("./public", src));
  }
}
