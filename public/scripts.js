document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/songs');
  const songs = await response.json();
  const tableBody = document.querySelector('#songs-table');

  if (songs.length === 0) {
    const div = document.createElement('div');
    div.classList.add('text-center');
    div.textContent = 'No song plays found';
    div.style.gridColumn = 'span 4';
    tableBody.appendChild(div);
  } else {
    songs.forEach(song => {
      const div = document.createElement('div');
      div.innerHTML = `
        <div>${song.title}</div>
        <div>${song.artist}</div>
        <div>${song.play_count}</div>
        <div>${new Date(song.played_at).toLocaleString()}</div>
      `;
      tableBody.appendChild(div);
    });
  }
});
