'use strict';

describe('ViTech provided tests for actual pages', function() {
  var pauseAll = true;
  //You can load the runner with runner.html?pauseAll=true to see each page after each test.
  pauseAll = window.location.search.replace( "?pauseAll=", "" );
  
  //You can reload a page before every test if desired.
  //This can slow testing down but make test much more consistent.
  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should render index when user navigates to #', function() {
      
      expect(browser().location().url()).toBe("");
      //You can select all the text from all h5 or any other html element
      expect(element('h3').text()).
        toMatch("What is Singpath");
      if (pauseAll) pause();
  });

  it('should render quests when user navigates to #quests', function() {
      
      browser().navigateTo('#quests');
      
      expect(browser().location().url()).toBe("/quests");
      //You can select all the text from all h5 or any other html element
      expect(element('h5').text()).
        toMatch("Pick a Story");
      if (pauseAll) pause();
  });

 it('should render practice when user navigates to #practice', function() {
      browser().navigateTo('#practice');
      expect(browser().location().url()).toBe("/practice");
      //Example element <ul id="sortable1" class="connectedSortable">
      //You can select by id
      expect(element('#sortable1').text()).
        toMatch("Drag from here.");
      //You can select by class
      expect(element('.connectedSortable').text()).
        toMatch("Drag from here.");
      
      if (pauseAll) pause();
  });


});


/*
describe('Navigate directly to links', function() {

    beforeEach(function() {
      browser().navigateTo('#about');
    });


    it('should render about view when user navigates to #about', function() {
      expect(browser().location().url()).toBe("/about");

      if (pauseAll) pause();
    });

  });


  it('Load the carosel Twitter boostrap page.', function() {
    
    expect(element('.active a:first').text()).
        toMatch("Stories");
    if (pauseAll) pause();
  });

  
*/


