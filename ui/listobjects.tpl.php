<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'edit')
 */
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = "load";
$modulePrefix = drupal_get_path('module', 'repository');
if ($apiType == "artefact"){
    $filterField = "source";
} else if ($apiType == "place" || $apiType == "agent" || $apiType == "collection") {
    $filterField = "name";
} else if ($apiType == "event" || $apiType == "action") {
    $filterField = "description";
} else {
    $filterField = "title";
}
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (user_access('edit metadata')): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($project):?>
 data-project="<?php print $project; ?>"
 <?php endif; ?>
 data-modulepath="<?php print $modulePrefix; ?>"
 data-moduleprefix="<?php print arg(0); ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<div class="row-fluid">
    <div class="span8" id="newobject">
     <?php if (user_access('edit metadata') && $apiType != 'mvd' && $apiType != 'place'): ?>
       <a href="<?php print $apiType; ?>s/edit<?php if ($project) print '?project='.$project; ?>"><button type="button" class="btn"><i class="icon-plus"></i> New <?php print $apiType; ?></button></a>
     <?php endif; ?>
     <?php if ($apiType=='event'):?>
       &nbsp;<a href="/<?php print arg(0); ?>/<?php print $apiType; ?>s/map/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="icon-globe"></i> View Map</button></a>
       &nbsp;<a href="/<?php print arg(0); ?>/<?php print $apiType; ?>s/timeline/<?php if ($project): print "?project=".$project; endif; ?>"><button type="button" class="btn"><i class="icon-time"></i> View Timeline</button></a>
     <?php endif;?>
     </div>
    <?php if ($apiType != "mvd"):?>
    <div class="span2">Sort by: <select  name="sort" id="sort">
       <option selected="true" value="_id">created</option>
       <option value="label"><?php print $filterField; ?></option>
    </select>
    </div>
    <input title="Type filter terms and then hit enter" type="text" placeholder="Filter on <?php print $filterField; ?>" class="span2" id="filter"/>
    <?php endif; ?>
</div>
<div id="resultsummary"></div>
<div id="resultcurrent"></div>
<div id="result"></div>
<div class="btn-toolbar">
    <div class="btn-group" id="pager"></div>
</div>

