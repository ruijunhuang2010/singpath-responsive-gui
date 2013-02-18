'use strict';

describe('Loading controller test', function() {
  var pauseAll = true;
  //You can load the runner with runner.html?pauseAll=true to see each page after each test.
  pauseAll = window.location.search.replace( "?pauseAll=", "" );
  
  //You can reload a page before every test if desired.
  //This can slow testing down but make test much more consistent.
  //beforeEach(function() {
  //  browser().navigateTo('../../app/controllertest.html');
  //});

  it('Should load quests by default', function() {
    browser().navigateTo('../../app/controllertest.html');
    
    //You can select by any element and then a name/value pair on that element. 
    expect(element('li[name="questcount"]').text()).
        toMatch("Started Quests: 2");

    expect(element('li[name="currentquest"]').text()).
        toMatch("Current Quest: ");

    if (pauseAll) pause();
  });

  it('Should load correct quest when buttons are pressed.', function() {
    element('input:nth-child(2)').click();
    
    expect(element('li[name="currentquest"]').text()).
        toMatch("Current Quest: Quest 1");

    element('input:nth-child(3)').click();
    
    expect(element('li[name="currentquest"]').text()).
        toMatch("Current Quest: Quest 2");
        

    if (pauseAll) pause();
  });
 
  it('Should find the ajax-loaded items from PlayerController.', function() {
    //You don't have to reload the page unless you need to reset the values
    //browser().navigateTo('../../app/controllertest.html');
    //you can also just select by DIV order in the page but this can easily break.
    expect(element(':nth-child(4) .ng-binding').text()).
        toMatch("Player nickname: Ruijun");

    if (pauseAll) pause();
  });

it('Should find the ajax-loaded items from InterfacesController.', function() {
    //browser().navigateTo('../../app/controllertest.html');
    //you can also just select by DIV order in the page but this can easily break.
    expect(element('p').text()).
        toMatch("Interfaces Count = 12");

    if (pauseAll) pause();
  });

 it('Should find the ajax-loaded items for GameController.', function() {
    //browser().navigateTo('../../app/controllertest.html');
    
    expect(element(':nth-child(7) .ng-binding').text()).
        toMatch("Game Player = ChrisNumber of Problems = 21");
    
    if (pauseAll) pause();
  });

it('Should find the ajax-loaded items for StoryController.', function() {
    //browser().navigateTo('../../app/controllertest.html');
    
    expect(element(':nth-child(8) .ng-binding').text()).
        toMatch("Story name = My Cool StoryStory url = ae_DKNwK_msNumber of Stories = 1");
    

    if (pauseAll) pause();
  });


});
  /*
   it('should automatically redirect to /contact when last button is pressed.', function() {
    element('.btn:last').click();
    expect(browser().location().url()).toBe("/contact");
    if (pauseAll) pause();


    if (pauseAll) pause();
  });
*/

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


