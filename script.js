async function fetchESPNTable() {
  const url = "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings";
  const container = document.getElementById('pl-table-container');

  try {
    const response = await fetch(url);
    const data = await response.json();
    const standings = data.children[0].standings.entries;

    let tableHTML = `
      <table class="pl-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Club</th>
            <th>MP</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
    `;

    standings.forEach(entry => {
      const team = entry.team;
      const stats = entry.stats;

      const rank = stats.find(s => s.type === "rank")?.displayValue;
      const gp = stats.find(s => s.type === "gamesplayed")?.displayValue;
      const gd = stats.find(s => s.type === "pointdifferential")?.displayValue;
      const pts = stats.find(s => s.type === "points")?.displayValue;

      const isUnited = team.id === "360";
      const rowClass = isUnited ? 'class="highlight-united"' : '';

      tableHTML += `
        <tr ${rowClass}>
          <td>${rank}</td>
          <td class="team-cell">
            <img src="${team.logos[0].href}" alt="" class="table-logo">
            ${team.displayName}
          </td>
          <td>${gp}</td>
          <td>${gd}</td>
          <td>${pts}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    container.innerHTML = tableHTML;

  } catch (error) {
    console.error("API Error:", error);
    container.innerHTML = "<div class='loading'>Failed to load live data.</div>";
  }
}

fetchESPNTable();
