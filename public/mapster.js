$(document).ready(function () {

  $('.maparea').mapster({
      onMouseover: function () {

          // $(this).parent().parent().find("area").each(function () {

              var type = $(this).attr("data-key");
                
              if (type != undefined) {
                  
                  $(this).mapster('set', false).mapster('set', true, JSON.parse(type));
              }


          // })
      },
      onMouseout: function () {
          // $(this).parent().parent().find("area").each(function () {
              $(this).mapster('set', false);
          // })
         
      }

  });
  $('.maparea').mapster('resize', 1000, 1000 * $('.maparea').height() / $('.maparea').width());
  function convert(string) {
      return "<div>" + string + "</div>"
  }
  $(".tool").each(function (index) {
      $(this).tooltip({
          tooltipClass: "tooltiptext",
          content: convert((this).title),
          track: true
      })
  });

  function ZoomIn() {
      $(".maparea").animate({
          height: '+=500',
          width: '+=500'
      }, 1, function () {
          $(this).mapster('resize', $(this).width(), $(this).height());
      });
  }

  function ZoomOut() {
      $(".maparea").animate({
          height: '-=500',
          width: '-=500'
      }, 1, function () {
          $(this).mapster('resize', $(this).width(), $(this).height());
      });
  }
  // Demo stuff.
  $('#btn-zoom-in').click(ZoomIn);
  $('#btn-zoom-out').click(ZoomOut);
})
