import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { UploadMetadata } from './before-upload.interface';
import { ImageService } from '../../../../services/image.service';
import { Style } from './style';
import { BlockUIService } from '../../../../services/blockUI.service';
import { FileType } from './filetype.class';

@Component({
  selector: 'image-upload-mobile',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [ImageService]
})
export class ImageUploadMobileComponent implements OnInit, OnChanges {
  files: FileHolder[] = [];
  @Input() 
  set _files(value: FileHolder[]) {
    this.files = value;
    this.numberOfFileChange.emit(value.length);
  }
  uploadedFileHolders: FileHolder[] = [];
  fileCounter: number = 0;
  fileOver: boolean = false;
  showFileTooLargeMessage: boolean = false;
  fileType: FileType = new FileType();
  clickUploadedFile: boolean = true;

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
  @Input()
  set isUploadFile(value: boolean) {
    if (value === true) {
      this.uploadFiles();
    }
  }
  @Input() isCreateContract: boolean = false;
  @Input() buttonUploadFilesHidden: boolean = false;
  @Input() uploadCode: string = '';
  @Input() buttonDownloadFilesHidden: boolean = false;
  @Output() removed = new EventEmitter<FileHolder>();
  @Output() uploadStateChanged = new EventEmitter<boolean>();
  @Output() uploadStarted = new EventEmitter<boolean>();
  @Output() uploadFinished = new EventEmitter<FileHolder>();
  @Output() uploadAllFinished = new EventEmitter();
  @Output() fileClicked = new EventEmitter<string>();
  @Output() uploadSuccess = new EventEmitter<boolean>();
  @Output() numberOfFileChange = new EventEmitter<number>();
  @Output() listFileChange = new EventEmitter<FileHolder[]>();

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
    this.numberOfFileChange.emit(this.files.length);
    this.listFileChange.emit(this.files);
  }

  deleteFile(file: FileHolder): void {
    let index = this.files.indexOf(file);
    this.files.splice(index, 1);
    this.fileCounter--;
    this.inputElement.nativeElement.value = '';
    this.removed.emit(file);
    this.numberOfFileChange.emit(this.files.length);
    this.listFileChange.emit(this.files);
  }

  onFileClicked(file: FileHolder) {
    if (file.type === "image") {
      this.fileClicked.emit(file.src);
    } else if (file.type === "pdf" || file.type === "doc" || file.type === "xls" || file.type === "ppt") {
      this.fileClicked.emit("https://docs.google.com/gview?url=" + file.srcView);
    } else {
      this.fileClicked.emit(file.srcView);
    }
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
    if (!fileHolder.succeeded) {
      this.uploadSuccess.emit(false);
    } else {
      this.uploadSuccess.emit(true);
    }

    if (--this.pendingFilesCounter == 0) {
      this.uploadStateChanged.emit(false);
      this.uploadAllFinished.emit();
      return true;
    }
    return false;
  }

  private processUploadedFiles() {
    this.uploadedFileHolders = [];
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      let data: any = this.uploadedFiles[i];

      let fileBlob: Blob,
        file: File,
        fileUrl: string;

      if (data instanceof Object) {
        fileUrl = this.domain + data.url;
        fileBlob = (data.blob) ? data.blob : new Blob([data]);
        file = new File([fileBlob], data.fileName);

      } else {
        fileUrl = this.domain + data;

        fileBlob = new Blob([fileUrl]);
        file = new File([fileBlob], fileUrl);
      }
      let fileHolder = new FileHolder(fileUrl, file);
      fileHolder.type = data.type;
      fileHolder.createdBy = data.createdBy;
      fileHolder.createdDate = data.createdDate;
      var path = fileHolder.src;
      if (fileHolder.type !== "image") {
        let src = FileType.getUrlBase64(fileHolder.type);
        fileHolder.srcView = path;
        fileHolder.src = src;
      }
      this.uploadedFileHolders.push(fileHolder);
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
    public async uploadFiles() {
      this.pendingFilesCounter = this.GetPendingFileNumber();
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
      // this.numberOfFileChange.emit(filesToUploadNum);
      if (filesToUploadNum == 0)
        return;

      // this.blockUI.start('Đang xử lý...');
      for (let i = 0; i < filesToUploadNum; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
          const fileHolder: FileHolder = new FileHolder(event.target.result, file);
          let mimeClass = FileType.getMimeClass(fileHolder.file);
          fileHolder.type = mimeClass;
          if (mimeClass.toString() !== 'image' && 
              mimeClass.toString() !== 'pdf' && 
              mimeClass.toString() !== 'compress') {
                fileHolder.invalidFileFormat = true;
          }
          if (mimeClass !== 'image') {
            let src = FileType.getUrlBase64(mimeClass);
            fileHolder.src = src;
          }
          if (file.size > this.maxFileSize) {
            fileHolder.invalidFileSize = true;
            fileHolder.invalidFileSizeMessage = 'Kích thước tối đa là ' + (this.maxFileSize / 1048576) + 'MB.';
          }
          this.files.push(fileHolder);
          if (i == filesToUploadNum - 1 || this.files.length == this.max)
            this.blockUI.stop();
        }, false);
        reader.readAsDataURL(file);
      }
      setTimeout(() => {
        this.listFileChange.emit(this.files);
        this.numberOfFileChange.emit(this.fileCounter);
      }, 1);
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
  public type: string = '';
  public srcView: string = '';
  public createdBy: string = '';
  public createdDate: Date = null;
  public invalidFileFormat: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileSizeMessage: string = '';
  public serverResponse: { status: number, response: any };

  constructor(public src: string, public file: File) {
  }
}