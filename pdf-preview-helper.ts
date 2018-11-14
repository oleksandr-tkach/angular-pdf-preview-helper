import { Injectable } from '@angular/core';
import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = 'assets/pdfjs/pdf.worker.min.js';
declare let document: any;

@Injectable()
export class PDFPreview {

    canvas: any;
    context: any;
    pageElement: any;

    fitScale: number;
    zoomed: boolean;

    pdfFile: any;
    page: any;
    currPageNumber: number;

    constructor() {
    }

    init() {
        this.canvas = <HTMLCanvasElement>document.getElementById('m-file-preview-pdf');
        this.canvas.style['-webkit-box-shadow'] = '0px 3px 37px -8px rgba(97, 97, 97, 1)';
        this.canvas.style['-moz-box-shadow'] = '0px 3px 37px -8px rgba(97, 97, 97, 1)';
        this.canvas.style['box-shadow'] = '0px 3px 37px -8px rgba(97, 97, 97, 1)';
        this.canvas.style['max-width'] = '100%';

        this.context = this.canvas.getContext('2d');
        this.pageElement = document.getElementById('pageElement');

        this.fitScale = 1;
        this.zoomed = false;

        this.currPageNumber = 1;
    }

    base64ToPDF(pdfData: any) {
        const loadingTask = PDFJS.getDocument({ data: atob(pdfData) });
        return new Promise((resolve, reject) => {
            return loadingTask.promise.then((pdf: any) => {
                this.pdfFile = pdf;
                return this.openPage()
                    .then((res: any) => {
                        resolve(res);
                    });
            }, (reason) => {
                console.error(reason);
                return reject(reason);
            });
        });
    }

    openPage() {
        let scale = this.zoomed ? this.fitScale : 1;
        return new Promise((resolve, reject) => {
            this.pdfFile.getPage(this.currPageNumber)
                .then((page) => {
                    this.page = page;
                    let viewport = this.page.getViewport(1);

                    if (this.zoomed) {
                        scale = this.pageElement.clientWidth / viewport.width;
                        viewport = this.page.getViewport(scale);
                    }

                    this.canvas.height = viewport.height;
                    this.canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: this.context,
                        viewport: viewport
                    };

                    this.page.render(renderContext);
                    return resolve({
                        numPages: this.pdfFile.numPages,
                        pageNum: this.currPageNumber
                    });
                });
        });
    }

    toggleZoom() {
        this.zoomed = !this.zoomed;
        return this.openPage();
    }

    openPrevPage() {
        const pageNumber = Math.max(1, this.currPageNumber - 1);
        if (pageNumber !== this.currPageNumber) {
            this.currPageNumber = pageNumber;
            return this.openPage();
        }
        return Promise.resolve(null);
    }

    openNextPage() {
        const pageNumber = Math.min(this.pdfFile.numPages, this.currPageNumber + 1);
        if (pageNumber !== this.currPageNumber) {
            this.currPageNumber = pageNumber;
            return this.openPage();
        }
        return Promise.resolve(null);
    }

}
