// Load Typekit fonts
try { Typekit.load({ async: true }); } catch (ex) {}

// Load Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// Track page view
ga('create', 'UA-90997706-1', 'auto');
ga('send', 'pageview');

// Track outbound links
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  [].forEach.call(document.querySelectorAll('a[href^="http"]'), function ($link) {
    $link.addEventListener('click', function (event) {
      ga('send', 'event', 'Outbound Link', 'click', $link.href, {
        'transport': 'beacon',
        'hitCallback': function () { document.location = $link.href; }
      });

      // Fallback when the `hitCallback` function doesn't work for some reason
      window.setTimeout(function () { document.location = $link.href; }, 1000);

      event.preventDefault();
      event.stopPropagation();

      return false;
    });
  });
}, { once: true });

// Make in-page navigation smoother. This enhances `scroll-behavior: smooth` on `<html>` by adjusting scroll positions
// given the sticky `#nav` element, and by avoiding hash changes
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  [].forEach.call(document.querySelectorAll('a[href^="#"]'), function ($link) {
    $link.addEventListener('click', function (event) {
      var hash = event.target.getAttribute('href');
      var $target = document.querySelector(hash);

      if (!$link.matches('[role="button"]') && $target) {
        window.scrollTo(0, $target.offsetTop - 40);
        ga('send', 'event', 'In-Page Navigation', 'click', hash);
        event.preventDefault();
        event.stopPropagation();

        return false;
      }

      return true;
    });
  });
}, { once: true });

// Activate the overlay of judge profiles
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var $container = document.querySelector('#overlay-container');
  var $owner;
  var $overlay;

  var show_overlay = function () {
    var $button = document.createElement('a');

    document.body.classList.add('overlaying');

    [].forEach.call(document.querySelectorAll('main a'), function ($link) {
      $link.setAttribute('data-tabindex', $link.tabIndex || 0);
      $link.tabIndex = -1;
    });

    $button.href = '#';
    $button.tabIndex = 0;
    $button.classList.add('close');
    $button.setAttribute('role', 'button');
    $button.setAttribute('aria-label', $container.getAttribute('data-close-button-label'));
    $button.addEventListener('click', function (event) {
      hide_overlay();
      event.preventDefault();
      event.stopPropagation();
    }, { once: true });

    $overlay.id += '-overlay';
    $overlay.classList.add('overlay');
    $overlay.setAttribute('role', 'dialog');
    $overlay.setAttribute('aria-modal', 'true');
    $overlay.setAttribute('aria-labelledby', $overlay.id + '-title');
    $overlay.setAttribute('aria-describedby', $overlay.id + '-description');
    $overlay.querySelector('[itemprop="name"]').id = $overlay.id + '-title';
    $overlay.querySelector('[itemprop="description"]').id = $overlay.id + '-description';
    $overlay.appendChild($button);
    $overlay.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
    }, { once: true });

    $container.innerHTML = '';
    $container.appendChild($overlay);
    $container.setAttribute('aria-hidden', 'false');

    $owner.setAttribute('aria-haspopup', 'dialog');
    $owner.setAttribute('aria-owns', $overlay.id);

    $button.focus();
  };

  var hide_overlay = function () {
    if (!$overlay) {
      return;
    }

    document.body.classList.remove('overlaying');

    [].forEach.call(document.querySelectorAll('main a'), function ($link) {
      $link.tabIndex = $link.getAttribute('data-tabindex') || 0;
      $link.removeAttribute('data-tabindex');
    });

    $owner.removeAttribute('aria-haspopup');
    $owner.removeAttribute('aria-owns');
    $owner.focus();
    $owner = undefined;

    $container.setAttribute('aria-hidden', 'true');

    $overlay = undefined;
  };

  // Close the overlay with the Escape key
  window.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
      hide_overlay();
    }
  });

  $container.addEventListener('click', function () {
    hide_overlay();
  });

  [].forEach.call(document.querySelectorAll('#judges a'), function ($link) {
    $link.setAttribute('role', 'button');
    $link.addEventListener('click', function (event) {
      var hash = event.target.getAttribute('href');
      var $_overlay = document.querySelector(hash);

      if ($_overlay) {
        $owner = event.target;
        $overlay = $_overlay.cloneNode(true)
        show_overlay();
        ga('send', 'event', 'Overlay', 'show', hash);
        event.preventDefault();
        event.stopPropagation();

        return false;
      }

      return true;
    });
  });
}, { once: true });
