$(function () {
    // Init calendar ip address and input auto trim
    InitCalIpAndAutoTrim();

    $("#NormalForm").validate();

});

function afterSubmitShowLoading() {
    if ($('#hiddenBtn').val() == "SaveButton")
        $.isLoading({ text: "Saving...", class: "" });
    else {
        $.isLoading({ text: "Submiting...", class: "" });
    }
}

var savestr = 'Are you sure to save this onboard request? <br />' +
    'We will just save this request but not submit to Jarvis team to review.';
var submitstr = 'Are you sure to submit this onboard request to Jarvis team to reivew?<br/>';
var renewstr = "Are you sure to renew current onboard request?";
var updatestr = "Are you sure to save changes for current onboard request?";

//show the modal confirmation
function SubmitTicket(value, id, str) {
    if (!$("#NormalForm").valid())
        return;

    var errorMessage = "";
    var isAllValid = true;
    if (id !== 'UpdateBtn') {
        if ($("#apisCheckBoxList input:checked").length < 1 && id !== 'RenewBtn') {
            isAllValid = false;
            errorMessage += "Please select at least one Resource API.<br/>";
        }

        //if edit page not upload certificate again don't need to examine certificate
        if (typeof $('#CerDownLoadLink').html() === 'undefined' || $('#CerDownLoadLink').html() === '') {
            if (typeof $('#fileInput').val() === 'undefined' || $('#fileInput').val() === '') {
                isAllValid = false;
                errorMessage += "Please upload certificate.<br/>";
            }
        }

        if ($('#Certificate_CertStatus').val() === 'Invalid') {
            isAllValid = false;
            errorMessage += "Invalid certificate.<br/>";
        }
    }

    if (InputNotNullOrUndefined(isAllValid, errorMessage, function (isAllValid, errorMessage) {
        SubmitOrAlertErrorMessage(isAllValid, errorMessage);
    })) {
        ConfirmModal(value, id, str);
    }

}

//get certificate information
function GetCertInfo() {

    var file = $('#fileInput').val();
    var fileArray = file.split(".");
    if (file == "") {
        $("[id*='Certificate_']").val("");
        return;
    } else if (fileArray[fileArray.length - 1].toLowerCase() !== 'cer') {
        AlertModal('Invalid certificate.');
        return;
    }

    var data = new FormData();
    var files = $("#fileInput").get(0).files;
    // Add the uploaded image content to the form data collection
    if (files.length > 0) {
        data.append("UploadedFile", files[0]);
    } else {
        AlertModal('Please upload certificate.');
        return;
    }

    $.ajax({
        url: '../../api/CertificateInfo/UploadCert',
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        dataType: "json",
        async: false,
        success:
            function (item) {
                if (!(typeof $('#CerDownLoadLink').html() === 'undefined' || $('#CerDownLoadLink').html() === '')) {
                    $('#CerDownLoadLink').remove();
                }
                $('#Certificate_SubjectName').val(item.SubjectName);
                $('#Certificate_CN').val(item.CN);
                $('#Certificate_L').val(item.L);
                $('#Certificate_OU').val(item.CN);
                $('#Certificate_S').val(item.S);
                $('#Certificate_C').val(item.C);
                $('#Certificate_O').val(item.O);
                $('#Certificate_ValidFrom').val(item.ValidFrom);
                $('#Certificate_ValidTo').val(item.ValidTo);
                $('#Certificate_Thumbprint').val(item.Thumbprint);
                $('#Certificate_ValidPeriod').val(item.ValidPeriod);
                $('#Certificate_Status').val(item.Status);
                $('#Certificate_CertStatus').val(item.CertStatus);
                $('#Certificate_Issuer_IssuerName').val(item.Issuer.IssuerName);
                $('#Certificate_Issuer_CN').val(item.Issuer.CN);
                $('#Certificate_Issuer_L').val(item.Issuer.L);
                $('#Certificate_Issuer_OU').val(item.Issuer.OU);
                $('#Certificate_Issuer_S').val(item.Issuer.S);
                $('#Certificate_Issuer_C').val(item.Issuer.C);
                $('#Certificate_Issuer_O').val(item.Issuer.O);
                $('#Certificate_SavePath').val(item.SavePath);
                $('#Certificate_CertificateName').val($("#fileInput").val().split('\\').pop());
                $('#Certificate_CertStatus').attr("style", "color:green");
                if (item.Status) {
                    $('#Certificate_CertStatus').attr("style", "color:green");
                } else {
                    $('#Certificate_CertStatus').attr("style", "color:red");
                }
            },
        error:
            function (request) {
                AlertModal(request.responseText);
                $("[id*='Certificate_']").val("");
                $("#fileInput").val("");
                $('#CerDownLoadLink').remove();
            }
    });
}

//format certificate upload control
$("#fileInput").fileinput({
    allowedFileExtensions: ['cer'],
    showUpload: false,
    showPreview: false
});
