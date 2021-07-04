export class CMSSite {
  constructor(
    public name?: string,
    public shortDescription?: string,
    public backgroundImageUrl?: string,
    public siteContents: CMSSiteContent[] = new Array<CMSSiteContent>()
  ) {}
}

export class CMSSiteContent {
  constructor(
    public position?: number,
    public contents: CMSContentDetail[] = new Array<CMSContentDetail>()
  ){}
}

export class CMSContentDetail {
  constructor(
      public title?: string,
      public content?: string,
      public imageUrl?: string
  ) {}
}
