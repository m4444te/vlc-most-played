document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/songs');
  const songs = await response.json();
  const tbody = document.querySelector('#songs-table tbody');

  if (songs.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="4" class="text-center">No song plays found</td>
    `;
    tbody.appendChild(tr);
  } else {
    songs.forEach(song => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.play_count}</td>
        <td>${new Date(song.played_at).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }
});
