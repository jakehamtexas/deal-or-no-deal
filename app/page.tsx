"use client";

import { BriefcaseProps } from "./briefcase";
import { Main } from "./main";

import { OgImageJson } from "./api/og-img/route";
import { getRequest } from "./lib/resource/amazon";
import { useState } from "react";
import { WishlistJson } from "./lib/manager/html";
import { AmazonUrl } from "./types";

function getItemLinks(url: string) {
  return getRequest<WishlistJson>("/api/crawl", {
    params: { url },
  });
}

async function* getAllItemLinks(url: string) {
  let currentUrl = url;
  let allHrefs: AmazonUrl[] = [];
  let current = 0;
  const max = 5;
  while (allHrefs.length < 30 && current < max) {
    current++;

    const res = await getItemLinks(currentUrl);
    if (!res) {
      break;
    }

    yield* res.itemHrefs;

    if (!res.showMoreHref) {
      break;
    }

    currentUrl = res.showMoreHref;
  }
}

function getItemOgImg(url: string) {
  return getRequest<OgImageJson>("/api/og-img", {
    params: { url },
  });
}

type OgImageTuple = [url: AmazonUrl, ogImg: string];

function getBriefcases(ogImgTuples: OgImageTuple[]): BriefcaseProps[] {
  const briefcaseSeeds = [
    ...ogImgTuples,
    ...Array.from({ length: 30 })
      .fill(null)
      .map(() => [undefined, "/rubber-duck.png"] as const),
  ].slice(0, 30);

  return briefcaseSeeds.map(([url, ogImg], i) => ({
    position: i + 1,
    key: url ?? i.toString(),
    hiddenImg: ogImg,
  }));
}

export default function Home() {
  const [url, setUrl] = useState("");

  const [ogImgs, setOgImgs] = useState<Record<AmazonUrl, string>>({});

  const setOgImg = (url: AmazonUrl, img: string) => {
    setOgImgs((prev) => ({
      ...prev,
      [url]: img,
    }));
  };

  const onSubmit = async () => {
    for await (const itemLink of getAllItemLinks(url)) {
      getItemOgImg(itemLink).then((ogImg) => {
        const image = ogImg?.ogImage;
        if (!image) {
          console.error("no image found for ", itemLink);
          return;
        }
        setOgImg(itemLink, image);
      });
    }
  };

  const ogImgTuples = Object.entries(ogImgs) as OgImageTuple[];

  const briefcases: BriefcaseProps[] = getBriefcases(ogImgTuples);

  return (
    <Main
      briefcases={briefcases}
      onSubmit={onSubmit}
      urlState={{ url, setUrl }}
    />
  );
}
