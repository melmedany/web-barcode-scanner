var beep = new Audio("asset/audio/barcode.wav"),
code = $('#code-scaned'),
scan = $("#scan-barcode"),
stop = $('#stop-barcode'),
barcode = $('#barcode')
barcodeTypes = ["code_128_reader", "ean_reader", 
               "ean_8_reader", "code_39_reader", 
               "code_39_vin_reader", "codabar_reader", 
               "upc_reader", "upc_e_reader", 
               "i2of5_reader"];

$(document).ready(function() {

    stop.click(function() {
        Quagga.stop();
        barcode.html('');
        stop.hide();
    });

    scan.click(function() {
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: document.querySelector('#barcode')    // Or '#yourElement' (optional)
            },
            decoder : {readers : barcodeTypes }
            }, function(err) {
                if (err) {
                console.log(err);
                return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
                stop.show();
        });
    });

    Quagga.onDetected(function(result) {
        var scanned = result.codeResult.code;
        console.log("Detected Barcode: " + scanned);
        code.val(scanned);
        beep.play();   
        scan.text('Re-Scan');
        stop.click();
    });

});