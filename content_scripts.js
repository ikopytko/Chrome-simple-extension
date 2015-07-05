var vars = retrieveWindowVariables(["_SERVER_HOST", "_AUDIO_HTTP_HOST"]);

// Form original page
function GetLink(a, b, c, e) {
    vars._SERVER_HOST == vars._AUDIO_HTTP_HOST ? 
    (b = "http://" + vars._SERVER_HOST + "/player-mp3Handler.php?path=" + b,
     c = "http://" + vars._SERVER_HOST + "/player-oggHandler.php?path=" + c) :
    (b = "http://" + vars._AUDIO_HTTP_HOST + "/mp3/" + base64_decode(b), 
     c = "http://" + vars._AUDIO_HTTP_HOST + "/ogg/" + base64_decode(c));
    
    return b;
}

// get all play buttons
$('.play').each(function(i, obj) {
  // retrieve onclick attribute content from this button and parse its parametrs
  var clickFn = $("#"+obj.id).attr("onclick");
  var atrs = linkify(clickFn);
  var a = atrs[0];
  var b = atrs[1];
  var c = atrs[2];

  // get link to the file
	var link = GetLink(a, b, c);
  // get internal resource
	var donwImg = chrome.extension.getURL('d.png');
  // get file name - currently it doesn't work becouse of host headers 
  var name = $(this).next().text();

  // insert our link after play button
  // download attribute forces brouser to download file instead of playing it
  $(this).after("<a download='"+name+"' href='"+link+"'><img src='"+donwImg+"'/></a>"); //
});

function linkify(text) {
  // it's not very accuracy... 
  var funcArgs = text.substring(5, text.length - 16);
  // replace all occurrences of '
  var res = funcArgs.replace(/["']/g, "");
  return res.split(",")
}

// great function to retrieve js variables from page
function retrieveWindowVariables(variables) {
  var ret = {};
  var scriptContent = "";
  for (var i = 0; i < variables.length; i++) {
      var currVariable = variables[i];
      scriptContent += "if (typeof " + currVariable + " !== 'undefined') $('body').attr('tmp_" + currVariable + "', " + currVariable + ");\n"
  }
  var script = document.createElement('script');
  script.id = 'tmpScript';
  script.appendChild(document.createTextNode(scriptContent));
  (document.body || document.head || document.documentElement).appendChild(script);
  for (var i = 0; i < variables.length; i++) {
      var currVariable = variables[i];
      ret[currVariable] = $("body").attr("tmp_" + currVariable);
      $("body").removeAttr("tmp_" + currVariable);
  }
  $("#tmpScript").remove();
  return ret;
}

function base64_decode(data) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do { // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return dec.replace(/\0+$/, '');
}