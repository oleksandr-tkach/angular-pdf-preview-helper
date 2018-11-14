import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PDFPreview } from '../m-file-preview-pdf';

@Component({
  selector: 'file-preview-pdf',
  templateUrl: './file-preview-pdf.component.html',
  styles: []
})
export class FilePreviewPdfComponent implements OnInit, AfterViewInit {

  @Input('fileContent') fileContent: string;
  @Input('fileType') fileType: string;
  @Input('fileName') fileName: string;

  public pdfDetails = {
    numPages: 1,
    pageNum: 1,
    pageRendering: false
  };

  constructor(
    private pdfPreview: PDFPreview
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.pdfPreview.init();
    this.renderPDF();
  }

  private renderPDF() {
    this.pdfDetails.pageRendering = true;
    this.pdfPreview.base64ToPDF(this.fileContent)
      .then((res: any) => this.renderHandler(res));
  }

  onPDFPrevPageClick() {
    this.pdfPreview.openPrevPage()
      .then((res: any) => this.renderHandler(res));
  }

  onPDFNextPageClick() {
    this.pdfPreview.openNextPage()
      .then((res: any) => this.renderHandler(res));
  }

  onPDFZoomClick() {
    this.pdfPreview.toggleZoom();
  }

  private renderHandler(res: any) {
    if (res) {
      this.pdfDetails = {
        numPages: res.numPages,
        pageNum: res.pageNum,
        pageRendering: false
      };
    }
  }

}
