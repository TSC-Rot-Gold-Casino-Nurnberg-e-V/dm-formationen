import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Das Akkreditierungsformular überträgt bis zu zwei Dateien (Presseausweis +
      // unterschriebener Ehrenkodex). Der Next.js-Standardwert von 1 MB reicht dafür
      // nicht aus. Vercel begrenzt Requests plattformseitig hart auf 4,5 MB – dieser
      // Wert lässt bewusst Puffer für Header und die übrigen Formularfelder.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
