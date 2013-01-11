/* ------------------------------------------------------------------------------------------
 * Titlek: 		c9 popup
 * Author: 		Vlad
 * About:  		Lighweight custom build popup generator
 * options: 
 * 		id					- set an id for the popup
 *		title 				- it appear on the plugin window's titlebar
 *		content 			- the html code you wan't to wrap in the popup
 * 		footer 				- optional; the html code you wan't to put in the footer
 * 		footerText 			- if the footer is not supplied you can add a link that will close the window. this is to specify the text in that link
 *		callback 			- a function you wan't to call when the popup has appeared
 *		duration			- a number determining how long the animation will run when showing/hiding the popup; in milliseconds
 *		closable			- boolean. if true the popup can be closed
 *		listenEsc			- boolean. if it should listen for the user pressing the Esc Key, in order to close the popup
 *		listenOutisdeClick	- boolean. if it should listen for the user clicking outside of the popup, in order to close the it
 *      center              - boolean. if it should center the popup to the viewport
 * --------------------------------------------------------------------------------------- */
 (function( $ ){

  var methods = {
    init : function( options ) { 
    	
		// defaults
		var duration = 100;
	    var settings = $.extend( {
	      'id'					: 'popupc9',
	      'title'				: '',
	      'content'				: '',
	      'footerText' 			: 'Close this window',
	      'duration'			: duration,
	      'closable'			: true,
	      'listenEsc'			: true,
	      'listenOutisdeClick' 	: true
	    }, options);

	    //check to see if the duration supplied by the user is a number
	    if(!isFinite(parseFloat(settings.duration))) {
	    	settings.duration = duration;
	    }
	    //check to see if the duration supplied by the user is positive
	    if(settings.duration < 0) {
			settings.duration = duration;
    	} 

    	//start building the HTML components
	    pHeader = $('<div class="p-header"></div>')
	    			.append($('<div class="p-title">'+settings.title+'</div>'))
	    			.append($('<div class="p-close">Close</div>'));
	    pContent = $('<div class="p-content">'+settings.content+'</div>');
	    pFooter = $('<div class="p-footer"></div>');
	    
	    //check to see if the user has submited some HTML code for the footer area
	    if(settings.footer){
	    	pFooter = $(pFooter).append($(settings.footer));
    	} else {
    		pFooter = $(pFooter).append($('<a class="p-close" href="#">'+settings.footerText+'</a>'));
    	}
	    
	    if(settings.closable) {
		    //all elements that have the p-close class will be able to close the popup
		    $('.popupc9 .p-close').live('click', function(e){
				e.preventDefault();
				$(e.target).parents('.popupc9').popupc9('close');
			});
		    
		    if(settings.listenEsc){
			    //close all modals when you hit the Esc key. normaly there should be only one open
			    pEscape = function(e){
					if (e.keyCode == 27) {
						$('.popupc9').popupc9('close');
					}
					//stop listening for the event
					$(document).unbind('keyup',pEscape);
			    }
			    //listen for the Esc key being pressed
			    $(document).keyup(pEscape);
		    }

		    if(settings.listenOutisdeClick){
				//close the modal if you click outside
				pClickOutise = function(e){
					if(!$(e.target).parents('.popupc9')[0]){
						$('.popupc9').popupc9('close');
					}
					$('html').unbind('click',pClickOutise);
				}
				$('html').click(pClickOutise);
		    }
	    }

		
	    
		var classes = "popupc9";
		if(settings.center) {
			classes += " center";
			
			$(window).resize(function(e){
				$('.popupc9.center').each(function(i){
					$(this).css({
						"left" : ($(window).width()-$(this).width())/2,
						"top" : ($(window).height()-$(this).height())/2,
					})
				});
			});
		}
	    //create the popup
	    $("<div id='"+settings.id+"' class='"+classes+"'></div>")
			.append(pHeader)									
			.append(pContent)
			.append(pFooter)
			.appendTo($(this));						//add it to the DOM
		
		//create protection
		if(settings.protection){
			$("<div class='popupc9-protection protection-for-"+settings.id+"'></div>").appendTo($(this)); //add it to the DOM
		}

		$(window).resize(); //center it in the viewport
		
		//save the settings for this element
    	$.data($("#"+settings.id)[0],'settings', settings);
    	
    	//show it than call the callback
    	$("#"+settings.id).fadeIn(settings.duration, settings.callback);
    },
    show : function( ) {
      settings = $.data($(this)[0],'settings');
      	$('.protection-for-'+$(this).attr('id')).fadeIn(settings.duration);
      	$(this).fadeIn(settings.duration);
    },
    hide : function( ) { 
      settings = $.data($(this)[0],'settings');
      $('.protection-for-'+$(this).attr('id')).fadeOut(settings.duration);
      $(this).fadeOut(settings.duration);
    },
    close : function( ) { 
      options = $.data($(this)[0],'settings');
      var settings = $.extend( {
	      'duration'	: 100
	    }, options);
      $('.protection-for-'+$(this).attr('id')).fadeOut(settings.duration);
      $(this).fadeOut(settings.duration,function(){
      	$('.protection-for-'+$(this).attr('id')).remove();
      	$(this).remove();
      });
    },
    update : function( content ) { 
		var settings = $.extend( {
	      'id'			: 'popupc9',
	      'title'		: '',
	      'content'		: '',
	      'footerText' 	: 'Close this window',
	      'duration'	: 100
	    }, content);
		
		$(this)
			.find('.p-title').html(settings.title)
			.end()
			.find('.p-content').html(settings.content);
    },
  };

  $.fn.popupc9 = function( method ) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  };

})( jQuery );