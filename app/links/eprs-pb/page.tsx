import { redirect } from "next/navigation";

export default function EPRSPBRedirect() {
  redirect(
    "https://www.europarl.europa.eu/RegData/etudes/BRIE/2024/762412/EPRS_BRI(2024)762412_EN.pdf"
  );
}
