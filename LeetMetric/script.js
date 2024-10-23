document.addEventListener('DOMContentLoaded', function () {
	
	const searchButton = document.getElementById('search');
	const userInput = document.getElementById('user-input');
	const statsContainer = document.querySelector(".stats-container");
	const easyCircle = document.querySelector(".easy-progress");
	const mediumCircle = document.querySelector(".medium-progress");
	const hardCircle = document.querySelector(".hard-progress");
	const easyLabel = document.getElementById('easy-qs');
	const mediumLabel = document.getElementById('medium-qs');
	const hardLabel = document.getElementById('hard-qs');
	const cardStatsContainer = document.querySelector(".stats-card");


	function validateUsername(username) {
		if (username.trim() === "") {
			alert("Username should not be empty");
			return false;
		}
		const regex = /^[a-zA-Z0-9_-]{1,15}$/;
		const isMatching = regex.test(username);
		if (!isMatching) {
			alert("Invalid username");
		}
		return isMatching;
	}

	async function fetchMetrics(username) {
		try {
			searchButton.textContent = "Searching...";
			searchButton.disabled = true;


			const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
			const targetUrl = 'https://leetcode.com/graphql/';

			const myHeaders = new Headers();
			myHeaders.append("content-type", "application/json");

			const graphql = JSON.stringify({
				query: `query userSessionProgress($username: String!){
					allQuestionsCount {
						difficulty
						count
					}
					matchedUser(username: $username) {
						submitStats {
							acSubmissionNum {
								difficulty
								count
								submissions
							}
							totalSubmissionNum {
								difficulty
								count
								submissions
							}
						}
					}
				}`,
				variables: { "username": `${username}` }
			});

			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: graphql,
				redirect: "follow"
			};

			const response = await fetch(proxyUrl+targetUrl, requestOptions);
			if (!response.ok) {
				throw new Error(`Fetching failed with status ${response.status}`);
			}
			const data = await response.json();
			console.log("Logging data: ", data);
		}
		catch (error) {
			statsContainer.innerHTML = `<p>No data found. Error: ${error.message}</p>`;
		}
		finally {
			searchButton.textContent = "Search";
			searchButton.disabled = false;
		}
	}

	searchButton.addEventListener('click', function () {
		const username = userInput.value;
		console.log(username);
		if (validateUsername(username)) {
			fetchMetrics(username);
		}
	});
})