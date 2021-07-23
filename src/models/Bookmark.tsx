export class Bookmark {
    ReservoirIdentifier: string = '';
    ReservoirName: string = '';

    constructor(json: Bookmark) {
        this.ReservoirIdentifier = json.ReservoirIdentifier;
        this.ReservoirName =  json.ReservoirName;
    }
}
