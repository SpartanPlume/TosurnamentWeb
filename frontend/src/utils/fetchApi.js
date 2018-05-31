export default function fetchApi(input, init = {}) {
	return new Promise((resolve, reject) => {
		fetch(input, init)
		.then(response =>
			response.status >= 500 ? reject(new TypeError("Could not connect to the server")) : response.json().then(json =>
				response.ok ? resolve(json) : reject(new TypeError(json.error.description))
			)
		)
		.catch(error => reject(error));
	});
}