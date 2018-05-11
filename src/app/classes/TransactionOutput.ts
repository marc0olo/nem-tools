export class TransactionOutput {
    type: string;
    block: string;
    mode: string;
    fee: string;
    xem: string;
    mosaics: string;
    recipient: string;
    sender: string;
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
        this.recipient = '';
        this.sender = '';
        this.message = '';
        this.date = '';
        this.timestamp = '';
        this.hash = '';
    }

    isImportanceTransaction() {
        return this.type === 'ImportanceTransferTransaction';
    }
}