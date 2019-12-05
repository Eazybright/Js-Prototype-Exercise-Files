(function() {

  $(document).ready(function(e) {
    $html.addClass('jquery');
    
    if (layoutEngine.vendor === 'mozilla' && cssua.ua.desktop === 'windows')
      Modernizr.load('/js/jquery.firefox.hwa.min.js');
    
    if (layoutEngine.vendor === 'webkit' && cssua.ua.ios)
      $('label').attr('onclick', '');
    
    placeholder.init();
    slider.init();
    product.gallery();
    checkout.init();
    basket.init();
    tooltips.init();
  });

  var html = document.documentElement,
    $html = $(html),
    multiplier,
    current = 'current',
    close = 'close',
    open = 'open',
    hidden = 'hidden',
    selected = 'selected',
    jsNone = 'js_none',
    ariaHidden = 'aria-hidden',
    ariaInvalid = 'aria-invalid',
    ariaDescribedBy = 'aria-describedby';

  var placeholder = {
    init: function() {
      var pl = 'placeholder';
      if (!Modernizr.input.placeholder) {
        var $placeholder = $('['+pl+']');
        $placeholder.focus(function() {
          var input = $(this);
          if (input.val() == input.attr(pl))
            input.val('').removeClass(pl);
        }).blur(function() {
          var input = $(this);
          if (input.val() == '' || input.val() == input.attr(pl))
            input.addClass(pl).val(input.attr(pl));
        }).blur();
        $placeholder.parents('form').on('submit', function() {
          $(this).find('['+pl+']').each(function() {
            var $input = $(this);
            if ($input.val() == $input.attr(pl))
              $input.val('');
          });
        });
      }
      $html.addClass(pl);
    }
  };

  var slider = {
    init: function() {
      var $sliderParent = $('.feature_slider');
      
      if ($sliderParent.length) {
        $sliderParent.each(function(index) {
          var $this = $(this),
            $slides = $this.find('li'),
            slidesCount = $slides.length;
          
          if (slidesCount > 1) {
            var li = '',
              interval = false,
              nav = true;
              pager = true;
              
            if (!supports.touch && parseInt($this.data('interval')))
              interval = parseInt($this.data('interval')*1000);
            
            if ($this.data('nav') === false) {
              nav = false;
            }
            else {
              var $navPrev = $('<a href="#previous" class="nav prev"><span>Previous</span></a>'),
                $navNext = $('<a href="#next" class="nav next"><span>Next</span></a>');
            }
            
            if ($this.data('pager') === false)
              pager = false;
            else
              var $navPager = $('<ul class="nav_pager reset menu" />');
            
            if (nav)
              $this.append($navPrev).append($navNext);
            
            if (pager)
              $this.append($navPager);
              
            $this.addClass('multiple')
            
            if (Modernizr.csstransforms && !(layoutEngine.vendor === 'ie' && layoutEngine.version === 9)) {
              if (pager) {
                for (var i = 1; i <= slidesCount; i++) {
                  li += '<li><a href="#slide-' + i + '">Slide ' + i + '</a></li>';
                }
                
                $navPager.append(li);
                var $navPagerLi = $navPager.find('li'),
                  $navPagerA = $navPager.find('a');
              }
              
              var $feature = $this.find('.inner');
              var slider = new Swipe($feature[0], {
                callback: function(e, pos) {
                  $slides.attr(ariaHidden, true);
                  $slides.filter(':eq(' + pos + ')').attr(ariaHidden, false);
                  
                  if (pager) {
                    $navPagerLi.removeClass(current);
                    $navPagerLi.filter(':eq(' + pos + ')').addClass(current);
                  }
                  
                  if (!interval)
                    trackEvent('Website', 'Carousel', 'Slide ' + (pos+1));
                }
              });
              
              $slides.filter(':not(:first-child)').attr(ariaHidden, true);
              
              if (pager)
                $navPagerLi.filter(':first-child').addClass(current);
              
              $this.addClass('swipejs');
    
              if (nav) {
                $navPrev.on('click', function(e) {
                  e.preventDefault();
                  slider.prev();
                  if (interval) {
                    window.clearTimeout(timer);
                    interval = false;
                  }
                });
                
                $navNext.on('click', function(e) {
                  e.preventDefault();
                  slider.next();
                  if (interval) {
                    window.clearTimeout(timer);
                    interval = false;
                  }
                });
              }
              
              if (pager) {
                $navPagerA.each(function(idx) {
                  var i = idx;
                  $(this).on('click', function(e) {
                    e.preventDefault();
                    slider.slide(i);
                    $navPagerLi.removeClass(current);
                    $(this).parent().addClass(current);
                    if (interval) {
                      window.clearTimeout(timer);
                      interval = false;
                    }
                  });
                });
              }
              
              var carousel = function() {
                slider.next();
              };
              
              if (interval) {
                timer = window.setInterval(carousel, interval);
                var $tileA = $this.find('.tile a');
                
                $this.find($tileA).hover(
                  function(e) {
                    e.stopPropagation();
                    if (interval)
                      window.clearTimeout(timer);
                  },
                  function(e) {
                    e.stopPropagation();
                    if (interval)
                      timer = window.setInterval(carousel, interval);
                  }
                );
              }
            }
            else {
              var $feature = $this.find('.slider'),
                w = 'width: 100% !important',
                cycleOpts = {
                  activePagerClass: current,
                  cleartypeNoBg: true,
                  fx: 'scrollHorz',
                  speed: 'fast',
                  timeout: interval,
                  after: function(curr, next, opts) {
                    var idx = opts.currSlide
                    $slides.attr(ariaHidden, true);
                    $slides.filter(':eq(' + idx + ')').attr(ariaHidden, false);
                  }
                };
              
              if (nav) {
                $navPrev.attr('id', 'nav_prev-' + index);
                $navNext.attr('id', 'nav_next-' + index);
                cycleOpts.prev = '#nav_prev-' + index;
                cycleOpts.next = '#nav_next-' + index;
              }
              
              if (pager) {
                $navPager.attr('id', 'nav_pager-' + index);
                cycleOpts.pager = '#nav_pager-' + index;
                cycleOpts.pagerAnchorBuilder = function(idx, slide) {
                  return '<li><a href="#slide-' + (idx+1) + '">Slide ' + (idx+1) + '</a></li>';
                }
              }
              
              $feature.attr('style', w);
              $feature.find('li').attr('style', w);
              
              Modernizr.load({
                load: '/js/jquery.cycle.all.min.js',
                complete: function() {
                  $feature.cycle(cycleOpts);
                }
              });
            }
          }
        });
      }
    }
  };

  var product = {
    gallery: function() {
      var $galleryLarge = $('#gallery_lg img'),
        $galleryLinks = $('#gallery_thumbs a');
      
      $galleryLinks.on('click', function(e) {
        e.preventDefault();
        $galleryLinks.removeClass(current);
        var $this = $(this);
        $this.addClass(current);
        $galleryLarge[0].src = $this[0].href.replace('thumb', 'large');
      });
    }
  };

  var $summaryItems,
    summaryTotal = 0,
    $grandTotal,
    grandTotal,
    $subTotal,
    $shippingTotal,
    $shippingOptions,
    shippingCost,
    subTotalCost,
    $checkoutForm;

  var checkout = {
    init: function() {
      $summaryItems = $('.summary_item.checkout');
      if ($summaryItems.length) {
        $summaryItems.each(function() {
          var $this = $(this);
          summaryTotal += (parseInt($this.data('qty')) * parseFloat($this.data('price')));
        });
        summaryTotal = summaryTotal.toFixed(2);
        
        $grandTotal = $('#grand_total');
        $subTotal = $('#sub_total');
        $shippingTotal = $('#shipping_total');
        $shippingOptions = $('input[name="shipping"]');

        $subTotal.text('$' + summaryTotal);
        shippingCost = $shippingOptions.filter(':checked')[0].value;
        checkout.calcTotals();
        
        $shippingOptions.on('change', function() {
          shippingCost = $(this)[0].value;
          checkout.calcTotals();
        });
      }
      checkout.validate();
    },
    calcTotals: function() {
      $shippingTotal.text('$' + shippingCost);
      grandTotal = parseFloat(shippingCost) + parseFloat(summaryTotal);
      grandTotal = grandTotal.toFixed(2);
      $grandTotal.text('$' + grandTotal);
    },
    validate: function() {
      $checkoutForm = $('#checkout_form');
      $checkoutForm.on('submit', function() {
        $('.error').removeClass(jsNone);
        return false;
      });
    }
  };

  var $miniQty = $('#mini_qty'),
    $miniTotal = $('#mini_total'),
    $basketDrawer = $('#basket_drawer'),
    $drawerClose = $('#drawer_close'),
    $drawerSubTotal = $('#drawer_sub_total'),
    $drawerShippingTotal = $('#drawer_shipping_total'),
    $drawerGrandTotal = $('#drawer_grand_total'),
    $basketSubTotal = $('#basket_sub_total'),
    $basketShippingTotal = $('#basket_shipping_total'),
    $basketGrandTotal = $('#basket_grand_total'),
    $miniBasket = $('a.basket');

  var basket = {
    init: function() {
      $('.basket_add').on('submit', function(e) {
        e.preventDefault();
        basket.productAdd($(this), $(this).serializeArray());
        return false;
      });
      
      if (!$.cookie('basket') && !izilla_gup.miniBasket)
        $('#basket_empty').removeClass(hidden);
     else
       basket.calculate();
      
      if (izilla_gup.clearBasket) {
        $.removeCookie('basket');
        $.removeCookie('qty');
        $.removeCookie('shipping');
        $.removeCookie('total');
        var wl = window.location.toString();
        wl = wl.replace('clearBasket=true', '');
        window.location = wl;
      }
      
      $drawerClose.on('click', function(e) {
        e.preventDefault();
        $basketDrawer.slideUp();
      });
      
      $miniBasket.hoverIntent({
        timeout: 500,
        over: function() {
          if (!$miniBasket.hasClass('empty')) {
            if ($.cookie('qty')) {
              if (parseInt($.cookie('qty')) === 1)
                $('.drawer_item').eq(0).removeClass(hidden);
              else
                $('.drawer_item').removeClass(hidden);
              
              $basketDrawer.slideDown();
            }
          }
        },
        out: function() {
          return;
        }
      });
    },
    calculate: function(post) {
      var $basketContents = $('#basket_contents'),
        $basketItems = $('.basket_item'),
        query = window.location.search,
        shipping,
        total,
        grandtotal;
      
      $.cookie('basket', true);
      
      if (!post) {
        window.qtyVar = query.match(/qty=(\d+)/);
        try {
          window.qtyVar = window.qtyVar[1];
        }
        catch (e) {
        }
        window.totalVar = query.match(/total=(\d+(?:.?\d+)?)/);
        try {
          window.totalVar = window.totalVar[1];
        }
        catch (e) {
        }
        window.shippingVar = query.match(/shipping=(\d+(?:.?\d+)?)/);
        try {
          window.shippingVar = window.shippingVar[1];
        }
        catch (e) {
        }
      }
      
      if (window.qtyVar) {
        window.qtyVar = parseInt(window.qtyVar);
        $.cookie('qty', window.qtyVar);
      }
      
      $basketContents.removeClass(hidden);
      for (i = 0; i < $.cookie('qty'); i++) {
        $basketItems.eq(i).removeClass(hidden);
      }
      
      $miniQty.html($.cookie('qty'));
      $miniBasket.removeClass('empty');
      
      if (window.shippingVar)
        window.shippingVar = parseFloat(window.shippingVar);
      
      $.cookie('shipping', window.shippingVar);
      shipping = $.cookie('shipping');
      
      if (shipping == 'null' || shipping === 0 || shipping === '0') {
        shipping = 0;
        $basketShippingTotal.html('$ FREE');
        $drawerShippingTotal.html('$ FREE');
      }
      else {
        $basketShippingTotal.html('$' + Number(shipping).toFixed(2));
        $drawerShippingTotal.html('$' + Number(shipping).toFixed(2));
      }
      
      if (window.totalVar) {
        window.totalVar = parseFloat(window.totalVar);
        $.cookie('total', window.totalVar);
      }

      total = $.cookie('total');
      grandtotal = Number(total) + Number(shipping);
      $basketSubTotal.html('$' + Number(total).toFixed(2));
      $miniTotal.html('$' + Number(total).toFixed(2));
      $drawerSubTotal.html('$' + Number(total).toFixed(2));
      $basketGrandTotal.html('$' + Number(grandtotal).toFixed(2));
      $drawerGrandTotal.html('$' + Number(grandtotal).toFixed(2));
      
      if (post) {
        $('#quick_search').ScrollTo({
          duration: 200,
          onlyIfOutside: true,
        });
        $basketDrawer.slideDown();
        if (window.qtyVar === 1)
          $('.drawer_item').eq(0).removeClass(hidden);
        else
          $('.drawer_item').removeClass(hidden);
      }
    },
    productAdd: function(el, data) {
      var $this = $(el);
      var dataObject = {};
      let newItem;

      for (let i = 0; i < data.length; i++){
        dataObject[data[i]['name']] = data[i]['value'];
      }
      console.log(dataObject);

      if (dataObject.category === 'arrangement') {
        // newItem = {
        //   type: 'floral',
        //   storage: 'cool',
        //   name: dataObject.itemname,
        //   vase: dataObject.vasetype,
        //   quantity: dataObject.qty,
        //   logItem: function() {
        //     console.log('%c' + this.name,'font-weight: bold');
        //     for (let prop in this) {
        //       console.log(' ', prop, ': ', this[prop])
        //     }
        //   }
        // }
        newItem = new Arrangement(dataObject.itemname, dataObject.vasetype, dataObject.qty);
      } else if (dataObject.category === 'live') {
        // newItem = {
        //   type: 'floral',
        //   storage: 'warm',
        //   name: dataObject.itemname,
        //   pot: dataObject.pottype,
        //   quantity: dataObject.qty,
        //   logItem: function() {
        //     console.log('%c' + this.name,'font-weight: bold');
        //     for (let prop in this) {
        //       console.log(' ', prop, ': ', this[prop])
        //     }
        //   }
        // }
        newItem = new Live(dataObject.itemname, dataObject.pottype, dataObject.qty);
      } else if (dataObject.category === 'bouquet') {
        if ($.cookie('bouquetCount')) {
          $.cookie('bouquetCount', parseInt($.cookie('bouquetCount')) + 1);
        } else {
          $.cookie('bouquetCount', 1)
        }
        // newItem = {
        //   type: 'floral',
        //   storage: 'cool',
        //   name: dataObject.category,
        //   vase: dataObject.vasetype,
        //   flowers: {},
        //   logItem: function() {
        //     console.log('%c' + this.name,'font-weight: bold');
        //     for (let prop in this) {
        //       console.log(' ', prop, ': ', this[prop])
        //     }
        //   }
        // }
        newItem = new Bouquet(dataObject.itemname, dataObject.vasetype);
        for (item in dataObject) {
          // if item starts with 'qty' and has a value greater than 0
          if(RegExp('qty.+').test(item) && dataObject[item] > 0) {
            const stemType = item.substr(3);
            const legend = $('#'+item).parent().parent().data('legend');
            const key = legend.replace(/\s/g, '');
            // if item requires a color selection and one has been specified
            if (['CL','GD','R','L','T'].includes(stemType) &&
            dataObject['color' + stemType] !== '---') {
              // add new item, specifying name, quantity, and color
              let stemName = dataObject['color' + stemType];
              // newItem.flowers[key] = {};
              // newItem.flowers[key][stemName] = dataObject[item];
              // newItem.flowers[key].type = 'floral';
              newItem.flowers.addStem(key, dataObject[item], dataObject['color' + stemType]);
            } else {
              // add new item specifying only name and quantity
              // newItem.flowers[key] = {
              //   Default: dataObject[item],
              //   type: 'floral'
              // };
              newItem.flowers.addStem(key, dataObject[item]);
            }
          }
        }
      }
      newItem.logItem();

      if ($.cookie('basket-data')) {
        let cookieData = $.cookie('basket-data');
        let cookieArray = JSON.parse(cookieData);
        cookieArray.push(newItem);
        $.cookie('basket-data', JSON.stringify(cookieArray));
      } else {
        let cookieArray = new Array(newItem);
        $.cookie('basket-data', JSON.stringify(cookieArray));
      }
      console.log(JSON.parse($.cookie('basket-data')));
      
      if ($.cookie('qty'))
        window.qtyVar = parseInt($.cookie('qty'));
      else
        window.qtyVar = 0;
      
      window.qtyVar = window.qtyVar + parseInt($this.find('input[name="qty"]').val());
      
      window.shippingVar = parseFloat($this.find('input[name="shipping"]').val());
      
      if ($.cookie('total'))
        window.totalVar = parseFloat($.cookie('total'));
      else
        window.totalVar = 0;
      
      window.totalVar = window.totalVar + (parseInt($this.find('input[name="qty"]').val()) * parseFloat($this.find('input[name="unitprice"]').val()));
      basket.calculate(true);
    }
  };

  var tooltips = {
    init: function() {
      tooltips.lightbox();
      tooltips.question();
    },
    lightbox: function() {
      var $lightboxLinks = $('.lightbox'),
        $cboxContent = $('#cboxContent'),
        currentLightbox = 0,
        totalLightboxes = $lightboxLinks.length,
        hasrun = false,
        disabled = 'disabled';
      
      $lightboxLinks.each(function(idx) {
        var $this = $(this);
        $this.on('click', function() {
          currentLightbox = idx + 1;
        });
        $this.colorbox({
          current: '{current} of {total}',
          innerHeight: 405,
          innerWidth: 720,
          loop: false,
          opacity: .7,
          onComplete: function() {
            if (!hasrun) {
              $cboxContent.prepend('<span id="cboxPreviousDisabled" /><span id="cboxNextDisabled" /><a href="#previous" id="cboxPreviousLink">Previous</a><a href="#next" id="cboxNextLink">Next</a>');
              hasrun = true;
            }
            $('#cboxPreviousLink, #cboxNextLink').removeClass(disabled);
            if (currentLightbox === 1)
              $('#cboxPreviousLink').addClass(disabled);
            if (currentLightbox === totalLightboxes)
              $('#cboxNextLink').addClass(disabled);
          },
          onClosed: function() {
            currentLightbox = 0;
          }
        });
      });
      
      $('#cboxContent').on('click', '.close_caption', function(e) {
        e.preventDefault();
        $(this).addClass(close);
      });
      
      $('#cboxContent').on('click', '#cboxPrevious', function(e) {
        currentLightbox--;
        if (currentLightbox < totalLightboxes)
          $('#cboxPreviousLink, #cboxNextLink').removeClass(disabled);
        if (currentLightbox === 1)
          $('#cboxPreviousLink').addClass(disabled);
      });
      
      $('#cboxContent').on('click', '#cboxNext', function(e) {
        currentLightbox++;
        if (currentLightbox > 1)
          $('#cboxPreviousLink, #cboxNextLink').removeClass(disabled);
        if (currentLightbox === totalLightboxes)
          $('#cboxNextLink').addClass(disabled);
      });
      
      $('#cboxContent').on('click', '#cboxPreviousLink', function(e) {
        e.preventDefault();
        $('#cboxPrevious').click();
      });
      
      $('#cboxContent').on('click', '#cboxNextLink', function(e) {
        e.preventDefault();
        $('#cboxNext').click();
      });
    },
    question: function() {
      $('.question').on('click', function(e) {
        e.preventDefault();
      });
    }
  };

  function Item() {};
  Item.prototype.type = 'floral';
  Item.prototype.logItem = function() {
    console.log('%c' + this.name,'font-weight: bold');
    for (let prop in this) {
      console.log(' ', prop, ': ', this[prop])
    }
  };

  function Live(name, pot, quantity = 1) {
    this.name = name;
    this.pot = pot;
    this.quantity = quantity;
  }
  Live.prototype = new Item();
  Live.prototype.storage = 'warm';

  function Flower(quantity, color) {
    this[color] = quantity;
  }
  Flower.prototype = new Item();

  function Cut() {};
  Cut.prototype = new Item();
  Cut.prototype.storage = 'cool';

  function Arrangement(name, vase, quantity = 1) {
    this.name = name;
    this.vase = vase;
    this.quantity = quantity;
  }
  Arrangement.prototype = new Cut();

  function Bouquet(name, vase) {
    this.name = name;
    this.vase = vase;
  }
  Bouquet.prototype = new Cut();
  Bouquet.prototype.flowers = {
    addStem: function(name, quantity = 1, color = 'Default') {
      this[name] = new Flower(quantity, color)
    }
  };
})();