(function() {

$(document).ready(function(e) {
	accordion.init();
	bab.init();
});

var html = document.documentElement,
	$html = $(html),
	multiplier,
	current = 'current',
	close = 'close',
	open = 'open',
	selected = 'selected',
	jsNone = 'js_none',
	ariaHidden = 'aria-hidden',
	ariaInvalid = 'aria-invalid',
	ariaDescribedBy = 'aria-describedby';

var accordion = {
	init: function() {
		var $accordionLinks = $('.accordion > li > a');
		
		$accordionLinks.on('click', function(e) {
			e.preventDefault();
			$accordionLinks.removeClass(open);
			$(this).addClass(open);
		});
	}
};

var bab = {
	init: function() {
		var query = window.location.search.substring(1),
        params = query.split('&');
		
		for (var i in params) { 
			var keyValue = params[i].split('=');
      keyValue[0].value = keyValue[1];
		}
		
		var totalFlowers = 0,
			$totalFlowers = $('#total_flowers'),
			$qtys = $('.bab_item').find('input[type="number"]');
			
		$qtys.each(function(i) {
			totalFlowers += parseInt($(this)[0].value);
		});
		
		$totalFlowers.html(totalFlowers);
		// $('#total_cost').html('$' + Number(parseFloat($('input[name="unitprice"]')[0].value)).toFixed(2));
	}
};

})();