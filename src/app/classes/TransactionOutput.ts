export class TransactionOutput {
    type: string;
    block: string;
    mode: string;
    fee: string;
    xem: string;
    mosaics: string;
    sender: string;
    recipient: string;
    message: string;
    date: string;
    timestamp: string;
    hash: string;
  
    constructor() {
        this.type = '';
        this.block = '';
        this.mode = '';
        this.fee = '';
        this.xem = '';
        this.mosaics = '';
        this.sender = '';
        this.recipient = '';
        this.message = '';
        this.date = '';
        this.timestamp = '';
        this.hash = '';
    }

    isImportanceTransaction() {
        return this.type === 'ImportanceTransferTransaction';
    }
}