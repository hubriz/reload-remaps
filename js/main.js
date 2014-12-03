//'use strict';

(function ($) {

    // Dashboard What's News
    
    var kudosNotification = $('.kudos-click'),
        postComment = $('.post-comment'),
        commentsDashboard1ListIndex = $('.comment-dashboard-list > div').length - 2; // Remove - 2 content is not static anymore
    
    // Include ID attribute on each comment divs
    $('.comment-dashboard-list > div').each(function(){
        var commentID = "dashboard-comment-";
        
        $(this).attr( 'id', commentID + commentsDashboard1ListIndex);
        commentsDashboard1ListIndex++;
                
    });
    
    
    // Show Comment box
   postComment.on({
       // Display Comment
        'click' : function(e){       
            $(this).closest('div.media-body').next().toggleClass('hide');
            e.preventDefault();       
        },
       // Remove link underline on hover
       'mouseenter' : function() {
           $(this).css('textDecoration', 'none')
        }
   });
    
    
    //Kudos Tooltip
    kudosNotification.tooltip({
        html: true
    });
    
    
    kudosNotification.on({
        // Remove page refresh
        'click': function(e){
            e.preventDefault();   
        },
        // Remove link underline on hover
        'mouseenter' : function(){
            $(this).css('textDecoration','none')
        }
    });
    
    
    // Calendar
    
    var date = new Date();
    
    var calendar = $('#dashboard-calendar').fullCalendar({
        editable: true
    });
    

    // Sort Sales Menu List
    var salesMenuList = $('#sales-menu-all-list');
    var salesMenuMineList = $('#sales-menu-mine-list');
    var salesAllMenu = [
            [ "Alpha Dog Trainers", "2014-02-25"],
            [ "Izza Colico", "204-02-25" ],
            [ "Bebe", "2014-05-01" ],
            [ "Client", "2014-05-01" ]
        ];
    var salesMineMenu = [
            [ "Alpha Dog Trainers", "2014-02-25"],
            [ "Izza Colico", "204-02-25" ],
            [ "Bebe", "2014-05-01" ],
            [ "Client", "2014-05-01" ]
        ];
    
    salesMenuList.dataTable({ 
        "paging" : false,
        "info" : false,
        "searching" : false,
        "data" : salesAllMenu        
    });
    
    // Sort Sales Mine List
    salesMenuMineList.dataTable({ 
        "paging" : false,
        "info" : false,
        "searching" : false,
        "data" : salesMineMenu        
    });
})(window.jQuery);