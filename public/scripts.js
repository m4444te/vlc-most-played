document.addEventListener('DOMContentLoaded', async () => {
  let songs = await fetchSongs();
  renderSongs(songs);

  const sortableHeader = document.querySelector('.sortable');
  sortableHeader.addEventListener('click', () => {
    const sortedSongs = sortSongsByPlayCount(songs);
    toggleSortIcon(sortableHeader);
    renderSongs(sortedSongs);
  });
});

async function fetchSongs() {
  const response = await fetch('/songs');
  const songs = await response.json();
  return songs;
}

function renderSongs(songs) {
  const tableBody = document.querySelector('#songs-table');
  tableBody.innerHTML = '';

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
}

function sortSongsByPlayCount(songs) {
  return songs.sort((a, b) => b.play_count - a.play_count);
}

function toggleSortIcon(header) {
  const icon = header.querySelector('i.fas');
  if (icon.classList.contains('fa-sort')) {
    icon.classList.remove('fa-sort');
    icon.classList.add('fa-sort-down');
  } else if (icon.classList.contains('fa-sort-down')) {
    icon.classList.remove('fa-sort-down');
    icon.classList.add('fa-sort-up');
  } else if (icon.classList.contains('fa-sort-up')) {
    icon.classList.remove('fa-sort-up');
    icon.classList.add('fa-sort-down');
  }
}
