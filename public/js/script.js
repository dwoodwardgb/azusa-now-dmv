'use strict';

function synchCheckboxAndDivVisibility(checkbox, div) {
  if (checkbox.is(':checked')) {
    div.show();
  } else {
    div.hide();
  }
}

$(document).ready(function () {
  // contact preference logic --------------------------------------------------

  var wantsToConnectCheckbox = $('#wantsToConnectCheckbox');
  var contactPreferenceDiv = $('#contactPreferenceDiv');

  wantsToConnectCheckbox.click(function () {
    contactPreferenceDiv.toggle('hidden');
  });

  synchCheckboxAndDivVisibility(wantsToConnectCheckbox, contactPreferenceDiv);

  // states select templating --------------------------------------------------

  var statesSelectTemplate = $('#statesSelectTemplate');

  function renderStatesSelectTemplate(toRender) {
    var newSelect = statesSelectTemplate.clone();
    newSelect.removeAttr('id');
    newSelect.removeAttr('hidden');
    newSelect.attr('name', toRender.attr('data-name'));
    toRender.append(newSelect);
    toRender.removeAttr('data-name');
    return newSelect;
  }

  $('.statesSelect').each(function (_, element) {
    renderStatesSelectTemplate($(element));
  });

  // church form logic ---------------------------------------------------------

  var churchCheckbox = $('#goesToChurchCheckbox');
  var churchForm = $('#churchForm');

  churchCheckbox.click(function () {
    churchForm.toggle('hidden');
  });

  synchCheckboxAndDivVisibility(churchCheckbox, churchForm);

  // community group form logic ------------------------------------------------

  var communityGroupTemplate = $('#communityGroupTemplate');

  function CommunityGroupsManager(container) {
    var count = 0;

    function add() {
      // cloning template
      var newGroup = communityGroupTemplate.clone();
      newGroup.removeAttr('id');
      newGroup.removeAttr('hidden');
      newGroup.find('select').addClass('changeName');

      // setting names straight

      newGroup.find('.changeName').each(function (_, element) {
        element = $(element);
        var newName = element.attr('name').replace('[i]', '[' + count + ']');
        element.attr('name', newName);
        element.removeClass('changeName');
      });

      // adding remover button

      newGroup.find('.remover').click(function () {
        newGroup.remove();
      });

      // connecting with group leaders logic

      var leadersWantToConnectCheckbox = newGroup.find('.leadersWantToConnect');
      var leadersConnectDiv = newGroup.find('.leadersConnectDiv');

      leadersWantToConnectCheckbox.click(function () {
        leadersConnectDiv.toggle('hidden');
      });

      synchCheckboxAndDivVisibility(leadersWantToConnectCheckbox,
                                    leadersConnectDiv);

      var contactForLeadersDiv = newGroup.find('.contactForLeadersDiv');
      var showHideOptions = {
        duration: 400,
        easing: 'swing',
        queue: true
      };

      newGroup.find('.contactForLeadersRadio').change(function () {
        var curVal = $(this).val();
        if (curVal === 'yes') {
          contactForLeadersDiv.hide(showHideOptions);
        } else {
          contactForLeadersDiv.show(showHideOptions);
        }
      });

      // actually adding the new content

      container.append(newGroup);
      count += 1;
    }

    return {
      add: add
    };
  }

  var communityGroupCheckbox = $('#partOfCommunityGroupCheckbox');
  var communityGroupForms = $('#communityGroupForms');
  var communityGroupFormsContainer = $('#communityGroupFormsContainer');

  var communityGroupsManager = CommunityGroupsManager(communityGroupFormsContainer);
  var groupsAddBtn = $('#addCommunityGroupBtn');

  groupsAddBtn.click(function () {
    communityGroupsManager.add();
  });

  communityGroupCheckbox.click(function () {
    communityGroupForms.toggle('hidden');
  });

  communityGroupsManager.add();

  synchCheckboxAndDivVisibility(communityGroupCheckbox, communityGroupForms);

  // form submit logic ---------------------------------------------------------

  var form = $('form');
  form.submit(function () {
    if (!communityGroupCheckbox.is(':checked')) {
      communityGroupFormsContainer.remove();
    }

    return true;
  });

  // ---------------------------------------------------------------------------

});
