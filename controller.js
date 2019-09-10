$(document).ready(function () {
    var client = null;
    var subscribeTopics = [];

    function enableButtons(action) {
        $("#publish_btn").attr('disabled', action);
        $(".disconnect_btn").attr('disabled', action);
        $(".sub").attr('disabled', action);
    }

    function addRow(topic, payload, timeStamp, tbody) {
        var row = $("<tr>");
        $(row).append($("<td>").text(topic), $("<td>").text(payload), $("<td>").text(timeStamp))
        $(tbody).append($(row))
    }

    enableButtons(true);

    $("#connect_btn").click(function () {
        client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");
        $("#display_status").text("Connecting...")

        client.on("connect", function () {
            $("#display_status").text("Connected")
            $("#display_status").addClass("alert-success");
            Swal.fire({
                type: 'success',//error , succes
                title: 'Successfully Connected!'
            })
            enableButtons(false);
        });


        $(".disconnect_btn").click(function () {
            client.end();
            $("#display_status").removeClass("alert-success");
            $("#display_status").text("Disconnected")
            enableButtons(true);

        })

        $("#publish_btn").click(function () {
            var topic = $("#topic").val();
            var payload = $("#payload").val();
            client.publish(topic, payload)
            addRow(topic, payload, moment().format('MMMM Do YYYY, h:mm:ss a'), "#tbl-body-pub");
            Swal.fire({
                type: 'success',//error , succes
                title: 'Successfully published!'
            })

        })

        $("#subscribe_btn").click(function () {

            var topic_sub = $("#topic-sub").val();

            if (subscribeTopics.includes(topic_sub)) {
                Swal.fire({
                    type: 'info',//error , succes
                    title: 'Topic already Subscribed!'
                })
            } else {
                subscribeTopics.push(topic_sub)
                client.subscribe(topic_sub)
                Swal.fire({
                    type: 'success',//error , succes
                    title: 'Successfully Subscribed!'
                })
                var row = $("<tr>");
                $(row).append($("<td>").text(topic_sub), $("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')))
                $("#tbl-body").append($(row))
            }

        })

        $("#unsubscribe_btn").click(function () {
            var topic_sub = $("#topic-sub").val();
            subscribeTopics.splice(subscribeTopics.indexOf(topic_sub), 1);
            client.unsubscribe(topic_sub)
            Swal.fire({
                type: 'success',//error , succes
                title: 'Successfully Unsubscribed!'
            })
        })
        client.on("message", function (topic, payload) {
            addRow(topic, payload, moment().format('MMMM Do YYYY, h:mm:ss a'), "#tbl-body-sub");
        })

    })

})