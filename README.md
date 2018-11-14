# Angular2 PDF file preview helper

## Requirements

- install pdfjs-dist package
- include pdf.worker.min.js file

## How to use?

Include PDFPreview

Inject PDFPreview into component constructor

Init pdfPreview inside component ngAfterViewInit hook

```
this.pdfPreview.init()
```

Available methods:
* base64ToPDF()
* openPrevPage()
* openNextPage()
* toggleZoom

Check out example component inside **file-preview-pdf** folder