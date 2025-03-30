(function (window) {

    'use strict';

    var mainContainer = document.getElementById('swup'),
        openCtrl = document.getElementById('btn-search'),
        closeCtrl = document.getElementById('btn-search-close'),
        searchContainer = document.querySelector('.search'),
        inputSearch = searchContainer.querySelector('.search__input'),
        headerLinks = $('header a:not(#btn-search)');


    function init() {
        initEvents();
    }

    function initEvents() {
        openCtrl.addEventListener('click', openSearch);
        closeCtrl.addEventListener('click', closeSearch);
        document.addEventListener('keyup', function (ev) {
            // escape key.
            if (ev.keyCode == 27) {
                closeSearch();
            }

        });

    }

    function openSearch() {
        mainContainer.classList.add('main-wrap--move');
        searchContainer.classList.add('search--open');
        $(headerLinks).on('click', closeSearch);
        openCtrl.style.display = "none";
        closeCtrl.style.display = "inline-block";
        //$("#search__input").focusout(); 
        $("#search__input").value = '';
        document.getElementById("typedtext-all").innerHTML = '';
        var i = 0;
        var txt = 'What are you looking for?';
        var speed = 30;

        function typeWriter() {
            if (i < txt.length) {
                document.getElementById("typedtext-all").innerHTML += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }

        typeWriter();

        //forfocus();
        $("html").keypress(function () {
            $("#search__input").focus();
        });
        // setTimeout(function() {
        // 	inputSearch.focus();
        // }, 600);
    }


    function closeSearch() {
        mainContainer.classList.remove('main-wrap--move');
        searchContainer.classList.remove('search--open');
        openCtrl.style.display = "inline-block";
        closeCtrl.style.display = "none";
        inputSearch.blur();
        inputSearch.value = '';
        $("#search__input").focusout();
        $("#typedtext-all").empty();
        if (!$(this).val()) {
            $('#typedtext').show();
            $('.underscore').show();
        }
        $("html").unbind("keypress");
        document.getElementById("typedtext-all").innerHTML = '';
        //forfocusout();
        //$("#search__input").focusout(); 
        // $("#search__input").value = '';
        // $("#search__input").blur();




    }

    function forfocus() {
        if ($(".search--open").length) {
            inputSearch.keypress(function () {
                inputSearch.focus();
            });
        }
    }

    function forfocusout() {
        //$("#search__input").keypress(function(){
        inputSearch.focusout();
        inputSearch.value = '';
        //});
        // $("body").trigger("click");

    }

    init();

})(window);

$(document).ready(function(){
    $("#search__input").focus(function () {
        $('#typedtext').hide();
        $('.underscore').hide();

        //return false;
    });
    
    $('#search__input').blur(function () {
        if (!$(this).val()) {
            $('#typedtext').show();
            $('.underscore').show();
        }
    });
});