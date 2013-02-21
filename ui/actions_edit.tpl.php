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
 data-apioperation="<?php print $apiOperation;?>"
 data-apitype="<?php print $apiType;?>">
</div>
<form id="create-object" class="form-horizontal">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="description">Description</label>
      <div class="controls">
        <input name="description" type="text" class="input-xlarge" id="description">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="actionType">Type</label>
      <div class="controls">
        <input name="actionType" type="text" class="input-xlarge" id="actionType">
        <p class="help-block">E.g. writing, editing, advising, printing, publishing...</p>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="startDate">Began</label>
      <div class="controls">
        <input name="startDate" type="text" class="input-xlarge" id="startDate">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="endDate">Ended</label>
      <div class="controls">
        <input name="endDate" type="text" class="input-xlarge" id="endDate">
      </div>
    </div>
    
    <div class="control-group">
      <label class="control-label" for="artefacts">Artefacts</label>
      <div class="controls">
        <textarea rows="2" name="artefacts" type="text" class="input-xlarge" id="artefacts"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="agents">Agents</label>
      <div class="controls">
        <textarea rows="2" name="agents" type="text" class="input-xlarge" id="agents"></textarea>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="places">Places</label>
      <div class="controls">
        <textarea rows="2" name="places" type="text" class="input-xlarge" id="places"></textarea>
      </div>
    </div>
    
    <div class="control-group">
      <div class="controls">
         <input id="save-btn" type="button" class="btn" value="Save">
         <a href="/<?php print $modulePrefix; ?>/events/<?php if ($existingId): print $existingId; endif; ?>">
         <input type="button" class="btn" value="Cancel"></a>
         <input id="del-btn" style="display:none" type="button" class="btn btn-danger" value="Delete">
      </div>
    </div>
  </fieldset>
</form>