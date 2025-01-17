import {Link} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {SitewideBannerQuery} from 'storefrontapi.generated';

interface BannerObject {
  background_color: string;
  foreground_color: string;
  contents: string[];
  collection: {handle: string; title: string};
}

const TRANSITION_PERIOD = 5000;

export function SitewideBanner({data}: {data: SitewideBannerQuery}) {
  const fields = data.metaobject?.fields.reduce((obj, f) => {
    if (f.key === 'contents') {
      return {
        ...obj,
        contents: JSON.parse(f.value!),
      };
    }

    if (f.key === 'collection') {
      return {
        ...obj,
        collection: {
          handle: f.reference?.handle,
          title: f.reference?.title,
        },
      };
    }

    return {
      ...obj,
      [f.key]: f.value,
    };
  }, {}) as BannerObject;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!fields.contents?.length) return;

    const timeout = setInterval(() => {
      setCurrentIndex((value) => (value + 1) % fields.contents.length);
    }, TRANSITION_PERIOD);

    return () => {
      clearInterval(timeout);
    };
  }, [fields.contents]);

  const currentBanner = fields?.contents[currentIndex];

  return (
    <Link
      to={`/collections/${fields.collection.handle}`}
      title={`Go to ${fields.collection.title}`}
    >
      <div
        className="p-2 text-center font-semibold text-sm"
        style={{
          backgroundColor: fields?.background_color,
          color: fields?.foreground_color,
        }}
      >
        <p>{currentBanner}</p>
      </div>
    </Link>
  );
}
