import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Navigation from '../components/Navigation'
import CryptoCompare from '../components/CryptoCompare'
import nem from 'nem-sdk'
import * as exceljs from '../../node_modules/exceljs/dist/exceljs'
import * as filesaver from '../../node_modules/file-saver/FileSaver'

class Logic extends Component {
  render() {
    var wb = new exceljs.Workbook();
    var wsTransactions = wb.addWorksheet('transactions');
    var wsImportanceTransfers = wb.addWorksheet('importanceTransfers');
    var wsHarvests = wb.addWorksheet('harvests');

    wsTransactions.getCell('A1').value = "Date";
    wsTransactions.getCell('B1').value = "Signer";
    wsTransactions.getCell('C1').value = "Recipient";
    wsTransactions.getCell('D1').value = "Message";
    wsTransactions.getCell('E1').value = "Fee";
    wsTransactions.getCell('F1').value = "Amount";

    wsImportanceTransfers.getCell('A1').value = "Date";
    wsImportanceTransfers.getCell('B1').value = "Signer";
    wsImportanceTransfers.getCell('C1').value = "Type";
    wsImportanceTransfers.getCell('D1').value = "Fee";

    wsHarvests.getCell('A1').value = "Date";
    wsHarvests.getCell('B1').value = "Harvested Fee";

    var supernodes = [];
    nem.com.requests.supernodes.all().then(function(res) {
      supernodes = res.nodes;
      console.log("Supernode IP: " + supernodes[0].ip);
    }, function(err) {
      console.error(err);
    });

    var address = "NAAEWHQWSAU35EFTMKDU3UPTH35WLDG3JKLZ3MYB";
    var mainnetUrl = "http://62.75.251.134";
    var endpoint = nem.model.objects.create("endpoint")(mainnetUrl, nem.model.nodes.defaultPort);

    nem.com.requests.account.data(endpoint, address).then(function(res) {
      console.log("Metadata ...");
      console.log(res);
      console.log("POI-Score: " + nem.utils.format.nemImportanceScore(res.account.importance) + "* 10^-4");
      console.log("Balance: " + nem.utils.format.nemValue(res.account.balance));
      console.log("Balance (vested): " + nem.utils.format.nemValue(res.account.vestedBalance));
      console.log("Harvested Blocks: " + res.account.harvestedBlocks);
      console.log("Remote-Status: " + res.meta.remoteStatus);
      console.log("Status: " + res.meta.status);
    }, function(err) {
      console.error(err);
    });

    var transactions = [];
    nem.com.requests.account.allTransactions(endpoint, address).then(function(res) {
      transactions = res;
      console.log("Transactions ...");
      var zaehler = 2;
      transactions.forEach(function(element) {
        if ( element.transaction.mode  === undefined ) {
          wsTransactions.getCell('A' + zaehler).value = nem.utils.format.nemDate(element.transaction.timeStamp);
          wsTransactions.getCell('B' + zaehler).value = nem.utils.format.pubToAddress(element.transaction.signer, nem.model.network.data.mainnet.id);
          wsTransactions.getCell('C' + zaehler).value = element.transaction.recipient;
          wsTransactions.getCell('D' + zaehler).value = nem.utils.format.hexMessage(element.transaction.message);
          wsTransactions.getCell('E' + zaehler).value = nem.utils.format.nemValue(element.transaction.fee);
          wsTransactions.getCell('F' + zaehler).value = nem.utils.format.nemValue(element.transaction.amount);

          console.log("Amount: " + nem.utils.format.nemValue(element.transaction.amount)
            + " | Fee: " +  nem.utils.format.nemValue(element.transaction.fee)
            + " | Signer: " +  nem.utils.format.pubToAddress(element.transaction.signer, nem.model.network.data.mainnet.id)
            + " | Recipient: " + element.transaction.recipient
            + " | Message: " + nem.utils.format.hexMessage(element.transaction.message)
            + " | Date: " + nem.utils.format.nemDate(element.transaction.timeStamp));
        } else {
          wsImportanceTransfers.getCell('A' + zaehler).value = nem.utils.format.nemDate(element.transaction.timeStamp);
          wsImportanceTransfers.getCell('B' + zaehler).value = nem.utils.format.pubToAddress(element.transaction.signer, nem.model.network.data.mainnet.id);
          wsImportanceTransfers.getCell('C' + zaehler).value = nem.utils.format.importanceTransferMode(element.transaction.mode);
          wsImportanceTransfers.getCell('D' + zaehler).value = nem.utils.format.nemValue(element.transaction.fee);

          console.log("Importance-Transfer: " + nem.utils.format.importanceTransferMode(element.transaction.mode)
            + " | Fee: " +  nem.utils.format.nemValue(element.transaction.fee)
            + " | Signer: " +  nem.utils.format.pubToAddress(element.transaction.signer, nem.model.network.data.mainnet.id) );
        }
        zaehler += 1;
      },this);
      console.log(transactions);

      var harvestedBlocks = [];
      nem.com.requests.account.harvestedBlocks(endpoint, address).then(function(res) {
        harvestedBlocks = res;
        console.log("Harvested Blocks ...");
        console.log(harvestedBlocks);
        var zaehler = 2;
        harvestedBlocks.forEach(function(element) {
          wsHarvests.getCell('A' + zaehler).value = nem.utils.format.nemDate(element.timeStamp);
          wsHarvests.getCell('B' + zaehler).value = nem.utils.format.nemValue(element.totalFee);

          console.log("Harvested Fee: " + nem.utils.format.nemValue(element.totalFee) + " (" + nem.utils.format.nemDate(element.timeStamp) + ")");

          zaehler += 1;
        }, this);
        wb.xlsx.writeBuffer()
          .then(function(buffer) {
            // filesaver.saveAs(new Blob([buffer],{type:"application/octet-stream"}), "nem-export.xlsx");
        })
        .catch(function(error) {
            throw error;
        });
      }, function(err) {
        console.error(err);
      });
    }, function(err) {
      console.error(err);
    });
    return (
        <div></div>
    );
  }
}

export default Logic;