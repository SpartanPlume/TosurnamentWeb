function delete_token() {
	localStorage.removeItem("session_token");
	window.location = "/";
}

export default function fetchApi(input, init = {}) {
	return new Promise((resolve, reject) => {
		fetch("/api" + input, init)
		.then(response =>
			response.status >= 500 ? reject(new TypeError("Could not connect to the server")) : response.json().then(json =>
				response.ok ? resolve(json) : response.status === 403 ? delete_token() : reject(new TypeError(json.error.description))
			)
		)
		.catch(error => reject(error));
	});
}