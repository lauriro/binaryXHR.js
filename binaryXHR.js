

/**
 * Read binary files over XHR
 *
 * @version  0.1
 * @author   Lauri Rooden - https://github.com/lauriro/binaryXHR.js
 * @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
 */




var binaryXHR = function() {
	// VBScript injection for IE 6
	"ActiveXObject" in window && document.write('<scr'+'ipt type="text/vbscript">\n'+
		'Class myFakeString\n'+
		'  Public byteArray\n'+
		//'  Public length\n'+
		'  Public Function charCodeAt(n)\n'+
		'    charCodeAt = AscB(MidB(byteArray,n+1,1))\n'+
		'  End function\n'+
		//'  Public Function charAt(n)\n'+
		//'    charAt = Chr(AscB(MidB(byteArray,n+1,1)))\n'+
		//'  End function\n'+
		'End Class\n'+
		'Function vbFakeString(byteArray)\n'+
		'  set vbFakeString = New myFakeString\n'+
		'  vbFakeString.byteArray = byteArray\n'+
		//'  vbFakeString.length = LenB(byteArray)\n'+
		'End Function\n'+
		'Function vbBinLen(byteArray)\n'+
		'  vbBinLen = LenB(byteArray)\n'+
		'End Function\n'+
		'</scr'+'ipt>')

	return function(url, callback, on_progress) {
		var len, done, req = new XMLHttpRequest()
		req.open("GET", url, true);
		req.onreadystatechange = function() {
			if (req.readyState == 3) {
				if ( on_progress ) try {
					len || (len = req.getResponseHeader( "Content-Length" ))
					var i = ("responseBody" in req) ? vbBinLen(req.responseBody) : req.responseText.length
					i = ((i/len*20)>>>0)*5
					done == i || on_progress(done = i)
				}catch(e){}
			} else if (req.readyState == 4) {
				on_progress && on_progress( (req.status == 200) , req)
				req.status == 200 && callback( "responseBody" in req ? vbFakeString(req.responseBody) : req.responseText)
			}
		}
		"overrideMimeType" in req && req.overrideMimeType("text/plain; charset=x-user-defined")
		req.send()
	}
}();

