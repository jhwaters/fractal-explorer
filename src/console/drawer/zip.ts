import JSZip from 'jszip';

class Zipper {
  zip: JSZip
  count: number

  constructor() {
    this.zip = new JSZip();
    this.count = 0
    
  }

  addFile(data: Blob) {
    const name = 'img' + String(this.count++).padStart(4, '0') + '.png'
    this.zip.file(name, data);
  }

  download(filename: string) {
    this.zip.generateAsync({type: 'blob'}).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.append(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 1000)
    })
  }
}

export default Zipper;