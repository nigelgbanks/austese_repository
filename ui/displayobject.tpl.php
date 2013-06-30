<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$existingId = arg(2);
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (user_access('edit metadata')): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($existingId):?>
   data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>"
 data-apitype="<?php print $apiType;?>">
</div>

    

<div class="container-fluid fill">
<div class="row-fluid">
<div id="result" class="span8"></div>
<?php if ($apiType!='place'):?>
<div class="actionsidebar span4 filler">
<div>
 <?php if (user_access('edit metadata')): ?>
   <?php if ($apiType=='resource'):?>
   <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s#<?php print $existingId; ?>">VIEW IN RESOURCE ORGANISER</a><br/>
   <?php endif; ?>
   <a id="editlink" href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/edit/<?php print $existingId; ?>">EDIT
   <?php if ($apiType=='resource'):?> CONTENT<?php endif; ?>
   </a>
   <a style="display:none" id="lightboxlink" href="/lightbox#<?php print $existingId; ?>">VIEW IN LIGHTBOX</a>
 <?php endif; ?>
 <?php if ($apiType=='work'):?><br/><a href="/reading/<?php print $existingId; ?>">VIEW IN READING INTERFACE</a><?php endif; ?>
 <?php if ($apiType=='resource'):?>
 <div style="margin-top:1em" id="viewmvd"></div>
 <?php endif; ?>
</div>

<!--  h4>History:</h4>
<div id="history">No other revisions available</div-->
</div>
<?php endif; ?>
</div>
</div>
