document.addEventListener('DOMContentLoaded', async () => {
  let songs = await fetchSongs();
  let sortDirection = {
    play_count: 'desc', // Default sort direction
    played_at: 'desc'
  };
  renderSongs(songs);

  const sortableHeaders = document.querySelectorAll('.sortable');
  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const sortBy = header.dataset.sort;
      sortDirection[sortBy] = toggleSortDirection(sortDirection[sortBy]);
      const sortedSongs = sortSongs(songs, sortBy, sortDirection[sortBy]);
      toggleSortIcon(header, sortDirection[sortBy]);
      renderSongs(sortedSongs);
    });
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

function sortSongs(songs, sortBy, direction) {
  return songs.sort((a, b) => {
    if (sortBy === 'play_count') {
      return direction === 'asc' ? a.play_count - b.play_count : b.play_count - a.play_count;
    } else if (sortBy === 'played_at') {
      return direction === 'asc' ? new Date(a.played_at) - new Date(b.played_at) : new Date(b.played_at) - new Date(a.played_at);
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
