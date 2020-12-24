import QRCode from "qrcode.react";
import { Media } from "../../context-providers";
import treeckleLogo from "../../assets/treeckle-outline-min.png";

type Props = {
  value: string;
};

function QrCodeViewer({ value }: Props) {
  return (
    <>
      <Media lessThan="mobile">
        <QRCode
          value={value}
          size={128}
          imageSettings={{
            src: treeckleLogo,
            width: 32,
            height: 32,
          }}
        />
      </Media>
      <Media at="mobile">
        <QRCode
          value={value}
          size={256}
          imageSettings={{
            src: treeckleLogo,
            width: 64,
            height: 64,
          }}
        />
      </Media>
      <Media at="tablet">
        <QRCode
          value={value}
          size={384}
          imageSettings={{
            src: treeckleLogo,
            width: 96,
            height: 96,
          }}
        />
      </Media>
      <Media between={["computer", "widescreen"]}>
        <QRCode
          value={value}
          size={512}
          imageSettings={{
            src: treeckleLogo,
            width: 128,
            height: 128,
          }}
        />
      </Media>
      <Media greaterThanOrEqual="widescreen">
        <QRCode
          value={value}
          size={768}
          imageSettings={{
            src: treeckleLogo,
            width: 192,
            height: 192,
          }}
        />
      </Media>
    </>
  );
}

export default QrCodeViewer;
