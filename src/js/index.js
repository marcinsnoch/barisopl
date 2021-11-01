window.addEventListener("scroll", function () {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.querySelector(".navbar");
    if (scrollTop > 60) {
        navbar.classList.add("scrolled", "nav-dark");
    } else {
        navbar.classList.remove("scrolled", "nav-dark");
    }
});

$(function () {
    $.fn.scrollToTop = function () {
        $(this).hide().removeAttr("fast");
        if ($(window).scrollTop() != "0") {
            $(this).fadeIn("slow");
        }
        var scrollDiv = $(this);
        $(window).on("scroll", function () {
            if ($(window).scrollTop() == "0") {
                $(scrollDiv).fadeOut("fast");
            } else {
                $(scrollDiv).fadeIn("fast");
            }
        });
        $(this).on("click", function () {
            $("html, body").animate(
                {
                    scrollTop: 0,
                },
                "fast"
            );
        });
    };
    $("#toTop").scrollToTop();
});

$(function () {
    const navbar_toggler = document.querySelector(".navbar");
    navbar_toggler.addEventListener("click", function (e) {
        const navbar = document.querySelector(".navbar");
        if (!navbar.classList.contains("scrolled")) {
            navbar.classList.toggle("nav-dark");
        }
    });

    const nav_items = document.querySelectorAll(".navbar li a");
    nav_items.forEach((nav_item) => {
        nav_item.addEventListener("click", function () {
            $(".collapse").collapse("hide");
        });
    });
});

$(function () {
    $("#contact-form").validate({
        submitHandler: function () {
            event.preventDefault();
            var name = $("#nameInput").val();
            var email = $("#emailInput").val();
            var message = $("#messageInput").val();
            // needs for recaptacha ready
            grecaptcha.ready(function () {
                $('input[name="g-recaptcha-response"]').remove();
                // do request for recaptcha token
                // response is promise with passed token
                grecaptcha
                    .execute("6Le7gMwUAAAAAEypKCJc28G_dBc9941sMWVaOUgA", {
                        action: "homepage",
                    })
                    .then(function (token) {
                        // add token to form
                        $("#contact-form").prepend(
                            '<input type="hidden" name="g-recaptcha-response" value="' +
                            token +
                            '">'
                        );
                        $.post(
                            "sendemail.php",
                            { name: name, email: email, message: message, token: token },
                            function (result) {
                                if (result.success) {
                                    $('input[name="g-recaptcha-response"]').remove();
                                    $("#contact-form")[0].reset();
                                    $.notify("Dziękujemy za wiadomość!", {
                                        className: "success",
                                        position: "top center",
                                    });
                                } else {
                                    $.notify("Wystąpił jakiś błąd. Spróbuj ponownie.", {
                                        className: "error",
                                        position: "top center",
                                    });
                                }
                            }
                        );
                    });
            });
        },
        rules: {
            name: { required: true, minlength: 2 },
            email: { required: true, email: true },
            message: { required: true, minlength: 10 },
        },
        messages: {
            name: "Proszę podać imię i nazwisko!",
            email: "Proszę podać adres email!",
            message: "Proszę wpisać wiadomość!",
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).parents().addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents().addClass("has-success").removeClass("has-error");
        },
    });
});