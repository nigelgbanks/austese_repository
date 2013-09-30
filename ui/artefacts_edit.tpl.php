<?php 
/* customise template based on page arguments : 
 * arg(0) == 'repository'
 * arg(1) == apiType (e.g. 'artfacts', 'versions', 'works', 'agents' etc.)
 * arg(2) == apiOperation (optional e.g. 'add' or 'edit')
 */
$modulePrefix = arg(0);
$apiType = substr(arg(1),0,-1); // remove the trailing 's'
$apiOperation = arg(2);
$existingId=arg(3);
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
 <?php if ($existingId):?>
 data-existingid="<?php print $existingId; ?>"
 <?php endif; ?>
 data-moduleprefix="<?php print $modulePrefix; ?>"
 data-modulepath="<?php print drupal_get_path('module', 'repository'); ?>"
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<form id="create-object" class="form-horizontal">
  <div class="sticky-bottom well">
    <div class="pull-right">
       <input type="button" class="save-btn btn btn-primary" value="Save">
       <a href="/<?php print $modulePrefix; ?>/artefacts/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
     </div>
  </div>
  <div class="invisi-well">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="source">Title</label>
      <div class="controls">
        <textarea autofocus="true" rows="1" name="source" type="text" class="input-xxlarge" id="source"></textarea>
        <p class="help-block">Short title to identify artefact/source e.g. MS378</p>
        <div id="existingOutput"></div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="date">Date</label>
      <div class="controls">
        <input name="date" type="text" class="input-xxlarge" id="date">
        <p class="help-block">e.g. 1875</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="bibDetails">Bibliographic Details</label>
      <div class="controls">
        <textarea rows="1" name="bibDetails" type="text" class="input-xxlarge" id="bibDetails"></textarea>
        <p class="help-block">Additional bibliographic details e.g. '26 Apr., p. 5e'</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="format">Format</label>
      <div class="controls">
        <textarea rows="1" name="format" type="text" class="input-xxlarge" id="format"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="paperType">Paper Type</label>
      <div class="controls">
        <textarea rows="1" name="paperType" type="text" class="input-xxlarge" id="paperType"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="artefactSize">Size</label>
      <div class="controls">
        <textarea rows="1" name="artefactSize" type="text" class="input-xxlarge" id="artefactSize"></textarea>
      </div>
    </div>
    </fieldset>
    </div>
  <div class="well white-well">
  
  <fieldset>
    <div class="control-group">
    
      <label class="control-label" for="artefacts">Has Part(s)</label>
      <div class="controls ">
        
        <input name="artefacts" type="text" id="artefacts" class="input-xxlarge" />
        <p class="help-block">ArtefactParts associated with this artefact</p>
        <a target="_blank" href="/repository/artefacts/edit<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Describe new artefact part in new tab" class="btn"><i class="icon-plus"></i> New artefact part</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="facsimiles">Facsimiles</label>
      <div class="controls">
        <textarea rows="2" name="facsimiles" type="text" class="input-xxlarge" id="facsimiles"></textarea>
        <p class="help-block">Facsimiles associated with this artefact</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new facsimile resource in new tab" class="btn"><i class="icon-plus"></i> New facsimile</button>
        </a>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="transcriptions">Transcriptions</label>
      <div class="controls">
        <textarea rows="2" name="transcriptions" type="text" class="input-xxlarge" id="transcriptions"></textarea>
        <p class="help-block">Diplomatic transcriptions associated with this artefact</p>
        <a target="_blank" href="/repository/resources<?php if ($project):?>?project=<?php print $project;?><?php endif;?>">
        <button type="button" title="Upload new transcription resource in new tab" class="btn"><i class="icon-plus"></i> New transcription</button>
        </a>
      </div>
    </div>
    </fieldset>
    </div>
    <div class="well">
    <fieldset>
    <div class="control-group">
      <label class="control-label" for="project">Project</label>
      <div class="controls">
        <input type="text" class="input-xxlarge" name="project" id="project"/>
      </div>
    </div>
    <div class="control-group">
        <div class="controls">
          <label class="checkbox">
          <input name="locked" id="locked" type="checkbox"> Locked
          </label>
        </div>
    </div>
  <div class="control-group">
     <div class="controls">
       <input type="button" class="save-btn btn btn-primary" value="Save">
       <a href="/<?php print $modulePrefix; ?>/artefacts/<?php if ($existingId): print $existingId; endif; ?><?php if ($project): print "?project=".$project; endif; ?>">
       <input type="button" class="btn" value="Cancel"></a>
       <input style="display:none" type="button" class="dupe-btn btn" value="Duplicate">
       <input style="display:none" type="button" class="del-btn btn btn-danger" value="Delete">
     </div>
  </div>
  </fieldset>
  </div>
</form>

