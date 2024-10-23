document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search");
  const userInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyCircle = document.querySelector(".easy-progress");
  const mediumCircle = document.querySelector(".medium-progress");
  const hardCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-qs");
  const mediumLabel = document.getElementById("medium-qs");
  const hardLabel = document.getElementById("hard-qs");
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

      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const targetUrl = "https://leetcode.com/graphql/";

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
        variables: { username: `${username}` },
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow",
      };

      const response = await fetch(proxyUrl + targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error(`Fetching failed with status ${response.status}`);
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>No data found. Error: ${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(total, solved, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `$ {progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayData(parsedData) {
    const totalQs = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQs = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQs = parsedData.data.allQuestionsCount[2].count;
    const totalHardQs = parsedData.data.allQuestionsCount[3].count;

    const totalSolved =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const totalEasySolved =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const totalMediumSolved =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const totalHardSolved =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(totalEasyQs, totalEasySolved, easyLabel, easyCircle);
    updateProgress(totalMediumQs, totalMediumSolved, mediumLabel, mediumCircle);
    updateProgress(totalHardQs, totalHardSolved, hardLabel, hardCircle);

    const cardsData = [
      {
        label: "Overall Submissions",
        value:
          parsedData.data.matchedUser.submitStats.acSubmissionNum[0]
            .count,
      },
      {
        label: "Overall Easy Submissions",
        value:
          parsedData.data.matchedUser.submitStats.acSubmissionNum[1]
            .count,
      },
      {
        label: "Overall Medium Submissions",
        value:
          parsedData.data.matchedUser.submitStats.acSubmissionNum[2]
            .count,
      },
      {
        label: "Overall Hard Submissions",
        value:
          parsedData.data.matchedUser.submitStats.acSubmissionNum[3]
            .count,
      },
    ];
    cardStatsContainer.innerHTML = cardsData
      .map(
        (data) =>
          `<div class="card">
        <h4>${data.label}</h4>
        <p>${data.value}</p>
      </div>`
      )
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = userInput.value;
    console.log(username);
    if (validateUsername(username)) {
      fetchMetrics(username);
    }
  });
});
