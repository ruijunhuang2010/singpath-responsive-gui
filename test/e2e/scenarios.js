'use strict';

describe('Loading controller test', function() {
  var pauseAll = true;
  pauseAll = window.location.search.replace( "?pauseAll=", "" );
  
  //beforeEach(function() {
  //  browser().navigateTo('../../app/controllertest.html');
  //});

 
  it('Should find the ajax-loaded items from each controller.', function() {
    browser().navigateTo('../../app/controllertest.html');
    expect(element(':nth-child(2) .ng-binding').text()).
        toMatch("Player nickname: Ruijun");
    
    expect(element(':nth-child(3) .ng-binding').text()).
        toMatch("Interfaces Count = 12");

    if (pauseAll) pause();
  });

 it('Should find the ajax-loaded items from each controller.', function() {
    browser().navigateTo('../../app/controllertest.html');
    
    expect(element(':nth-child(4) .ng-binding').text()).
        toMatch("Game Player = ChrisNumber of Problems = 21");
    
    expect(element(':nth-child(5) .ng-binding').text()).
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


