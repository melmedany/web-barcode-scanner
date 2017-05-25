var beep = new Audio("asset/audio/barcode.wav"),
code = $('#code-scaned'),
scan = $("#scan-barcode"),
stop = $('#stop-barcode'),
barcodeModal = $('#barcodeModal'),
barcodeTypes = ["code_128_reader", "ean_reader", 
               "ean_8_reader", "code_39_reader", 
               "code_39_vin_reader", "codabar_reader", 
               "upc_reader", "upc_e_reader", 
               "i2of5_reader"];

$(document).ready(function() {
	
	// if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') 
	var supported = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
	if (supported) {
		
		$('.js-modal').modal();
		stop.click(function() {
			Quagga.stop();
			$('.span-8').addClass(' span-10 ');
			$('.span-8').removeClass(' span-8 ');
			$('.span-4').addClass(' span-2 ');
			$('.span-4').removeClass(' span-4 ');
			scan.css('max-width', '');
			stop.css('max-width', '');
			stop.hide();
		});

		scan.click(function() {
			barcodeModal.click();
			$('.modal-inner > .modal-body').html('<div class="test-body">'
			+'<div id="loader" class="loader bar-wave">'
			+'<span></span>'
			+'<span></span>'
			+'<span></span>'
			+'<span></span>'
			+'<span></span>'
			+'<div class="loader-message">'
			+'Loading...'
			+'</div>'
			+'</div>'
			+'<div id="interactive" class="viewport"><video autoplay="true" preload="auto" src=""></video></div>');
			/*+'<div id="barcode" style="height: 74%;"></div>'
			+'</div>'*/


			loader = $('#loader');
			interactive = $('#interactive');
			interactive.hide();
			
			state = {
				inputStream: {
					type : "LiveStream",
					constraints: {
						width: {min: 320},
						height: {min: 480},
						aspectRatio: {min: 1, max: 100},
						facingMode: "environment"
					}
				},
				locator: {
					patchSize: "small",
					halfSample: true
				},
				numOfWorkers: 8,
				decoder: {
					readers : [{
						format: "code_128_reader",
						config: {}
					}]
				},
				locate: false
			};
			
			Quagga.init(state, function(err) {
					if (err) {
						console.log(err);
						loader.hide();
						return
					}
					console.log("Initialization finished. Ready to start");
					Quagga.start();                
					loader.hide();
					interactive.show();
					$('.js-modal').on('clickout', function() {
						loader.show();
						stop.click();               
						loader.hide();
					});
					$('.span-10').addClass(' span-8 ');
					$('.span-10').removeClass(' span-10 ');
					$('.span-2').addClass(' span-4 ');
					$('.span-2').removeClass(' span-2 ');
					scan.css('max-width', '49%');
					stop.css('max-width', '49%');
					stop.show();

			});
		});

		Quagga.onDetected(function(result) {
			beep.play();   
			console.log("Detected Barcode: " + result.codeResult.code);
			code.val(result.codeResult.code);
			scan.text('Re-Scan');
			$('.modal-inner > .modal-foot > .button').click();
			stop.click();
		});
		
		Quagga.onProcessed(function(result) {
			var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

			if (result) {
				if (result.boxes) {
					drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
					result.boxes.filter(function (box) {
						return box !== result.box;
					}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "red", lineWidth: 2});
					});
				}

				if (result.box) {
					Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
				}

				if (result.codeResult && result.codeResult.code) {
					Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
				}
			}
		});
		
	} else {
		
		$('.not-supported').show();
		
	}
});