
$(document).ready(function () {
	var SubscribedTopics = [];
	$("#status").text("Disconnected");
	$('#btn-connect').click(function () {
		var address = $("#broker_input").val()
		client = mqtt.connect(address);
		console.log('Connect button clicked');
		$("#status").text("Connecting...");
		$("#status").removeClass("alert-secondary");
		$("#status").addClass("alert-warning");
		client.on("connect", function () {
			$("#status").text("Successfully connected");
			$("#status").removeClass("alert-warning");
			$("#status").addClass("alert-secondary");
		});

		Swal.fire({
			position: 'center',
			type: 'success',
			title: 'Your successfully connect to the broker!',
			showConfirmButton: false,
			timer: 1500
		})
		console.log("Connected");
		client.on("message", function (topic, payload) {
			console.log([topic, payload].join(": "));
			var row = $("<tr>");
			$("<td>").text(topic).appendTo($(row));
			$("<td>").text(payload).appendTo($(row));
			$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
			$("#tbl-body").append($(row));
		})


		$(".btn-disconnect").click(function () {
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, disconnect!'
			}).then((result) => {
				if (result.value) {
					client.end();
					Swal.fire(
						'Disconnected!',
						'Your are disconnected to the broker.',
						'success'
					);
					$("#status").text("Disconnected.");
					$("#status").removeClass("alert-warning");
					$("#status").addClass("alert-secondary");
					console.log("Disconnected")
				}
			});

		});

		$("#btn-pub").click(function () {
			var topic = $("#topic").val();
			var payload = $("#message").val();
			if (topic == "" && payload == "") {
				client.publish("", "");
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'Please provide inputs!',
				});
			}
			else {
				client.publish(topic, payload, function (err) {
					if (err) {
						Swal.fire({
							type: 'error',
							title: 'Oops...',
							text: 'An error occurs!',
						});
					} else {
						console.log("Published")
						Swal.fire('Published successfully!')

					}
					var row = $("<tr>");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(payload).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-pub").append($(row));
				});


			}

		});
		$("#btn-sub").click(function () {
			var topic = $("#topic-sub").val();
			if (topic == "") {
				Swal.fire({
					type: 'error',
					title: 'Oops...',
					text: 'An error occurs!',
				});
			} else {

				if (!SubscribedTopics.includes(topic)) {
					client.subscribe(topic)
					SubscribedTopics.push(topic)
					var row = $("<tr>").attr("id", "mysub");
					$("<td>").text(topic).appendTo($(row));
					$("<td>").text(moment().format('MMMM Do YYYY, h:mm:ss a')).appendTo($(row));
					$("#tbl-body-sub").append($(row));
					Swal.fire({
						type: 'success',
						title: 'Subscribed Successfully!'
					});
				} else {
					Swal.fire({
						type: "info",
						title: "Already Subscribed!"
					})
				}
			}
		});
		$("#btn-unsub").click(function () {
			$("#topic-sub").val("");
			$("#mysub").remove();
			Swal.fire("success", "Unsubscribed successfully")
		})

	});
});