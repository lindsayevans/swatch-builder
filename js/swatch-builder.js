// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name ansi.min.js
// ==/ClosureCompiler==

/*!
 * Swatch builder 0.0.1a - generates Adobe Swatch Exchange files, among other things
 *
 * Copyright (c) 2011 Lindsay Evans <http://linz.id.au/>
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 */

/*jslint eqeqeq: true */

var SwatchBuilder = (function(SwatchBuilder, $){

	// Metadata
	SwatchBuilder.meta = {
		type: 'application',
		name: 'Swatch Builder',
		major_version: 0,
		minor_version: 0,
		patch_version: 1,
		special_version: 'a',
		version: '0.0.1a',
		globals: ['SwatchBuilder']
	};

	SwatchBuilder.initialise = function(){

		SwatchBuilder.init_adder();

		return SwatchBuilder;
	};

	// Public properties

	SwatchBuilder.colours = {
		'#ccc': "rgb(204, 204, 204)",
		'blue': "rgb(0, 0, 255)",
		'green': "rgb(0, 128, 0)",
		'red': 	"rgb(255, 0, 0)"
	};

	// Public methods
	SwatchBuilder.init_adder = function(){
		$('#add-colour').click(function(e){
			e.preventDefault();
			var colour = $('#colour').val(), $palette_tile;

			if(!!SwatchBuilder.colours[colour] || colour === ''){
				//return false;
			}

			$palette_tile = $('<li style="background:'+colour+'" id="colour-'+colour+'" title="'+colour+'"/>').appendTo('#palette ul');

			SwatchBuilder.colours[colour] = $palette_tile.css('background-color');

		});
		$('#generate-ase').click(function(e){
			e.preventDefault();

			var i, rgb_colours = [];

			for(i in SwatchBuilder.colours){
				rgb_colours.push(SwatchBuilder.colours[i]);
			}

			console.log(ASEBuilder.generate(rgb_colours));

		});
	};

	// Private properties


	return SwatchBuilder.initialise();

})(SwatchBuilder || {}, jQuery);






// ASE file builder
// Based on: http://blog.soulwire.co.uk/code/actionscript-3/as3-ase-adobe-swatch-exchange-encoder




(function(ASEBuilder){

	// Metadata
	ASEBuilder.meta = {
		type: 'library',
		name: 'ASE Builder',
		major_version: 0,
		minor_version: 0,
		patch_version: 1,
		special_version: 'a',
		version: '0.0.1a',
		globals: ['ASEBuilder', '$ASE']
	};


	ASEBuilder.initialise = function(){
		return ASEBuilder;
	};

	ASEBuilder.ByteArray = function(){

		var ba = [];

		this.writeBytes = function(b){ba.push(b);};
		this.writeUTFBytes = function(b){ba.push(b);};
		this.writeInt = function(b){ba.push(b);};
		this.writeShort = function(b){ba.push(b);};
		this.writeFloat = function(b){ba.push(b);};

		return ba;
	};

	ASEBuilder.generate = function(pixels){

		var swatch = new ASEBuilder.ByteArray(), ase = new ASEBuilder.ByteArray(), hex, pix, i = n = 0;

		ase.writeUTFBytes(ASEBuilder.FILE_SIGNATURE);// header
		ase.writeInt(0x10000);// version
		ase.writeInt(pixels.length * 2);// blocks

		for(; i < pixels.length; ++i){
			pix = pixels[i];
			swatch.length = 0;

			// start of group

			ase.writeShort(0xC001);
			ase.writeInt(0);
			ase.writeShort(1);

			// swatch name

			hex = pix.toString(16);
			while(hex.length < 6){
				hex = '0' + hex;
			}

			swatch.writeShort((hex = '#' + hex).length + 1);
			for(; n < hex.length; ++n){
				swatch.writeShort(hex.charCodeAt(n));
			}
			swatch.writeShort(0);

			// colours

			swatch.writeUTFBytes('RGB ');
			swatch.writeFloat((pix >> 16 & 0xFF) / 255);
			swatch.writeFloat((pix >> 8 & 0xFF) / 255);
			swatch.writeFloat((pix & 0xFF) / 255);
			swatch.writeShort(2);

			// write swatch

			ase.writeInt(swatch.length);
			ase.writeBytes(swatch);
		}

		return ase;
	};


	var FILE_SIGNATURE = 'ASEF';

	ASEBuilder.colours = {};

	window.ASEBuilder = window.$ASE = ASEBuilder.initialise();

})({});





/*


const FILE_SIGNATURE : String = "ASEF";

function encode ( pixels : Array ):ByteArray
{
	var swatch : ByteArray = new ByteArray();
	var ase : ByteArray = new ByteArray();
	var hex:String;
	var pix:uint;

	ase.writeUTFBytes (FILE_SIGNATURE);// header
	ase.writeInt (0x10000);// version
	ase.writeInt (pixels.length * 2);// blocks

	for (var i : int = 0; i < pixels.length; ++i)
	{
		pix = pixels[i];
		swatch.length = 0;

		// start of group

		ase.writeShort (0xC001);
		ase.writeInt (0);
		ase.writeShort (1);

		// swatch name

		hex = pix.toString(16);
		while (hex.length < 6) hex = "0" + hex;

		swatch.writeShort ((hex = "#" + hex).length + 1);
		for (var n : int = 0; n < hex.length; ++n) swatch.writeShort (hex.charCodeAt(n));
		swatch.writeShort (0);

		// colours

		swatch.writeUTFBytes ("RGB ");
		swatch.writeFloat ((pix >> 16 & 0xFF) / 255);
		swatch.writeFloat ((pix >> 8 & 0xFF) / 255);
		swatch.writeFloat ((pix & 0xFF) / 255);
		swatch.writeShort (2);

		// write swatch

		ase.writeInt (swatch.length);
		ase.writeBytes (swatch);
	}

	return ase;
}
*/
