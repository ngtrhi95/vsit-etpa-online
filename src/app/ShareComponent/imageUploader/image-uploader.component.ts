import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { UploadMetadata } from './before-upload.interface';
import { ImageService } from '../../services/image.service';
import { Style } from './style';
import { BlockUIService } from '../../services/blockUI.service';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [ImageService]
})
export class ImageUploadComponent implements OnInit, OnChanges {
  files: FileHolder[] = [];
  uploadedFileHolders: FileHolder[] = [];
  fileCounter: number = 0;
  fileOver: boolean = false;
  showFileTooLargeMessage: boolean = false;

  @Input() uploadUrl: string;
  @Input() domain: string;
  @Input() beforeUpload: (UploadMetadata) => UploadMetadata | Promise<UploadMetadata> = data => data;
  @Input() buttonCaption = 'Chọn file';
  @Input('class') cssClass = 'img-ul';
  @Input() clearButtonCaption = 'Xóa';
  @Input() dropBoxMessage = 'hoặc thả tệp tại đây...';
  @Input() fileTooLargeMessage;
  @Input() headers: Headers | { [name: string]: any };
  @Input() max = 15;
  @Input() maxFileSize: number;
  @Input() preview = true;
  @Input() partName: string;
  @Input() style: Style;
  @Input('extensions') supportedExtensions: string[];
  @Input() withCredentials = false;
  @Input() uploadSequentially = false;
  @Input() uploadedFiles: string[] | Array<{ url: string, fileName: string, blob?: Blob }> = [];
  @Output() removed = new EventEmitter<FileHolder>();
  @Output() uploadStateChanged = new EventEmitter<boolean>();
  @Output() uploadStarted = new EventEmitter<boolean>();
  @Output() uploadFinished = new EventEmitter<FileHolder>();
  @Output() uploadAllFinished = new EventEmitter();
  @Output() fileClicked = new EventEmitter<string>();

  @ViewChild('input')
  private inputElement: ElementRef;
  private pendingFilesCounter: number = 0;
  constructor(private imageService: ImageService, private blockUI: BlockUIService) {
  }

  ngOnInit() {
    if (!this.fileTooLargeMessage) {
      this.fileTooLargeMessage = 'Kích thước hình ảnh quá lớn.' + (this.maxFileSize ? (' Kích thước tối đa là ' + this.maxFileSize / 1048576) + 'MB.' : '');
    }
    this.supportedExtensions = this.supportedExtensions ? this.supportedExtensions.map((ext) => 'image/' + ext) : ['image/*'];
  }

  deleteAll() {
    this.files.forEach(f => this.removed.emit(f));
    this.files = [];
    this.fileCounter = 0;
    this.inputElement.nativeElement.value = '';
  }

  deleteFile(file: FileHolder): void {
    let index = this.files.indexOf(file);
    this.files.splice(index, 1);
    this.fileCounter--;
    this.inputElement.nativeElement.value = '';
    this.removed.emit(file);
  }

  onFileClicked(file: FileHolder) {
    this.fileClicked.emit(file.src);
  }

  ngOnChanges(changes) {
    if (changes.uploadedFiles && changes.uploadedFiles.currentValue.length > 0) {
      this.processUploadedFiles();
    }
  }

  onFileChange(files: FileList) {
    let remainingSlots = this.countRemainingSlots();
    let filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;

    if (this.uploadUrl && filesToUploadNum != 0) {
      this.uploadStateChanged.emit(true);
    }

    this.fileCounter += filesToUploadNum;
    this.showFileTooLargeMessage = false;
    this.collectImagesToUpload(files, filesToUploadNum);
  }

  onFileOver = (isOver) => this.fileOver = isOver;

  private countRemainingSlots = () => this.max - this.fileCounter;

  private onResponse(response: Response, fileHolder: FileHolder) {
    fileHolder.serverResponse = { status: response.status, response };
    fileHolder.pending = false;
    fileHolder.uploaded = true;
    fileHolder.succeeded = response.status == 200 && response.json().success;

    this.uploadFinished.emit(fileHolder);

    if (--this.pendingFilesCounter == 0) {
      this.uploadStateChanged.emit(false);
      this.uploadAllFinished.emit();
    }
  }

  private processUploadedFiles() {
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      let data: any = this.uploadedFiles[i];

      let fileBlob: Blob,
        file: File,
        fileUrl: string;

      if (data instanceof Object) {
        fileUrl = data.url;
        fileBlob = (data.blob) ? data.blob : new Blob([data]);
        file = new File([fileBlob], data.fileName);
      } else {
        fileUrl = this.domain + data;
        fileBlob = new Blob([fileUrl]);
        file = new File([fileBlob], fileUrl);
      }

      this.uploadedFileHolders.push(new FileHolder(fileUrl, file));
    }
  }

  GetPendingFileNumber(): number
  {
      let count: number = 0;
      this.files.forEach(f => 
        {
          if(!f.succeeded)
            count++;
        }
      );
      return count;
  }

  // private async uploadFiles(files: FileList, filesToUploadNum: number) {
  private async uploadFiles() {
    this.pendingFilesCounter = this.GetPendingFileNumber();
    if (this.pendingFilesCounter <= 0) {
      return;
    }

    this.uploadStarted.emit(true);

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i].file;

      if (this.maxFileSize && file.size > this.maxFileSize) {
        this.fileCounter--;
        this.pendingFilesCounter--;
        this.inputElement.nativeElement.value = '';
        this.showFileTooLargeMessage = true;
        continue;
      }

      const beforeUploadResult: UploadMetadata = await this.beforeUpload({ file, url: this.uploadUrl, abort: false });

      if (beforeUploadResult.abort) {
        this.fileCounter--;
        this.pendingFilesCounter--;
        this.inputElement.nativeElement.value = '';
        continue;
      }

      var fileHolder: FileHolder = this.files[i];
      if (fileHolder.succeeded)
        continue;

      if (this.uploadSequentially)
        await this.uploadSingleFileAsync(fileHolder, beforeUploadResult.url, beforeUploadResult.formData);
      else
        this.uploadSingleFile(fileHolder, beforeUploadResult.url, beforeUploadResult.formData);
    }
  }

  private async retryToUploadFile(index: number) {
    var fileHolder: FileHolder = this.files[index];
    fileHolder.pending = true;
    fileHolder.uploaded = false;
    const file = fileHolder.file;
    if (this.maxFileSize && file.size > this.maxFileSize) {
      this.fileCounter--;
      this.inputElement.nativeElement.value = '';
      this.showFileTooLargeMessage = true;
      return;
    }

    const beforeUploadResult: UploadMetadata = await this.beforeUpload({ file, url: this.uploadUrl, abort: false });

    if (beforeUploadResult.abort) {
      this.fileCounter--;
      this.inputElement.nativeElement.value = '';
      return;
    }

    this.uploadSingleFile(fileHolder, beforeUploadResult.url, beforeUploadResult.formData);
  }

  private collectImagesToUpload(files: FileList, filesToUploadNum: number) {
    try {
      if (filesToUploadNum == 0)
        return;

      this.blockUI.start('Đang xử lý...');
      for (let i = 0; i < filesToUploadNum; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
          const fileHolder: FileHolder = new FileHolder(event.target.result, file);
          this.files.push(fileHolder);
          if (i == filesToUploadNum - 1 || this.files.length == this.max)
            this.blockUI.stop();
        }, false);
        reader.readAsDataURL(file);
      }
    }
    catch (ex) {
      this.blockUI.stop();
    }
  }

  private uploadSingleFile(fileHolder: FileHolder, url = this.uploadUrl, customForm?: { [name: string]: any }) {
    if (url) {
      //this.pendingFilesCounter++;
      fileHolder.pending = true;

      this.imageService
        .postImage(this.uploadUrl, fileHolder.file, this.headers, this.partName, customForm, this.withCredentials)
        .subscribe(
        response => this.onResponse(response, fileHolder),
        error => {
          this.onResponse(error, fileHolder);
          //this.deleteFile(fileHolder);
        });
    } else {
      this.uploadFinished.emit(fileHolder);
    }
  }

  private async uploadSingleFileAsync(fileHolder: FileHolder, url = this.uploadUrl, customForm?: { [name: string]: any }): Promise<any> {
    try {
      //this.pendingFilesCounter++;
      fileHolder.pending = true;
      var result = await this.imageService
        .postImageAsync(this.uploadUrl, fileHolder.file, this.headers, this.partName, customForm, this.withCredentials);
      this.onResponse(result, fileHolder);
    }
    catch (error) {
      this.onResponse(error, fileHolder);
    }
  }
}


export class FileHolder {
  public pending: boolean = false;
  public uploaded: boolean = false;
  public succeeded: boolean = false;
  public serverResponse: { status: number, response: any };

  constructor(public src: string, public file: File) {
  }
}