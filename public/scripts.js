document.addEventListener('DOMContentLoaded', async () => {
  let songs = await fetchSongs();
  let sortDirection = 'desc'; // Default sort direction
  renderSongs(songs);

  const sortableHeader = document.querySelector('.sortable');
  sortableHeader.addEventListener('click', () => {
    sortDirection = toggleSortDirection(sortDirection);
    const sortedSongs = sortSongsByPlayCount(songs, sortDirection);
    toggleSortIcon(sortableHeader, sortDirection);
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

function sortSongsByPlayCount(songs, direction) {
  return songs.sort((a, b) => {
    if (direction === 'asc') {
      return a.play_count - b.play_count;
    } else {
      return b.play_count - a.play_count;
    }
  });
}

function toggleSortDirection(currentDirection) {
  return currentDirection === 'asc' ? 'desc' : 'asc';
}

function toggleSortIcon(header, direction) {
  const icon = header.querySelector('i.fas');
  if (direction === 'asc') {
    icon.classList.remove('fa-sort', 'fa-sort-down');
    icon.classList.add('fa-sort-up');
  } else {
    icon.classList.remove('fa-sort', 'fa-sort-up');
    icon.classList.add('fa-sort-down');
  }
}
