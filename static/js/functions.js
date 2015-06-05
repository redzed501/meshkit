function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}
function addpackage(package) {
	document.MAINFORM.packages.value += " "+package;
}

function loadScript(url, callback)
{
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   script.onreadystatechange = callback;
   script.onload = callback;

   head.appendChild(script);
}

function themepkgs() {
	var e = document.getElementById('imageconf_theme');
	var selected = e.options[e.selectedIndex].value;
	themepackages = selected;
	update_defaultpkgs();
}

/* Help link toggle */
/* from http://www.websemantics.co.uk/resources/accessible_form_help/scripts/showhide.js */

function addEvent(func){
  if (!document.getElementById | !document.getElementsByTagName) return
  var oldonload=window.onload
  if (typeof window.onload != 'function') {window.onload=func}
  else {window.onload=function() {oldonload(); func()}}
}

addEvent(hideAll)

function hideAll(){
  var obj,nextspan,anchor,content

  // get all spans
  obj=document.getElementsByTagName('span')

  // run through them
  for (var i=0;i<obj.length;i++){

    // if it has a class of helpLink
    if(/helpLink/.test(obj[i].className)){

      // get the adjacent span
      nextspan=obj[i].nextSibling
      while(nextspan.nodeType!=1) nextspan=nextspan.nextSibling

       // hide it
      nextspan.style.display='none'

      //create a new link
      anchor=document.createElement('a')

      // copy original helpLink text and add attributes
      content=document.createTextNode(obj[i].firstChild.nodeValue)
      anchor.appendChild(content)
      anchor.href='#help'
      anchor.title='Click to show help'
      anchor.className=obj[i].className
      anchor.nextspan=nextspan
      anchor.innerHTML='?'
      anchor.onclick=function(){showHide(this.nextspan);changeTitle(this);return false}
      // replace span with created link
      obj[i].replaceChild(anchor,obj[i].firstChild)
    }
  }
}

// used to flip helpLink title
function changeTitle(obj){
  if(obj)
    obj.title = obj.title=='Click to show help' ? 'Click to hide help' : 'Click to show help'
}

// used to flip the display property
function showHide(obj){
  if(obj)
    obj.style.display = obj.style.display=='none' ? 'block' : 'none'
}

/* End helplinktoggle */

/* Toggle Divs */

function ToggleDiv(DivID)
{   
    if (document.getElementById(DivID).style.display == "block")
    {   
        document.getElementById(DivID).style.display = "none";
    }   
    else
    {   
        document.getElementById(DivID).style.display = "block";
    }
}

function displayselect(obj,id1,id2) {
	txt = obj.options[obj.selectedIndex].value;
	document.getElementById(id1).style.display = 'none';
	document.getElementById(id2).style.display = 'none';
	if ( txt.match(id1) ) {
		document.getElementById(id1).style.display = 'block';
	}
	if ( txt.match(id2) ) {
		document.getElementById(id2).style.display = 'block';
	}
}

/* End Toggle Divs */

/* Package list */

var xmlHttpObject = false;

if (typeof XMLHttpRequest != 'undefined') 
{
	xmlHttpObject = new XMLHttpRequest();
}
if (!xmlHttpObject) 
{
	try 
	{
		xmlHttpObject = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch(e) 
	{
	try 
		{
			xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e) 
		{
			xmlHttpObject = null;
		}
	}
}

function loadContent(content)
{
	xmlHttpObject.open('get',content);
	xmlHttpObject.onreadystatechange = handleContent;
	xmlHttpObject.send(null);
	return false;
}

function handleContent()
{
	if (xmlHttpObject.readyState == 4)
	{
	document.getElementById('packagelist').innerHTML = xmlHttpObject.responseText;
	}
}

function handleProfilePkgs()
{
        if (xmlHttpObject.readyState == 4)
        {
		profilepackages=xmlHttpObject.responseText
		profilepackages=eval( "(" + profilepackages + ")" );
		var e = document.getElementById('imageconf_profile');
		var sel = e.options[e.selectedIndex].value
                profilepackages = profilepackages['info'][sel]['packages']
		update_defaultpkgs();
	}
}



function ProfilePkgs(content)
{
        xmlHttpObject.open('get',content);
        xmlHttpObject.onreadystatechange = handleProfilePkgs;
        xmlHttpObject.send(null);
        return false;
}


function sort_unique(array) {
	array.sort();
	for(var i = 1; i < array.length; i++) {
		if (array[i] === array[ i - 1 ]) {
			array.splice(i--, 1);
		}
	}
	return array;
};

function update_defaultpkgs() {

	if( typeof profilepackages != "undefined") {
		packages = profilepackages
	};
        addpackages = '';
	if( typeof user_packagelist != "undefined") {
		if (document.getElementById('imageconf_packages')) {
			addpackages += " " + user_packagelist;
		}
	}
	if( typeof lucipackages != "undefined") { addpackages += " " + lucipackages };
	if( typeof themepackages != "undefined") { addpackages += " " + themepackages };
	if( typeof defaultpackages != "undefined") { packages += " " + defaultpackages };
	if( typeof communitypackages != "undefined") { addpackages += " " + communitypackages };
	if( typeof nosharepackages != "undefined") { addpackages += " " + nosharepackages };
	if( typeof extrapackages != "undefined") { addpackages += " " + extrapackages };
	if( typeof ipv6packages != "undefined") { addpackages += " " + ipv6packages };
        if( typeof qospackages != "undefined") { addpackages += " " + qospackages };

	packages = packages.split(" ").sort();
	packages = packages.join(" ");
	addpackages = addpackages.split(" ")
	addpackages = sort_unique(addpackages);
	addpackages = trim(addpackages.join(" "));

	if (document.getElementById('default_packages')) {
		document.getElementById('default_packages').innerHTML = "<code>" + packages + "</code>";
	}

	if (document.getElementById('imageconf_packages')) {
		document.getElementById('imageconf_packages').value = addpackages;
	}

}


/* End package list */


function pass_status(field_hash) {
    var status = field_hash.data("pass_empty");
    if (field_hash.val().length > 0) {
        status = field_hash.data("pass_set");
        //status += ' (' + field_hash.val() + ')';
    }
    return status
}

function pass_init() {
    $(".password-hash-container").each(function(){
        var container = $(this);
        var field_hash = $(this).children(".password-hash").first();
        var btn_toggle = $(this).children(".password-edit-toggle").first();
        

        var status = pass_status(field_hash);
        btn_toggle.append('<span class="pass-status">' + status + '</span>');
        
        btn_toggle.click(function(e){
            if (! $(this).hasClass("open")) {
                e.preventDefault();
                $(this).addClass("open");
                pass_edit(container);
                return false;
            }
        });
    });
}

/* md5 crypt a password */
function pass_md5crypt(id) {
    var input = $("#" + id);
    var container = $("#" + id + "_container");
    var pw_plain = container.find('.pass-edit-pw1').val();

    if (pw_plain.length > 0) {
        var salt = random_salt(8);
        var hash = md5crypt(pw_plain, salt);
        if (hash.substr(0, 3) === "$1$") {
            input.val(hash);
        } else {
            input.val('');
            alert(input.data("error"));
        }   
    } else {
        alert(input.data("removed"));
        input.val('');
    }
}

function pass_verify(container) {
    var pw1 = container.find(".pass-edit-pw1");
    var pw2 = container.find(".pass-edit-pw2");
    var btn_toggle = container.children(".password-edit-toggle").first();
    
    if (pw1.val().length < 1 && pw2.val().length < 1) {
        pw1.removeClass("match mismatch");
        pw1.removeClass("match mismatch");
    } else {
        if (pw1.val() === pw2.val()) {
            pw1.removeClass("mismatch").addClass("match");
            pw2.removeClass("mismatch").addClass("match");
            btn_toggle.find("button").removeAttr("disabled");
        } else {
            pw1.removeClass("match").addClass("mismatch");
            pw2.removeClass("match").addClass("mismatch");
            btn_toggle.find("button").attr("disabled", "disabled");
        }
    }  
}

function pass_edit(container) {
    var field_hash = container.children(".password-hash").first();
    var btn_toggle = container.children(".password-edit-toggle").first();
    
    var pw1 = $('<input type="password" />')
           .addClass("string form-control pass-edit pass-edit-pw1")
           .attr("placeholder", field_hash.data("placeholder"))
           .keyup(function() {
               pass_verify(container);
           });
  
   
    var pw2 = $('<input type="password" />')
           .addClass("string form-control pass-edit pass-edit-pw2")
           .attr("placeholder", field_hash.data("placeholder_confirm"))
           .keyup(function() {
               pass_verify(container);
           });
   
    var pass_options = $('<div></div>')
            .addClass("pass-options")
    
    var btn_apply = $('<button type="button"></button>')
            .html(field_hash.data("apply"))
            .attr("disabled", "disabled")
            .addClass("btn btn-default")
            .click(function(){
                pass_md5crypt(field_hash.attr('id'));    
                field_hash = container.children(".password-hash").first();
                var status = pass_status(field_hash);
                container.find(".pass-options").remove();
                container.find(".password-edit-toggle").removeClass("open").html(status);
                return false;
            });
            
    pass_options.append(pw1);
    pass_options.append(pw2);
    pass_options.append(btn_apply);
   
    if (btn_toggle.find(".pass-options").length < 1) {
        btn_toggle.html(pass_options);
        //container.children(".pass-options").css({"display": "block", "float": "none" })
        btn_toggle.find(".pass-edit-pw1").focus();
    }
}

/* wizard step2 */

function set_packages() {
    var selected = $("#imageconf_profile").val();
    ProfilePkgs(ajaxUrl + session.target, selected);
}

function themeselect() {
    var selected = $("#imageconf_webif").val();
    if (selected === "none") {
        $("#theme_options").html('');
        lucipackages = "";
        themepackages = "";
        update_defaultpkgs();
    }
    if (selected === "luci") {
        var newdiv = fields.theme;
        document.getElementById("theme_options").innerHTML = newdiv;
        lucipackages = luci_default_packages;
        themepkgs();
        update_defaultpkgs();
        hideAll();
    };
}

function lanselect() {
    var extra_fields = []
    var lan_options = ""
    var selected = $("#imageconf_lanproto").val();
    
    if (selected === "static") {
        $("#lan_options").empty();
    }
    
    if (selected === "olsr") {
        extra_fields = [ "lan_ipv6addr", "landhcp", "landhcprange" ];   
    }
    
    $.each(extra_fields, function( index, value ) {
        if (typeof fields[value] !== 'undefined') {
            lan_options += fields[value];
        }
    });
    
    $("#lan_options").html(lan_options);
    hideAll();
}

function wanselect() {
    var selected = $('#imageconf_wanproto').val();
    var extra_fields = []
    var wan_options = ""
    
    if (selected == 'dhcp') {
        extra_fields = [ "wan_allow_ssh", "wan_allow_web", "localrestrict", "sharenet", "wan_qos" ];
    };
    
    if (selected == 'static') {
        extra_fields = [ "wanipv4addr",  "wannetmask", "wangateway", "wandns", "localrestrict", "sharenet", "wan_allow_ssh", "wan_allow_web", "wan_qos" ];
    }
    if (selected == 'olsr') {
        extra_fields = [ "wanipv4addr",  "wannetmask" ];
    };
    
    $.each(extra_fields, function( index, value ) {
        if (typeof fields[value] !== 'undefined') {
            wan_options += fields[value];
        }
    });
    $('#wan_options').html(wan_options);
    hideAll();
}
;
wanselect();

function toggle_map_container(cmd, target) {
    if (cmd == 'show') {
        var osm1 = function() {
            loadScript('http://www.openstreetmap.org/openlayers/OpenStreetMap.js', osm2);
        };
        $(target).html("<div id='map'></div><div style='font-size:0.8em'>Map by <a href='http://www.openstreetmap.org' title='www.openstreetmap.org'>openstreetmap.org</a>, License CC-BY-SA</div>");
        loadScript('http://www.openlayers.org/api/OpenLayers.js', osm1);
        var osm2 = function() {
            loadScript(assets_js + "osm.js", do_map);
        };
        var do_map = function() {
            init();
            drawmap();
        };

    } else {
        $(target).html("");
    }
}

function nosharepkgs() {
    if (document.getElementById("imageconf_sharenet").checked) {
        nosharepackages = '';
        update_defaultpkgs();
    }
    else {
        nosharepackages = 'freifunk-policyrouting luci-app-freifunk-policyrouting luci-i18n-freifunk-policyrouting-de';
        update_defaultpkgs();
    }
}

function qospkgs() {
    if (document.getElementById("imageconf_wan_qos").checked) {
        qospackages = 'qos-scripts';
        $("#qos-options").html(wan_qos_down + wan_qos_up);
        hideAll();
        update_defaultpkgs();
    }
    else {
        qospackages = '';
        $("#qos-options").html('');
        update_defaultpkgs();
    }
}

function ajax_packagelist() {
    $.ajax({
        url: package_vars.ajaxUrl,
        type: 'get',
        dataType: 'json',
        timeout: 10000,
        tryCount: 0,
        retryLimit: 10,
        success: function(json) {
            var packagelist = "";
            for (var section in json) {
                packagelist += "<h3>" + section + "</h3>";
                packagelist += "<div><table><thead><tr>";
                packagelist += "<th></th>";
                packagelist += "<th width='300px'>" + package_vars.lang.Package + "</th>";
                packagelist += "<th width='450px'>" + package_vars.lang.Version + "</th>";
                packagelist += "<th width='100px'>" + package_vars.lang.Size + "</th>";
                packagelist += "</tr></thead>";
                d = json[section];
                for (var pkg in d) {
                    size = json[section][pkg]['size'];
                    version = json[section][pkg]['version'];
                    packagelist += "<tr>";
                    packagelist += "<td><input type='button' value='+' style='margin:0px 10px 0 0; border:0px' onClick='addpackage(\"" + pkg + "\");'></td>";
                    packagelist += "<td>" + pkg + "</td>";
                    packagelist += "<td>" + version + "</td>";
                    packagelist += "<td>" + size + "</td>";
                    packagelist += "</tr>";
                }
                packagelist += "</table></div>"
            }
            document.getElementById('packagelist').innerHTML = packagelist;
            $(function() {
                $("#packagelist").accordion({heightStyle: "content", collapsible: true, active: false});
            });
        },
        error: function(xhr, textStatus, errorThrown) {
            if (textStatus == 'parsererror') {
                $('#packagelist').html(package_vars.errors.parseError);
                return;
            }
            if (textStatus == 'timeout') {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    $.ajax(this);
                    return;
                }
                $('packagelist').html = package_vars.errors.timeout;
                return;
            }
            if (xhr.status == 500) {
                $('packagelist').html = package_vars.errors.serverError;
            }
            else {
                $('packagelist').html = package_vars.errors.unspecified;
            }
        }
    });
}

function ipv6pkgs() {
    if (document.getElementById("imageconf_ipv6")) {
        if (document.getElementById("imageconf_ipv6").checked) {
            ipv6packages = ipv6packages_default;
            update_defaultpkgs();
        } else {
            ipv6packages = '';
            update_defaultpkgs();
        }
    }
}

function init_step2() {
    $("#accordion").accordion({
        heightStyle: "content" }
    );
    set_packages();
    update_defaultpkgs();
    themeselect();
    themepkgs();
    lanselect();
    wanselect();
    nosharepkgs();
    ipv6pkgs();
    update_defaultpkgs();
    ajax_packagelist();  
    $("#imageconf_profile").change(function() {
        set_packages();
    });
    $("#imageconf_webif").change(function() {
        themeselect();
    });
    $("#imageconf_theme").change(function() {
        themepkgs();
    });
    $("#imageconf_ipv6").change(function() {
        ipv6pkgs();
    });
    $("#imageconf_nodenumber").change(function() {
        FFReg.check(this.value, _ffreg_check_callback);
    });
    $("#imageconf_lanproto").change(function() {
        lanselect();
    });
    $("#imageconf_wanproto").change(function() {
        wanselect();
    });
    $("#imageconf_sharenet").change(function() {
        nosharepkgs();
    });
    $("#imageconf_wan_qos").change(function() {
        qospkgs();
    });
    $("#showmap").click(function() {
        var button = $(this);
        if (button.html() === button.data("hidden")) {
                button.html(button.data("visible"));
                toggle_map_container('show', "#map-container");
        } else {
            button.html(button.data("hidden"));
            toggle_map_container('hide', "#map-container");
        }
    });
}

function set_lang(lang) {
    var date = new Date();
    cookieDate = date.setTime(date.getTime() + (100 * 24 * 60 * 60 * 1000));
    document.cookie = 'all_lang=' + lang + ';expires=' + cookieDate + '';
    window.location.reload();
}

$( document ).ready(function() {
    hideAll();
    pass_init();
    $("#language-select").change(function() {
        set_lang($(this).val())
    });
});


/* end wizard step2 */