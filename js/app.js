const webcamElement = document.getElementById('webcam');

const canvasElement = document.getElementById('canvas');

const snapSoundElement = document.getElementById('snapSound');

const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

let upload_img = '';


$("#webcam-switch").on('click', function () {
    if (jQuery(this).val() === 'Click to Start Camera') {
        $("#webcam-switch").hide();
        $('.md-modal').addClass('md-show');
        webcam.start()
            .then(result => {
                cameraStarted();
                console.log("webcam started");
            })
            .catch(err => {
                displayError();
            });
    }
    else {
        cameraStopped();
        webcam.stop();
        hideUploadImage();
        console.log("webcam stopped");
    }
});

$('#cameraFlip').click(function () {
    webcam.flip();
    webcam.start();
});

$('#closeError').click(function () {
    $("#webcam-switch").prop('checked', false).change();
});

function displayError (err = '') {
    if (err != '') {
        $("#errorMsg").html(err);
    }
    $("#errorMsg").removeClass("d-none");
}

function cameraStarted () {
    $("#errorMsg").addClass("d-none");
    $('.flash').hide();
    $("#webcam-switch").show();
    $("#webcam-switch").val("Turn off camera");
    $("#webcam-switch").addClass('switch-fixed');
    // $("#webcam-control").removeClass("webcam-off");
    // $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    if (webcam.webcamList.length > 1) {
        $("#cameraFlip").removeClass('d-none');
    }
    $("#wpfront-scroll-top-container").addClass("d-none");
    window.scrollTo(0, 0);
    $('body').css('overflow-y', 'hidden');
}

function cameraStopped () {
    $("#errorMsg").addClass("d-none");
    $("#wpfront-scroll-top-container").removeClass("d-none");
    // $("#webcam-control").removeClass("webcam-on");
    // $("#webcam-control").addClass("webcam-off");
    $("#cameraFlip").addClass('d-none');
    $(".webcam-container").addClass("d-none");
    $("#webcam-switch").val("Click to Start Camera");
    $("#webcam-switch").removeClass("switch-fixed");
    $('.md-modal').removeClass('md-show');
}


$("#take-photo").click(function () {
    beforeTakePhoto();
    let picture = webcam.snap();
    document.querySelector('#download-photo').href = picture;
    upload_img = picture;
    afterTakePhoto();
});

function beforeTakePhoto () {
    $('.flash')
        .show()
        .animate({ opacity: 0.3 }, 500)
        .fadeOut(500)
        .css({ 'opacity': 0.7 });
    window.scrollTo(0, 0);
    $('#webcam-control').addClass('d-none');
    $('#cameraControls').addClass('d-none');
}

function showUploadImage (img) {
    document.querySelector('#uploadImg').src = img
    $('#uploadImg').show();
}

function hideUploadImage () {
    $('#uploadImg').hide();
}

function afterTakePhoto () {
    webcam.stop();
    $('#canvas').removeClass('d-none');
    $('#take-photo').addClass('d-none');
    $('#exit-app').removeClass('d-none');
    $('#download-photo').removeClass('d-none');
    $('#upload-photo').removeClass('d-none');
    $('#resume-camera').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
}

function removeCapture () {
    $('#canvas').addClass('d-none');
    $('#webcam-control').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
    $('#take-photo').removeClass('d-none');
    $('#exit-app').addClass('d-none');
    $('#download-photo').addClass('d-none');
    $('#upload-photo').addClass('d-none');
    $('#resume-camera').addClass('d-none');
}

$("#resume-camera").click(function () {
    webcam.stream()
        .then(facingMode => {
            removeCapture();
        });
});

$("#exit-app").click(function () {
    removeCapture();
    $("#webcam-switch").click();
    hideUploadImage();
});

$("#upload-photo").click(function () {
    webcam.stream()
        .then(facingMode => {
            removeCapture();
        });
    showUploadImage(upload_img)
});