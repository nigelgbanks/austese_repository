jQuery.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     jQuery.each(a, function() {
         if (o[this.name] !== undefined) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
};
(function(){
    var apiType = null;
    var modulePath = null;
    var modulePrefix = null;
    var hasEditPermission = false;
    var apiOperation = null;
    var existingId = null;
    var templates = {};
    jQuery(document).ready(function(){
        var metadata = jQuery('#metadata');
        // read parameters from data attributes set in the template
        apiType = metadata.data('apitype');
        apiOperation = metadata.data('apioperation');
        modulePath = metadata.data('modulepath');
        modulePrefix = metadata.data('moduleprefix');
        existingId = metadata.data('existingid');
        // Note: it is drupal that actually enforces these permissions, 
        // the data attributes are only used to control whether to display the associated UI elements
        hasEditPermission = metadata.data('editable');
        if (apiOperation == "load"){
            // display list of results
            setUpTemplates();
            loadObjects(0);
            // set up handler for filter field
            jQuery('#filter').keyup(function(e) {
              if (e.keyCode == 13) {
                loadObjects(0,jQuery('#filter').val());
              }
            });
        } else if (apiOperation == "edit"){
            jQuery('#save-btn').on('click',onSave);
            if (existingId) {
             loadObjectIntoEditor(existingId);
             jQuery('#del-btn').css('display','inline').on('click',onDelete);
            }
        
        } else {
            setUpTemplates();
            loadObject(existingId);
        }
        // set up search fields
        if (typeof (jQuery().tokenInput) == 'function'){
            jQuery("#artefacts").tokenInput("/" + modulePath + "/api/artefacts/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search artefacts by source",
                jsonContainer: "results",
                propertyToSearch: "source",
                resultsFormatter: function(item){return "<li><b>" + item.source + "</b>, " + item.date + ", " + item.bibDetails;},
                tokenFormatter: function(item){return "<li>" + item.source + ", " + item.date + ", " + item.bibDetails + "</li>";}
            });
            jQuery('#places').tokenInput("/" + modulePath + "/api/places/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search places by name",
                jsonContainer: "results",
                propertyToSearch: "name",
                resultsFormatter: function(item){return "<li><b>" + item.name + "</b>, " + item.state;},
                tokenFormatter: function(item){return "<li>" + item.name + ", " + item.state + "</li>";}
            });
            jQuery("#versions").tokenInput("/" + modulePath + "/api/versions/", {
                theme: "facebook",
                tokenValue: "id",
                hintText: "Start typing to search versions by title",
                jsonContainer: "results",
                propertyToSearch: "versionTitle",
                resultsFormatter: function(item){return "<li><b>"+item.versionTitle + "</b>, " + item.name + ", " + item.date + "<br/>"+item.firstLine;},
                tokenFormatter: function(item){return "<li>" + item.versionTitle + ", " + item.name + ", " + item.date + "</li>";}
            });
        }
    });
    function setUpTemplates(){
        templates.versionSummary = new Ext.XTemplate(
            '<div class="obj">',
                '<h4><a href="/{modulePrefix}/versions/{id}">{versionTitle} <tpl if="name">({name})</tpl></a></h4>',
                '{date} {publisher}',
                '<tpl if="description"><br/>{description: ellipsis(100)}</tpl>',
                '<tpl if="firstLine"><br/><em>{firstLine}</em></tpl>',
                '<tpl for="artefacts"><tpl if="xindex == 1"><br/>({[xcount]} associated artefact{[xcount != 1? "s" : ""]})</tpl></tpl>',
                '<tpl if="hasEditPermission"><p><a href="/{modulePrefix}/versions/edit/{id}" style="font-size:smaller">EDIT</a></p></tpl>',
            '</div>'
        );
        templates.versionSummary.compile();
        templates.versionDetail = new Ext.XTemplate(
                '<div>',
                    '<table class="table">',
                    '<tpl if="versionTitle"><tr><td class="metadatalabel muted">Title</td><td>{versionTitle}</td></tr></tpl>',
                    '<tpl if="name"><tr><td class="metadatalabel muted">Name</td><td>{name}</td></tr></tpl>',
                    '<tpl if="date"><tr><td class="metadatalabel muted">Date</td><td>{date}</td></tr></tpl>',
                    '<tpl if="publisher"><tr><td class="metadatalabel muted">Publisher</td><td>{publisher}</td></tr></tpl>',
                    '<tpl if="description"><tr><td class="metadatalabel muted">Description</td><td>{description}</td></tr></tpl>',
                    '<tpl if="illust"><tr><td class="metadatalabel muted">Illustrations</td><td>{illust}</td></tr></tpl>',
                    '<tpl if="firstLine"><tr><td class="metadatalabel muted">First Line</td><td>{firstLine}</td></tr></tpl>',
                    '</table>',
                    '<tpl for="artefacts">',
                    '<tpl if="xindex == 1"><h3 class="muted">Artefacts</h3><p>{[xcount]} artefact{[xcount != 1? "s" : ""]} associated with this version:</p></tpl>',
                    '<ul>',
                        '<li><div class="artefact" data-artefactid="{.}" data-template="summary"></div></li>',
                    '</ul></tpl>',
                    '<tpl for="places">',
                    '<tpl if="xindex == 1"><h3 class="muted">Places</h3><p>{[xcount]} place{[xcount != 1? "s" : ""]} associated with this version:</p></tpl>',
                    '<ul>',
                    '<li class="place" data-placeid="{.}" data-template="compact"></li>',
                    '</ul></tpl>',
                '</div>'
            );
        templates.versionDetail.compile();
        templates.agentSummary = new Ext.XTemplate(
                '<div class="obj">',
                '<h4><a href="/{modulePrefix}/agents/{id}">{lastName}, {firstName}</a></h4>',
                '<tpl if="birthDate"> b. {birthDate}, </tpl>',
                '<tpl if="deathDate"> d. {deathDate}, </tpl>',
                '{biography:ellipsis(200)}',
                '<tpl if="hasEditPermission">',
                    '<p><a href="/{modulePrefix}/agents/edit/{id}" style="font-size:smaller">EDIT</a></p>',
                '</tpl>',
                '</div>'
        );
        templates.agentSummary.compile();
        templates.agentDetail = new Ext.XTemplate(
                '<div>',
                '<table class="table">',
                '<tpl if="lastName"><tr><td class="metadatalabel muted">Last Name</td><td>{lastName}</td></tr></tpl>',
                '<tpl if="firstName"><tr><td class="metadatalabel muted">Given Name(s)</td><td>{firstName}</td></tr></tpl>',
                '<tpl if="birthDate"><tr><td class="metadatalabel muted">Born</td><td>{birthDate}</td></tr></tpl>',
                '<tpl if="deathDate"><tr><td class="metadatalabel muted">Died</td><td>{deathDate}</td></tr></tpl>',
                '<tpl if="biography"><tr><td class="metadatalabel muted">Biography</td><td>{biography}</td></tr></tpl>',
                '</table>',
                '</div>'
        );
        templates.agentDetail.compile();
        templates.artefactSummary = new Ext.XTemplate(
                '<div class="obj">',
                '<h4><a href="/{modulePrefix}/artefacts/{id}">{source}</a></h4>',
                '{date}, {bibDetails:ellipsis(100)}',
                '<tpl if="hasEditPermission">',
                    '<p><a href="/{modulePrefix}/artefacts/edit/{id}" style="font-size:smaller">EDIT</a></p>',
                '</tpl>',
                '</div>'
        );
        templates.artefactSummary.compile();
        templates.artefactDetail = new Ext.XTemplate(
                '<div>',
                '<table class="table">',
                '<tpl if="source"><tr><td class="metadatalabel muted">Source</td><td>{source}</td></tr></tpl>',
                '<tpl if="date"><tr><td class="metadatalabel muted">Date</td><td>{date}</td></tr></tpl>',
                '<tpl if="bibDetails"><tr><td class="metadatalabel muted">Bibliographic Details</td><td>{bibDetails}</td></tr></tpl>',
                '</table>',
                '</div>'
        );
        templates.artefactDetail.compile();
        templates.workSummary = new Ext.XTemplate(
                '<div class="obj">',
                '<h4><a href="/{modulePrefix}/works/{id}">{workTitle}<tpl if="name"> ({name})</tpl></a></h4>',
                '<tpl for="versions"><tpl if="xindex == 1">({[xcount]} associated version{[xcount != 1? "s" : ""]})</tpl></tpl>',
                '<tpl if="hasEditPermission">',
                    '<p><a href="/{modulePrefix}/works/edit/{id}" style="font-size:smaller">EDIT</a></p>',
                '</tpl>',
                '</div>'
        );
        templates.workSummary.compile();
        templates.workDetail = new Ext.XTemplate(
                '<div>',
                '<table class="table">',
                '<tpl if="workTitle"><tr><td class="metadatalabel muted">Title</td><td>{workTitle}</td></tr></tpl>',
                '<tpl if="name"><tr><td class="metadatalabel muted">Name</td><td>{name}</td></tr></tpl>',
                '</table>',
                
                '<h3>Versions</h3><tpl for="versions"><ul>',
                '<li class="version" data-versionid="{.}" data-template="summary"></li>',
                '</ul></tpl>',
                '</div>'
        );
        templates.workDetail.compile();
        templates.placeCompact = new Ext.XTemplate(
                '<div>',
                '<h4><a href="/{modulePrefix}/places/{id}">{name}, {state}</a></h4>',
                '<p>Feature Type: <span class="featureCode">{featureCode }</span></p>',
                '</div>'
        );
        templates.placeCompact.compile();
        templates.placeSummary = new Ext.XTemplate(
            '<div class="span3 obj">',
                '<div class="placedesc">',
                '<h4><a href="/{modulePrefix}/places/{id}">{name}, {state}</a></h4>',
                '<p>Feature Type: <span class="featureCode" data-truncate="true">{featureCode }</span></p>',
                '</div>',
                '<div class="minimap" data-lat="{latitude}" data-long="{longitude}"></div>',
            '</div>'
        );
        templates.placeSummary.compile();
        templates.placeDetail = new Ext.XTemplate(
            '<div class="span6">',
                '<table class="table">',
                '<tr><td class="metadatalabel muted">Name</td><td>{name}</td></tr>',
                '<tr><td class="muted">State</td><td>{state}</td></tr>',
                '<tr><td class="muted">Longitude</td><td>{longitude}</td></tr>',
                '<tr><td class="muted">Latitude</td><td>{latitude}</td></tr>',
                '<tr><td class="muted">Feature Type</td><td><span class="featureCode">{featureCode }</span></td></tr>',
                '</table>',
            '</div>',
            '<div class="span6 minimap" data-lat="{latitude}" data-long="{longitude}"></div>'
        );
        templates.placeDetail.compile();
        templates.resourceDetail = new Ext.XTemplate(
                //'<h2>{[values.metadata.title || values.filename]}</h2>',
                '<div>',
                '<h3>Metadata</h3>',
                '<table class="table">',
                '<tpl if="metadata.title"><tr><td class="metadatalabel muted">Title</td><td>{metadata.title}</td></tr></tpl>',
                '<tpl if="metadata.description"><tr><td class="muted">Description</td><td>{metadata.description}</td></tr></tpl>',
                '<tpl if="metadata.coverage"><tr><td class="muted">Coverage</td><td>{metadata.coverage}</td></tr></tpl>',
                '<tpl if="metadata.format"><tr><td class="muted">Format</td><td>{metadata.format}</td></tr></tpl>',
                '<tpl if="metadata.language"><tr><td class="muted">Language</td><td>{metadata.language}</td></tr></tpl>',
                '<tpl if="metadata.publisher"><tr><td class="muted">Publisher</td><td>{metadata.publisher}</td></tr></tpl>',
                //Ext 4.1.2 only
                //'<tpl foreach="metadata">',
                //    '<tr><td class="muted">{$}</td><td>{.}</td></tr>',
                //'</tpl>',
                '</table>',
                '<h3>File information</h3>',
                '<table class="table">',
                '<tr><td class="metadatalabel muted">File name</td><td>{filename} </td></td></td></tr>',
                '<tr><td class="muted">Uploaded</td><td>{[Ext.util.Format.date(new Date(values.uploadDate.sec*1000),"d/m/Y g:i a")]}</td></tr>',
                '<tr><td class="muted">File type</td><td>{metadata.filetype}</td></tr>',
                '<tr><td class="muted">File size</td><td>{length:fileSize}</td></tr>',
                '<tr><td class="muted">MD5 checksum</td><td>{md5}</td></tr>',
                '</table>',
                '<p><a href="{uri}"><i class="icon-download"></i> Download resource</a></p>',
                '<tpl if="metadata.filetype.match(\'image\')"><img class="thumbnail" src="{uri}" alt="Image preview"></tpl>',
            '</div>'
        );
        templates.resourceDetail.compile();
    }
    function loadObject(id){
        var template = templates[apiType + 'Detail'];
        
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/' + apiType + 's/' + id,
            dataType: "json",
            headers: {
                'Accept': 'application/json'
            },
            success: function(result){
                //console.log("loaded",result)
                result.modulePrefix = modulePrefix;
                template.append('result', result);
                loadReferencedObjects();
                if (apiType == "place"){
                 jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
                } if (result.metadata && result.metadata.filetype.match("image")){
                    jQuery("#editlink").hide();
                }
            }
        });
        
    }
    function loadObjects(page, filterTerm){
        page = page || 0;
        var pageSize = 20;
        if (apiType == 'place'){
            pageSize = 15;
        }
        jQuery.ajax({
           type: 'GET',
           url: '/' + modulePath + '/api/' + apiType + 's/',
           dataType: "json",
           data: {
               pageSize: pageSize,
               pageIndex: page,
               q: (filterTerm?  filterTerm : "")
           },
           success: function(result){
             var rescount = parseInt(result.count);
             var numPages = Math.floor(rescount/pageSize) + 1;
             jQuery('#resultsummary').html("Found " + result.count + " " + apiType + (rescount != 1? "s" : "") + (filterTerm? (" matching '" + filterTerm + "'") : "") + ", ");
             jQuery('#resultcurrent').html("displaying page " + (page + 1) + " of " + numPages); 
             jQuery('#result').empty();
             var template = templates[apiType + "Summary"];
             if (apiType == "place"){
                 jQuery('#result').append('<p class="muted" style="clear:both">Place names taken from <a href="http://www.ga.gov.au/">Geoscience Australia</a> Gazetteer of Australia. Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.</p>');
             }
             for (var i = 0; i < pageSize; i++){
                var obj = result.results[i];
                if (obj){
                    obj.hasEditPermission = hasEditPermission;
                    obj.modulePrefix = modulePrefix;
                    template.append('result', obj);
                }
             }
             loadReferencedObjects();
             updatePager(page, numPages, filterTerm);
           }
        });
    }
    function loadObjectIntoEditor(id){
        jQuery.ajax({
           url: '/' + modulePath + '/api/' + apiType + 's/'+ id,
           success: function(d){
              js2form(document.getElementById('create-object'), d);
              if (d.versions){
                  for (var i = 0; i < d.versions.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/versions/' + d.versions[i],
                     success: function(v){
                       jQuery('#versions').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.artefacts){
                  for (var i = 0; i < d.artefacts.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/artefacts/' + d.artefacts[i],
                     success: function(v){
                       jQuery('#artefacts').tokenInput("add",v);
                     }
                   });
                  }
              }
              if (d.places){
                  for (var i = 0; i < d.places.length; i++){
                   jQuery.ajax({
                     type: 'GET',
                     url: '/' + modulePath + '/api/places/' + d.places[i],
                     success: function(v){
                       jQuery('#places').tokenInput("add",v);
                     }
                   });
                  }
              }
           }
        });
    }
    function onDelete(){
       jQuery.ajax({
          type: 'DELETE',
          url: '/' + modulePath + '/api/' + apiType + 's/' + existingId,
          success: function(d){
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>' 
                    + '<h4>Successfully deleted ' + apiType +'</h4><p><a id="last-minute-undo" href="javascript:void(0);">Undo</a></p>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's">View ' + apiType + 's</a></p></div>').alert());
                jQuery('#last-minute-undo').on('click', onSave);
          }
       });
    }
    function onSave(){
        var type = 'POST';
        var url = '/' + modulePath + '/api/' + apiType + 's/';
        if (existingId) {
           type = 'PUT';
           url += existingId;
        }
        var data = jQuery('#create-object').serializeObject();
        if (data.artefacts){
            var split = data.artefacts.split(",");
            data.artefacts = [];
            for (var i = 0; i < split.length; i++){
               data.artefacts.push(split[i]);
            }
        }
        if (data.versions){
            var split = data.versions.split(",");
            data.versions = [];
            for (var i = 0; i < split.length; i++){
               data.versions.push(split[i]);
            }
        }
        if (data.places){
            var split = data.places.split(",");
            data.places = [];
            for (var i = 0; i < split.length; i++){
               data.places.push(split[i]);
            }
        }
        jQuery.ajax({
          type: type,
          data: JSON.stringify(data),
          url: url,
          success: function(d){
            jQuery('#alerts').append(
                jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button>'
                    + '<h4>Successfully saved ' + apiType + '</h4>'
                    + '<p><a href="/' + modulePrefix + '/' + apiType + 's">View ' + apiType + 's</a></p></div>').alert());
          }
        });
    }
    function loadReferencedObjects(){
        
        jQuery(".place").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/places/' + elem.data('placeid'),
              success: function(d){
                d.modulePrefix = modulePrefix;
                if (template && template == "compact"){
                    elem.html(templates.placeCompact.apply(d));
                } else {
                    elem.html('<a href="/' + modulePrefix + '/places/{id}">' + d.name + ', ' + d.state + '</a>');
                }
              }
            });
        });
        // Load maps and featurecodes (e.g. on view place or list place page)
        jQuery('.minimap').each(function(i, el){
            var lat = jQuery(el).data('lat');
            var long = jQuery(el).data('long');
            var map = L.map(el).setView([lat, long], 6);
            var marker = L.marker([lat, long]).addTo(map);
            var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                subDomains = ['otile1','otile2','otile3','otile4']; 
            var mapquest = L.tileLayer(mapquestUrl, {maxZoom: 18, subdomains: subDomains}).addTo(map);
         });
        displayFeatureCodes(false);
        
        jQuery(".artefact").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/artefacts/' + elem.data('artefactid'),
              success: function(d){
                  d.modulePrefix = modulePrefix;
                  if (template && template == 'summary'){
                      elem.html(templates.artefactSummary.apply(d));
                  } else {
                      var markup = d.source + ", " + d.date + ", " + d.bibDetails;
                      if (hasEditPermission){
                          markup += " <a href='/" + modulePrefix + "/artefacts/edit/" + d.id + "' style='font-size:smaller'>EDIT</a>";
                      }
                      elem.html(markup);
                  }
                  
              }
            });
        });
        
        jQuery(".version").each(function(){
            var elem = jQuery(this);
            var template = elem.data('template');
            jQuery.ajax({
              type: 'GET',
              url: '/' + modulePath + '/api/versions/' + elem.data('versionid'),
              success: function(d){
                d.modulePrefix = modulePrefix;
                if (template && template == 'summary'){
                    elem.html(templates.versionSummary.apply(d));
                } else {
                  var markup = d.versionTitle + ", " + d.name + ", " + d.date ;
                  if (hasEditPermission){
                      markup += " <a href='/" + modulePrefix + "/versions/edit/" + d.id + "' style='font-size:smaller'>EDIT</a>";
                  }
                  elem.html(markup);
                }
              }
            });
          });
    }
    function displayFeatureCodes(){
        jQuery.ajax({
            type: 'GET',
            url: '/' + modulePath + '/api/featurecodes/',
            success: function(d){
                var codes = d.results;
                if (codes){
                    jQuery('.featureCode').each(function(i,el){
                        var truncate = false;
                        if (jQuery(el).data('truncate')){
                            truncate = true;
                        }
                        var featureCode = jQuery(el).html();
                        var featureCodeDesc = codes[featureCode],
                            featureCodeShort = featureCodeDesc;
                        if (truncate && featureCodeDesc.length > 50){
                            featureCodeShort = jQuery.trim(featureCodeShort).substring(0, 50).trim(this) + "...";
                        }
                        jQuery(el).html(featureCodeShort).attr('title',featureCode + ": " + featureCodeDesc);
                    });
                }
            }
          });
    }
    function onSaveResource(){ 
        var formData = new FormData(jQuery('#create-object')[0]);
        jQuery.ajax({
          type: 'POST',
          enctype: 'multipart/form-data',
          data: formData,
          url: '/' + modulePath + '/api/resources/',
          success: function(d){
            jQuery('#alerts').append(jQuery('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">x</button><h4>Resource uploaded</h4></div>').alert());
          }
        });
    }
    function updatePager(page, numPages, filterTerm){
        var startIndex = Math.max(0,page - 5);
        var endIndex = Math.min(numPages, page+5);
        if (page <= 5){
            endIndex += (5 - page);
            endIndex = Math.min(endIndex,numPages);
        }
        jQuery('#pager').empty();
        if (startIndex > 0){
          jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-left'></i></button>").click(function(){
            loadObjects(page-1, filterTerm);
         }));
       }
       for (i = startIndex; i < endIndex; i++){
          var cls = "btn pagebtn";
          if (i == page){
            cls += " btn-highlight";
          }
          jQuery('#pager').append("<button class='" + cls + "'>" + (i + 1) + "</button>");
          
       }
       jQuery('.pagebtn').click(function(){
           var pageNum = parseInt(jQuery(this).html() - 1);
           loadObjects(pageNum,filterTerm);
       });
       if(numPages > endIndex){
           jQuery('#pager').append(jQuery("<button class='btn'><i class='icon-chevron-right'></i></button>").click(function(){
              loadObjects(page+1, filterTerm);
           }));
       }
    }
    
})();