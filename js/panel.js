const panel = document.getElementById('detail-panel');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');
const closePanelBtn = document.getElementById('close-panel');

function openDetailPanel(itemData) {
  panelTitle.innerText = itemData.title;
  panelBody.innerHTML = itemData.description;
  panel.classList.add('open');
}

function closeDetailPanel() {
  panel.classList.remove('open');
}

closePanelBtn.addEventListener('click', closeDetailPanel);

// Close open interfaces natively if a user clicks an empty section of the field
document.getElementById('viewport').addEventListener('click', (e) => {
  if (e.target.id === 'viewport' || e.target.id === 'space-container') {
    closeDetailPanel();
  }
});