import JSZip from 'jszip';
import { download } from './download';

class Zipper {
  zip: JSZip

  constructor() {
    this.zip = new JSZip();
  }

  file(name: string, data: Blob | Promise<Blob>) {
    this.zip.file(name, data);
  }

  download(filename: string) {
    this.zip.generateAsync({type: 'blob'}).then(blob => {
      const url = URL.createObjectURL(blob);
      download(url, filename);
    })
  }
}

export default Zipper;