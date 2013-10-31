<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$existingId = arg(2);
$project = null;
if (isset($_GET['project'])) {
 $project = $_GET['project'];
}
$modulePath =  drupal_get_path('module', 'repository');
?>
<div id="alerts"></div>
<div id="metadata"
 <?php if (austese_access('edit metadata', $project)): ?>
  data-editable="true"
 <?php endif; ?>
 <?php if ($project):?>
 data-project="<?php print $project; ?>"
 <?php endif; ?>
 <?php if ($existingId):?>
   data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print $modulePath; ?>"
 data-servername="<?php print $_SERVER['SERVER_NAME']; ?>"
 data-apitype="<?php print $apiType;?>">
</div>

    

<div class="container-fluid fill">
<div class="row-fluid">
<div id="result" class="span8"></div>
<?php if ($apiType!='place'):?>
<div class="actionsidebar span4 filler">
<div>
<ul class="actionLinks">

   <?php if ($apiType=='resource'):?>
   <li><i class="icon-download-alt"></i> <a href="/<?php print $modulePath; ?>/api/<?php print $apiType; ?>s/<?php print $existingId; ?>">DOWNLOAD</a></li>
   <li><i class="icon-eye-open"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content<?php if ($project): print '?project='.$project; endif; ?>">VIEW CONTENT</a></li>
   <li style="display:none" id="wordcloudlink"><i class="icon-eye-open"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content?cloud=true<?php if ($project): print '&project='.$project; endif; ?>">VIEW WORD CLOUD</a></li>
   <li style="display:none" id="lightboxlink"><i class="icon-eye-open"></i> <a  href="/lightbox<?php if ($project): print '?project='.$project; endif; ?>#<?php print $existingId; ?>">VIEW IN LIGHTBOX</a></li>
   <li id="pdflink"><i class="icon-book"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content/pdf">EXPORT PDF</a></li>
   <li id="mswordlink"><i class="icon-book"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/<?php print $existingId; ?>/content/word">EXPORT WORD DOC</a></li>
   <?php endif; ?>
  
   <?php if (austese_access('edit metadata', $project)): ?>
      <?php if ($apiType=='resource'):?>
        <li><i class="icon-th"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s<?php if ($project): print '?project='.$project; endif; ?>#<?php print $existingId; ?>">SHOW IN ORGANISER</a></li>
        
      <?php endif; ?>
      <li id="editlink" ><i class="icon-edit"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/edit/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">EDIT
      <?php if ($apiType=='resource'):?> CONTENT<?php endif; ?>
      </a></li>
   <?php endif; ?>
   
   <?php if ($apiType=='work'):?><li><i class="icon-book"></i> <a href="/reading/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">READ</a></li><?php endif; ?>
 <li><i class="icon-asterisk"></i> <a href="/<?php print $modulePrefix; ?>/<?php print $apiType; ?>s/visualize/<?php print $existingId; ?><?php if ($project): print "?project=".$project; endif; ?>">VISUALIZE CONNECTIONS</a></li>
 </ul>
 <?php if ($apiType=='resource'):?>
 <div style="margin-top:1em" id="viewmvd"></div>
 <?php endif; ?>
 <div style="margin-top:1em" id="relatedObjects"></div>
</div>

<!--  h4>History:</h4>
<div id="history">No other revisions available</div-->
</div>
<?php endif; ?>
</div>
</div>
