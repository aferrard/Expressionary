module.exports = {


    hello: function (question)
    {
        var contact= question
        var header = '<html>\n' +
            '<head>\n' +
            '    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">\n' +
            '    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div>\n' +
            '    <div>\n' +
            '        <nav class="navbar navbar-inverse" role="navigation" style="padding-left:20px;">\n' +
            '            <ul class="nav navbar-nav">\n' +
            '                <li><a class="nav-link" href="/">Home</a></li>\n' +
            '                <li><a class="nav-link" href="javascript:void(0)" onclick="loadAbout()">About us</a></li>\n' +
            '                <script>\n' +
            '                    function loadAbout() {\n' +
            '                        var xhttp = new XMLHttpRequest();\n' +
            '                        xhttp.onreadystatechange = function() {\n' +
            '                            if (this.readyState == 4 && this.status == 200) {\n' +
            '                                document.getElementById("test1").innerHTML =\n' +
            '                                    this.responseText;\n' +
            '                            }\n' +
            '                        };\n' +
            '                        xhttp.open("GET", "about", true);\n' +
            '                        xhttp.send("about");\n' +
            '                    }\n' +
            '                </script>\n' +
            '                <li class="active"><a href="#">Contact us<span class="sr-only">(current)</span></a></li>\n' +
            '            </ul>\n' +
            '        </nav>\n' +
            '    </div>\n' +
            '    <br/>\n' +
            '    <form class="form-horizontal" role="form" style="width: 50%;" action="http://localhost:3000/contact" method="post">\n' +
            '        <div class="form-group">\n' +
            '            <label for="name" class="col-sm-2 control-label">Name</label>\n' +
            '            <div class="col-sm-10">\n' +
            '                <input type="text" class="form-control" id="name" name="name" placeholder="First & Last Name" value="">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="form-group">\n' +
            '            <label for="email" class="col-sm-2 control-label">Email</label>\n' +
            '            <div class="col-sm-10">\n' +
            '                <input type="email" class="form-control" id="email" name="email" placeholder="example@domain.com" value="">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="form-group">\n' +
            '            <label for="message" class="col-sm-2 control-label">Message</label>\n' +
            '            <div class="col-sm-10">\n' +
            '                <textarea class="form-control" rows="4" name="message"></textarea>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="form-group">\n' +
            '            <label for="human" class="col-sm-2 control-label" id="tempMath">'

        var header2= '</label>\n' +
            '            <div class="col-sm-10">\n' +
            '                <input type="text" class="form-control" id="human" name="human" placeholder="Your Answer">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="form-group">\n' +
            '            <div class="col-sm-10 col-sm-offset-2">\n' +
            '                <input id="submit" name="submit" type="submit" value="Send" class="btn btn-primary">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="form-group">\n' +
            '            <div class="col-sm-10 col-sm-offset-2">\n' +
            '                <! Will be used to display an alert to the users>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </form>\n' +
            '</div>\n' +
            '</body>\n' +
            '</html>'
    // concatenate header string
    // concatenate body string

    return '<!DOCTYPE html>'
        + header + contact + header2;
    }

}