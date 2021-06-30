export class RollRef {
  static readonly QRDelimiter = "#";
  readonly id: string;
  readonly version: string;

  private constructor(id: string, version: string) {
    if (`${id}${version}`.includes(RollRef.QRDelimiter)) {
      throw new Error("ID or Version of a roll must not contain a delimiter");
    }
    if (id.length == 0 || version.length == 0) {
      throw new Error("Both ID and Version must not be empty");
    }
    this.id = id;
    this.version = version;
  }

  toQRCode(): string {
    return `${this.id}${RollRef.QRDelimiter}${this.version}`;
  }

  static fromQrCode(code: string): RollRef {
    if (!code.includes(RollRef.QRDelimiter)) {
      throw new ErrorIncorrectQrCode();
    }
    const [id, version] = code.split(RollRef.QRDelimiter);
    if (id.length == 0 || version.length == 0) {
      throw new ErrorIncorrectQrCode();
    }
    return new RollRef(id, version);
  }

  static fromObj({ id, version }: { id: string; version: string }) {
    return new RollRef(id, version);
  }

  encodeUrl(): string {
    return encodeURIComponent(this.toQRCode());
  }

  static fromUrl(urlComponent: string): RollRef {
    const qr = decodeURIComponent(urlComponent);
    return RollRef.fromQrCode(qr);
  }
}

export class ErrorIncorrectQrCode implements Error {
  message = "QR code is not valid";
  name = "IncorrectQrCode";
}
