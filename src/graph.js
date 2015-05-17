$.ajax({ 
  url: '/data'
}).done(function(data) {

  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: JSON.parse(data),
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(id)',
          'text-valign': 'center'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle'
        }),
    layout: {
      name: 'cose'
    }
  });

});
